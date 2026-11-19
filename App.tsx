import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Category = '暮らし' | '食' | '自然' | '人';
type Place = {
  id: string;
  name: string;
  area: string;
  category: Category;
  emoji: string;
  latitude: number;
  longitude: number;
  description: string;
};

const PLACES: Place[] = [
  { id: 'taira', name: 'いわき駅まわり', area: '平', category: '暮らし', emoji: '🚉', latitude: 37.05818, longitude: 140.89213, description: 'まちなかの買い物や交通を知る入口' },
  { id: 'yumoto', name: '湯本の温泉街', area: '常磐湯本町', category: '暮らし', emoji: '♨️', latitude: 37.00642, longitude: 140.84914, description: '温泉と日々の暮らしが近いエリア' },
  { id: 'onahama', name: '小名浜の港まち', area: '小名浜', category: '食', emoji: '🐟', latitude: 36.9491, longitude: 140.9022, description: '港の風景や海の食を楽しむエリア' },
  { id: 'misaki', name: '三崎公園', area: '小名浜下神白', category: '自然', emoji: '🌊', latitude: 36.9387, longitude: 140.9165, description: '海を眺めてひと息つける場所' },
  { id: 'yotsukura', name: '四倉の海辺', area: '四倉', category: '自然', emoji: '🏖️', latitude: 37.1053, longitude: 140.9893, description: '海岸沿いの景色に出会えるエリア' },
  { id: 'ueda', name: '植田駅まわり', area: '植田', category: '暮らし', emoji: '🏡', latitude: 36.9203, longitude: 140.7976, description: '市南部の生活動線を知る入口' },
  { id: 'local-table', name: 'まちの人に聞いてみる', area: '平', category: '人', emoji: '☕', latitude: 37.0523, longitude: 140.8864, description: '地域のことを人から知るきっかけ' },
];

const CATEGORIES: ('すべて' | Category)[] = ['すべて', '暮らし', '食', '自然', '人'];
const CATEGORY_STYLE: Record<Category, { color: string; soft: string; icon: string }> = {
  暮らし: { color: '#28766a', soft: '#dff0e8', icon: '⌂' },
  食: { color: '#dc7659', soft: '#fae7db', icon: '食' },
  自然: { color: '#5d8d56', soft: '#e5f0dc', icon: '葉' },
  人: { color: '#7665a6', soft: '#eee8f7', icon: '人' },
};

const IWAKI_REGION: Region = {
  latitude: 37.025,
  longitude: 140.88,
  latitudeDelta: 0.48,
  longitudeDelta: 0.62,
};

function IwakiMapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [filter, setFilter] = useState<'すべて' | Category>('すべて');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('taira');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const visiblePlaces = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ja');
    return PLACES.filter((place) => {
      const matchesCategory = filter === 'すべて' || place.category === filter;
      const text = `${place.name} ${place.area} ${place.category} ${place.description}`.toLocaleLowerCase('ja');
      return matchesCategory && (!normalized || text.includes(normalized));
    });
  }, [filter, query]);

  const moveToPlace = (place: Place) => {
    Keyboard.dismiss();
    setSelectedId(place.id);
    mapRef.current?.animateToRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.11,
      longitudeDelta: 0.11,
    }, 450);
  };

  const changeFilter = (category: 'すべて' | Category) => {
    setFilter(category);
    setSelectedId('');
    if (category === 'すべて') {
      mapRef.current?.animateToRegion(IWAKI_REGION, 450);
      return;
    }
    const matches = PLACES.filter((place) => place.category === category);
    if (matches.length) {
      const first = matches[0];
      mapRef.current?.animateToRegion({
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: matches.length > 1 ? 0.32 : 0.12,
        longitudeDelta: matches.length > 1 ? 0.4 : 0.12,
      }, 450);
    }
  };

  const goToCurrentLocation = async () => {
    setBusy(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('位置情報を使えません', '現在地を表示するには、端末の設定で位置情報を許可してください。');
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }, 500);
    } catch {
      Alert.alert('現在地を取得できませんでした', '位置情報を確認して、もう一度お試しください。');
    } finally {
      setBusy(false);
    }
  };

  const useGoogleMapsOnIos = process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS === '1';
  const provider = Platform.OS === 'android' || useGoogleMapsOnIos ? PROVIDER_GOOGLE : undefined;

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={IWAKI_REGION}
        provider={provider}
        showsCompass
        showsScale
        toolbarEnabled={false}
        moveOnMarkerPress={false}
      >
        {visiblePlaces.map((place) => {
          const palette = CATEGORY_STYLE[place.category];
          const isSelected = selectedId === place.id;
          return (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.name}
              description={`${place.area} · ${place.category}`}
              onPress={() => setSelectedId(place.id)}
              tracksViewChanges={false}
            >
              <View style={[styles.marker, { backgroundColor: isSelected ? '#ed805d' : palette.color, transform: [{ scale: isSelected ? 1.12 : 1 }] }]}>
                <Text style={styles.markerEmoji}>{place.emoji}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <SafeAreaView edges={['top']} style={styles.topArea}>
        <View style={styles.headerRow}>
          <View style={styles.brand}>
            <View style={styles.brandMark}><Text style={styles.brandPin}>●</Text></View>
            <View>
              <Text style={styles.brandTitle}>いわき暮らしマップ</Text>
              <Text style={styles.brandCaption}>IWAKI, THROUGH LOCAL EYES</Text>
            </View>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="このエリアを保存" onPress={() => setSaved((value) => !value)} style={styles.saveButton}>
            <Text style={[styles.saveIcon, saved && styles.savedIcon]}>{saved ? '▣' : '♧'}</Text>
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="場所・エリア・気になること"
            placeholderTextColor="#9ba7a2"
            returnKeyType="search"
            style={styles.searchInput}
            accessibilityLabel="地図を検索"
          />
          {query.length > 0 && <Pressable onPress={() => setQuery('')} accessibilityLabel="検索をクリア"><Text style={styles.clearSearch}>×</Text></Pressable>}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow} keyboardShouldPersistTaps="handled">
          {CATEGORIES.map((category) => {
            const active = filter === category;
            const icon = category === 'すべて' ? '' : `${CATEGORY_STYLE[category].icon} `;
            return (
              <Pressable key={category} onPress={() => changeFilter(category)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{icon}{category}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.mapTools}>
        <Pressable onPress={goToCurrentLocation} style={styles.mapTool} accessibilityRole="button" accessibilityLabel="現在地へ移動">
          {busy ? <ActivityIndicator size="small" color="#183b39" /> : <Text style={styles.mapToolIcon}>⌖</Text>}
        </Pressable>
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.grabber} />
        <View style={styles.sheetHeading}>
          <View>
            <Text style={styles.eyebrow}>DISCOVER IWAKI</Text>
            <Text style={styles.sheetTitle}>いわきの暮らしを、地図から。</Text>
          </View>
          <Text style={styles.count}>{visiblePlaces.length}スポット</Text>
        </View>
        {visiblePlaces.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow} keyboardShouldPersistTaps="handled">
            {visiblePlaces.map((place) => {
              const palette = CATEGORY_STYLE[place.category];
              const selected = selectedId === place.id;
              return (
                <Pressable key={place.id} onPress={() => moveToPlace(place)} style={[styles.placeCard, selected && styles.placeCardSelected]}>
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
      <StatusBar style="dark" />
    </View>
  );
}

export default function App() {
  return <SafeAreaProvider><IwakiMapScreen /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e8eee5' },
  topArea: { paddingHorizontal: 16, zIndex: 2 },
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
  marker: { minWidth: 42, height: 42, borderRadius: 22, borderBottomLeftRadius: 9, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  markerEmoji: { fontSize: 17 },
  mapTools: { position: 'absolute', right: 16, bottom: 290, zIndex: 3 },
  mapTool: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#fffefa', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  mapToolIcon: { fontSize: 23, color: '#183b39' },
  sheet: { position: 'absolute', zIndex: 2, left: 0, right: 0, bottom: 0, minHeight: 244, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#fffefa', paddingTop: 9, paddingHorizontal: 16, elevation: 14 },
  grabber: { width: 38, height: 4, alignSelf: 'center', borderRadius: 4, backgroundColor: '#d8ded8', marginBottom: 13 },
  sheetHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  eyebrow: { color: '#276c62', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  sheetTitle: { color: '#183b39', fontSize: 18, fontWeight: '800', marginTop: 4 },
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
