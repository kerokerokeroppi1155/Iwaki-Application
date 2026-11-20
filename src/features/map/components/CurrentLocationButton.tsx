import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type CurrentLocationButtonProps = {
  busy: boolean;
  onPress: () => void;
};

export default function CurrentLocationButton({ busy, onPress }: CurrentLocationButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button} accessibilityRole="button" accessibilityLabel="現在地へ移動">
      {busy ? <ActivityIndicator size="small" color="#183b39" /> : <Text style={styles.icon}>⌖</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#fffefa', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  icon: { fontSize: 23, color: '#183b39' },
});
