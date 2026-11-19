const baseConfig = require('./app.json').expo;

const androidGoogleMapsApiKey = process.env.ANDROID_GOOGLE_MAPS_API_KEY;
const iosGoogleMapsApiKey = process.env.IOS_GOOGLE_MAPS_API_KEY;

const plugins = [
  [
    'expo-location',
    {
      locationWhenInUsePermission: '現在地を地図に表示するために位置情報を使用します。',
    },
  ],
];

if (androidGoogleMapsApiKey || iosGoogleMapsApiKey) {
  plugins.push([
    'react-native-maps',
    {
      ...(androidGoogleMapsApiKey ? { androidGoogleMapsApiKey } : {}),
      ...(iosGoogleMapsApiKey ? { iosGoogleMapsApiKey } : {}),
    },
  ]);
}

module.exports = { ...baseConfig, plugins };
