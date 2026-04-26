---
name: storybook
description: UI コンポーネントの Storybook ストーリーとコンポーネントカタログを作成・更新するスキル
---

# Storybook スキル

UI コンポーネントに対応する Storybook ストーリーと Web コンポーネントカタログを作成・更新する。

## 実行タイミング

- 新しい UI コンポーネントを `components/` に追加したとき
- 既存コンポーネントの Props を変更したとき
- ユーザーから「Storybook に追加して」と言われたとき
- **コンポーネント実装と同じタイミングで実行する (後回しにしない)**

## 前提

このプロジェクトには **2 つのコンポーネント確認の仕組み** がある。両方を更新すること。

| 仕組み | コマンド | 用途 | ファイル |
|--------|---------|------|---------|
| **Storybook** | `make storybook` | 実機でコンポーネントの動作確認 | `components/{Name}.stories.tsx` |
| **カタログ** | `make catalog` / `make catalog-share` | Web ブラウザでコンポーネント一覧を共有 | `app/catalog.tsx` |

どちらも **実際のコンポーネントを import して使う** (コードのコピーではない)。
コンポーネントを修正すれば、Storybook・カタログ・本番アプリすべてに反映される。

## 手順

### 1. 対象コンポーネントの確認

対象コンポーネントのファイルを読み、以下を把握する:

- Props の型定義 (必須/任意、型、デフォルト値)
- コンポーネントのバリエーション (状態、サイズ、テーマ等)
- 依存するデータ (モックが必要か)

### 2. ストーリーファイルの作成・更新

`{ComponentName}.stories.tsx` を作成する。

```typescript
import type { Meta, StoryObj } from '@storybook/react-native';

import { ComponentName } from './ComponentName';

const meta = {
  title: 'components/ComponentName',
  component: ComponentName,
} satisfies Meta<typeof ComponentName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // デフォルトの props
  },
};
```

ストーリーの構成:
- **Default**: 標準的な表示
- **バリエーション**: Props の組み合わせごとに追加 (例: `Empty`, `Loading`, `Error`, `WithData`)
- **エッジケース**: 長いテキスト、データなし、エラー状態など

### 3. コンポーネントカタログの更新

`app/catalog.tsx` に対象コンポーネントを追加する。

1. コンポーネントを import する
2. モックデータを用意する (ストーリーのモックと共通化してよい)
3. `<Section>` で囲んで追加する

```typescript
import { NewComponent } from '@/components/NewComponent';

// catalog の return 内に追加
<Section title="NewComponent">
  <NewComponent prop1="value" />
</Section>
```

**重要**: カタログは Web (SSR) で動くため、ネイティブ専用 API に依存するコンポーネントは注意が必要。

### 4. 動作確認

以下のいずれかで表示を確認する:
- `make storybook` — 実機で Storybook を確認
- `make catalog` — Web ブラウザでカタログを確認

### 5. コミット

ストーリーファイルとカタログの変更をコミットする。

## 命名規約

| 対象 | 形式 | 例 |
|------|------|-----|
| ストーリーファイル | `{ComponentName}.stories.tsx` | `EventDayCard.stories.tsx` |
| title | `components/{ComponentName}` | `components/EventDayCard` |
| ストーリー名 | PascalCase で状態を表す | `Default`, `Empty`, `Loading` |
