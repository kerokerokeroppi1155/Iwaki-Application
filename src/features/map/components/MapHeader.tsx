import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CATEGORIES, CATEGORY_STYLE, type PlaceFilter } from '../constants';

type MapHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
  filter: PlaceFilter;
  onFilterChange: (category: PlaceFilter) => void;
  saved: boolean;
  onToggleSaved: () => void;
};

export default function MapHeader({ query, onQueryChange, filter, onFilterChange, saved, onToggleSaved }: MapHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandPin}>●</Text></View>
          <View>
            <Text style={styles.brandTitle}>いわき暮らしマップ</Text>
            <Text style={styles.brandCaption}>IWAKI, THROUGH LOCAL EYES</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="このエリアを保存" onPress={onToggleSaved} style={styles.saveButton}>
          <Text style={[styles.saveIcon, saved && styles.savedIcon]}>{saved ? '▣' : '♧'}</Text>
        </Pressable>
      </View>

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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow} keyboardShouldPersistTaps="handled">
        {CATEGORIES.map((category) => {
          const active = filter === category;
          const icon = category === 'すべて' ? '' : `${CATEGORY_STYLE[category].icon} `;

          return (
            <Pressable key={category} onPress={() => onFilterChange(category)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{icon}{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, zIndex: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#276c62', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  brandPin: { color: '#fff', fontSize: 17 },
  brandTitle: { color: '#183b39', fontSize: 15, fontWeight: '800', letterSpacing: 0.4 },
  brandCaption: { color: '#71817d', fontSize: 9, letterSpacing: 1, marginTop: 3 },
  saveButton: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#fffefa', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  saveIcon: { color: '#183b39', fontSize: 20 },
  savedIcon: { color: '#ed805d' },
  searchBox: { height: 52, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: '#fffefa', paddingHorizontal: 14, elevation: 5 },
  searchIcon: { color: '#68817a', fontSize: 24, marginRight: 9, marginTop: -3 },
  searchInput: { flex: 1, color: '#183b39', fontSize: 14, paddingVertical: 0 },
  clearSearch: { width: 25, height: 25, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', borderRadius: 13, backgroundColor: '#f1f3ef', color: '#71817d', fontSize: 19 },
  chipRow: { gap: 8, paddingTop: 11, paddingBottom: 7, paddingHorizontal: 2 },
  chip: { borderWidth: 1, borderColor: '#e2e6df', borderRadius: 22, backgroundColor: '#fffefa', paddingHorizontal: 13, paddingVertical: 8, elevation: 2 },
  chipActive: { backgroundColor: '#276c62', borderColor: '#276c62' },
  chipText: { color: '#53645f', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
});
