export type Category = '暮らし' | '食' | '自然' | '人';

export type Place = {
  id: string;
  name: string;
  area: string;
  category: Category;
  emoji: string;
  latitude: number;
  longitude: number;
  description: string;
};
