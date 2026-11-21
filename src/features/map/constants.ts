import type { Region } from 'react-native-maps';
import type { Category } from './types';

export const CATEGORIES = ['すべて', '公園', '暮らし', '食', '自然', '人'] as const;
export type PlaceFilter = (typeof CATEGORIES)[number];
export const CATEGORY_OPTIONS: readonly Category[] = CATEGORIES.filter(
  (category): category is Category => category !== 'すべて',
);

export const CATEGORY_STYLE: Record<Category, { color: string; soft: string; icon: string }> = {
  公園: { color: '#397c58', soft: '#e4f1e4', icon: '🌳' },
  暮らし: { color: '#28766a', soft: '#dff0e8', icon: '⌂' },
  食: { color: '#dc7659', soft: '#fae7db', icon: '食' },
  自然: { color: '#5d8d56', soft: '#e5f0dc', icon: '葉' },
  人: { color: '#7665a6', soft: '#eee8f7', icon: '人' },
};

export const IWAKI_REGION: Region = {
  latitude: 37.025,
  longitude: 140.88,
  latitudeDelta: 0.48,
  longitudeDelta: 0.62,
};
