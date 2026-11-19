# いわき暮らしマップ

iOS / Android 向けのネイティブアプリです。Expo と React Native で構成し、`react-native-maps` のネイティブ地図、スポット検索、カテゴリ絞り込み、現在地への移動を備えています。

## 開発を始める

1. Node.js LTS をインストールします。
2. リポジトリのルートで `npm install` を実行します。
3. `npx expo start` を実行します。
4. スマートフォンにExpo Goを入れ、ターミナルに出るQRコードを読み込みます。

この開発方法では、Android はGoogle Maps、iOS はApple Mapsを標準の地図として表示します。位置情報は「現在地」ボタンを押したときだけ許可を求めます。

## ストア配布ビルドでGoogle Mapsを使う

ストア配布向けのGoogle Maps SDKには、Google Cloudで有効化したAPIキーが必要です。`.env.example` を `.env` にコピーして、Google Cloudで発行したキーを端末・アプリ制限付きで設定してください。iOSでGoogle Mapsを使う場合は `EXPO_PUBLIC_GOOGLE_MAPS_IOS=1` にします。キーをGitHubへコミットしないでください。

ネイティブ設定の変更を反映するには、Expo Goではなくdevelopment buildまたはストア用ビルドが必要です。

## デモデータ

表示するスポットと説明は画面イメージ用の仮データです。実在施設の掲載情報、画像、運営者情報などを確認して差し替えてください。
