# 地図画面のファイル構成

- `MapScreen.tsx`: 画面の状態管理と各部品の組み立て
- `components/MapHeader.tsx`: 見出し、検索欄、カテゴリボタン、保存ボタン
- `components/MapMarkers.tsx`: 地図上のスポットマーカー
- `components/CurrentLocationButton.tsx`: 現在地ボタン
- `components/PlaceSheet.tsx`: スポットカード一覧
- `data/places.ts`: スポットのデータ
- `constants.ts`: カテゴリの表示設定と地図の初期位置
- `types.ts`: スポットとカテゴリの型

見た目の変更は該当する `components/` のファイル、スポットの追加・変更は `data/places.ts`、画面全体の動きは `MapScreen.tsx` を編集します。
