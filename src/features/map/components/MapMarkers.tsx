import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { CATEGORY_STYLE } from '../constants';
import type { Place } from '../types';

type MapMarkersProps = {
  places: Place[];
  selectedId: string;
  onSelectPlace: (placeId: string) => void;
};

export default function MapMarkers({ places, selectedId, onSelectPlace }: MapMarkersProps) {
  return places.map((place) => {
    const palette = CATEGORY_STYLE[place.category];
    const selected = selectedId === place.id;

    return (
      <Marker
        key={place.id}
        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
        title={place.name}
        description={`${place.area} · ${place.category}`}
        onPress={() => onSelectPlace(place.id)}
        tracksViewChanges={false}
      >
        <View style={[styles.marker, { backgroundColor: selected ? '#ed805d' : palette.color, transform: [{ scale: selected ? 1.12 : 1 }] }]}>
          <Text style={styles.markerEmoji}>{place.emoji}</Text>
        </View>
      </Marker>
    );
  });
}

const styles = StyleSheet.create({
  marker: { minWidth: 42, height: 42, borderRadius: 22, borderBottomLeftRadius: 9, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  markerEmoji: { fontSize: 17 },
});
