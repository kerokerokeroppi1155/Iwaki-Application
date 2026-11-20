import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CurrentLocationButton from './components/CurrentLocationButton';
import MapHeader from './components/MapHeader';
import MapMarkers from './components/MapMarkers';
import PlaceSheet from './components/PlaceSheet';
import { IWAKI_REGION, type PlaceFilter } from './constants';
import { PLACES } from './data/places';
import type { Place } from './types';

export default function IwakiMapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [filter, setFilter] = useState<PlaceFilter>('すべて');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('taira');
  const [busy, setBusy] = useState(false);
  

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

  const changeFilter = (category: PlaceFilter) => {
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
        <MapMarkers places={visiblePlaces} selectedId={selectedId} onSelectPlace={setSelectedId} />
      </MapView>

      <SafeAreaView edges={['top']} style={styles.topArea}>
        <MapHeader
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={changeFilter}
          
          
        />
      </SafeAreaView>

      <View style={styles.mapTools}>
        <CurrentLocationButton busy={busy} onPress={goToCurrentLocation} />
      </View>

      <PlaceSheet places={visiblePlaces} selectedId={selectedId} bottomInset={insets.bottom} onSelectPlace={moveToPlace} />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e8eee5' },
  topArea: { zIndex: 2 },
  mapTools: { position: 'absolute', right: 16, bottom: 290, zIndex: 3 },
});
