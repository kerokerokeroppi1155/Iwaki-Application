import { SafeAreaProvider } from 'react-native-safe-area-context';
import IwakiMapScreen from './src/features/map/MapScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <IwakiMapScreen />
    </SafeAreaProvider>
  );
}
