import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_STYLE } from '../constants';
import type { Place } from '../types';

type PlaceSheetProps = {
  places: Place[];
  selectedId: string;
  bottomInset: number;
  onSelectPlace: (place: Place) => void;
};

export default function PlaceSheet({ places, selectedId, bottomInset, onSelectPlace }: PlaceSheetProps) {
  return (
    <View style={[styles.sheet, { paddingBottom: Math.max(bottomInset, 14) }]}>
      <View style={styles.grabber} />
      <View style={styles.heading}>
        <View>
          <Text style={styles.eyebrow}>DISCOVER IWAKI</Text>
          <Text style={styles.title}>いわきの暮らしを、地図から。</Text>
        </View>
        <Text style={styles.count}>{places.length}スポット</Text>
      </View>

      {places.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow} keyboardShouldPersistTaps="handled">
          {places.map((place) => {
            const palette = CATEGORY_STYLE[place.category];
            const selected = selectedId === place.id;

            return (
              <Pressable key={place.id} onPress={() => onSelectPlace(place)} style={[styles.placeCard, selected && styles.placeCardSelected]}>
                <View style={[styles.placeEmojiBox, { backgroundColor: palette.soft }]}><Text style={styles.placeEmoji}>{place.emoji}</Text></View>
                <View style={styles.placeCopy}>
                  <Text style={styles.placeArea}>{place.area} · {place.category}</Text>
                  <Text numberOfLines={1} style={styles.placeTitle}>{place.name}</Text>
                  <Text numberOfLines={1} style={styles.placeDescription}>{place.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}><Text style={styles.emptyText}>見つかりませんでした。別の言葉で探してみてください。</Text></View>
      )}

      <Text style={styles.disclaimer}>スポット・説明は画面イメージ用の仮データです。</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', zIndex: 2, left: 0, right: 0, bottom: 0, minHeight: 244, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#fffefa', paddingTop: 9, paddingHorizontal: 16, elevation: 14 },
  grabber: { width: 38, height: 4, alignSelf: 'center', borderRadius: 4, backgroundColor: '#d8ded8', marginBottom: 13 },
  heading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  eyebrow: { color: '#276c62', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: '#183b39', fontSize: 18, fontWeight: '800', marginTop: 4 },
  count: { color: '#71817d', fontSize: 11, marginBottom: 3 },
  cardRow: { gap: 10, paddingRight: 16, paddingBottom: 4 },
  placeCard: { width: 254, minHeight: 102, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#e9e8df', borderRadius: 17, backgroundColor: '#fff', padding: 12 },
  placeCardSelected: { borderColor: '#bddbd0' },
  placeEmojiBox: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  placeEmoji: { fontSize: 23 },
  placeCopy: { flex: 1, minWidth: 0 },
  placeArea: { color: '#71817d', fontSize: 10, marginBottom: 4 },
  placeTitle: { color: '#183b39', fontSize: 13, fontWeight: '800', marginBottom: 4 },
  placeDescription: { color: '#76847e', fontSize: 10 },
  emptyState: { height: 102, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#71817d', fontSize: 12, textAlign: 'center' },
  disclaimer: { color: '#9aa49f', fontSize: 9, marginTop: 5, marginBottom: 4 },
});
