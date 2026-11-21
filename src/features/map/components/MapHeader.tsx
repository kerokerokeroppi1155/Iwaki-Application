import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CATEGORY_OPTIONS, CATEGORY_STYLE, type PlaceFilter } from '../constants';

type MapHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
  filter: PlaceFilter;
  onFilterChange: (category: PlaceFilter) => void;
};

export default function MapHeader({ query, onQueryChange, filter, onFilterChange }: MapHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedCategory = filter === 'すべて' ? null : filter;

  const selectCategory = (category: PlaceFilter) => {
    onFilterChange(category);
    setMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="場所・エリア・気になること"
          placeholderTextColor="#9ba7a2"
          returnKeyType="search"
          style={styles.searchInput}
          accessibilityLabel="地図を検索"
        />
        {query.length > 0 && (
          <Pressable onPress={() => onQueryChange('')} accessibilityLabel="検索をクリア">
            <Text style={styles.clearSearch}>×</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setMenuOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel="カテゴリメニュー"
          accessibilityState={{ expanded: menuOpen }}
          style={[styles.menuButton, menuOpen && styles.menuButtonActive]}
        >
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => selectCategory('すべて')} style={[styles.chip, filter === 'すべて' && styles.chipActive]}>
            <Text style={[styles.chipText, filter === 'すべて' && styles.chipTextActive]}>すべて</Text>
          </Pressable>
          {selectedCategory && (
            <Pressable onPress={() => setMenuOpen((open) => !open)} style={[styles.chip, styles.chipActive]}>
              <Text style={[styles.chipText, styles.chipTextActive]}>
                {CATEGORY_STYLE[selectedCategory].icon} {selectedCategory}
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </View>

      {menuOpen && (
        <View style={styles.categoryMenu}>
          {CATEGORY_OPTIONS.map((category) => (
            <Pressable
              key={category}
              onPress={() => selectCategory(category)}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === category }}
              style={[styles.menuItem, filter === category && styles.menuItemSelected]}
            >
              <Text style={[styles.menuItemIcon, { color: CATEGORY_STYLE[category].color }]}>{CATEGORY_STYLE[category].icon}</Text>
              <Text style={[styles.menuItemText, filter === category && styles.menuItemTextSelected]}>{category}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, zIndex: 2, elevation: 8 },
  searchBox: { height: 52, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: '#fffefa', paddingHorizontal: 14, elevation: 5 },
  searchIcon: { color: '#68817a', fontSize: 24, marginRight: 9, marginTop: -3 },
  searchInput: { flex: 1, color: '#183b39', fontSize: 14, paddingVertical: 0 },
  clearSearch: { width: 25, height: 25, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', borderRadius: 13, backgroundColor: '#f1f3ef', color: '#71817d', fontSize: 19 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 11, paddingBottom: 7 },
  menuButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 13, borderWidth: 1, borderColor: '#e2e6df', backgroundColor: '#fffefa', elevation: 2 },
  menuButtonActive: { borderColor: '#276c62', backgroundColor: '#edf5f0' },
  menuIcon: { width: 17, gap: 4 },
  menuLine: { height: 2, borderRadius: 2, backgroundColor: '#276c62' },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 2 },
  chip: { borderWidth: 1, borderColor: '#e2e6df', borderRadius: 22, backgroundColor: '#fffefa', paddingHorizontal: 13, paddingVertical: 8, elevation: 2 },
  chipActive: { backgroundColor: '#276c62', borderColor: '#276c62' },
  chipText: { color: '#53645f', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  categoryMenu: { position: 'absolute', top: 111, left: 16, zIndex: 4, minWidth: 184, padding: 7, borderRadius: 15, backgroundColor: '#fffefa', elevation: 10, shadowColor: '#183b39', shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 7 } },
  menuItem: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 11, borderRadius: 10 },
  menuItemSelected: { backgroundColor: '#edf5f0' },
  menuItemIcon: { width: 20, textAlign: 'center', fontSize: 16, fontWeight: '800' },
  menuItemText: { color: '#53645f', fontSize: 13, fontWeight: '700' },
  menuItemTextSelected: { color: '#183b39' },
});
