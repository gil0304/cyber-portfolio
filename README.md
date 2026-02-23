# Cyber Node Portfolio (R3F + TypeScript)

作品群をノードネットワークとして可視化する、サイバー系3Dポートフォリオです。Vite + React + Three.js（R3F）で構築し、ネオン球・パルス・HUD・ディテールカードを備えています。

**Features**
1. ネオンノード + グロー + パルスライン
2. ノードクリックでフォーカス、背景クリックで解除
3. HUDカードと検索ハイライト
4. ノード近くのカード表示 + 詳細パネル
5. 起動時のOPローディング
6. 呼吸する背景グロー（ノードと同期）
7. レスポンシブなノードサイズ調整

**Tech Stack**
1. Vite
2. React + TypeScript
3. three.js / @react-three/fiber
4. @react-three/drei
5. @react-three/postprocessing

**Getting Started**
```bash
npm install
npm run dev
```

**Build**
```bash
npm run build
npm run preview
```

**Controls**
1. ドラッグで視点移動（OrbitControls）
2. ノードクリックでフォーカス
3. 背景クリックで解除
4. `Esc` でカード/選択解除

**Project Data**
編集箇所: `src/data/projects.ts`

設定できる主な項目
1. `name` `description` `stack` `detail` `role` `year`
2. `position`（ノード位置）
3. `color`（ノード/ラベル/強調色）
4. `highlights`（箇条書き）
5. `images`（詳細カードの画像パス）

画像は `public/images` に配置し、`/images/xxx.jpg` の形で指定します。

**Tuning / Visuals**
1. ノードの発光やハロー: `src/components/Node.tsx`
2. ラインの太さやパルス: `src/components/Connections.tsx`
3. HUDやカードの見た目: `src/App.css`
4. 背景の呼吸テンポ: `src/utils/breath.ts`
