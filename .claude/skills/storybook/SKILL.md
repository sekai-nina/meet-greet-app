---
name: storybook
description: UI コンポーネントの Storybook ストーリーを作成・更新するスキル
---

# Storybook スキル

UI コンポーネントに対応する Storybook ストーリーを作成・更新し、コンポーネントカタログを最新に保つ。

## 実行タイミング

- 新しい UI コンポーネントを `components/` に追加したとき
- 既存コンポーネントの Props を変更したとき
- ユーザーから「Storybook に追加して」と言われたとき

## 前提

- React Native 向け Storybook (`@storybook/react-native`) を使用
- ストーリーファイルは対象コンポーネントと同階層に配置

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

### 3. 動作確認

Storybook を起動して、作成したストーリーが正しく表示されることを確認する。

### 4. コンポーネントカタログの更新

`docs/components.md` が存在する場合、コンポーネント一覧を更新する。
存在しない場合は作成し、以下を記載する:

- コンポーネント名
- 用途の簡単な説明
- Props の一覧
- Storybook でのパス (`components/ComponentName`)

### 5. コミット

ストーリーファイルとドキュメントの変更を、対象コンポーネントの実装コミットとは **別に** コミットする。

## 命名規約

| 対象 | 形式 | 例 |
|------|------|-----|
| ストーリーファイル | `{ComponentName}.stories.tsx` | `EventDayList.stories.tsx` |
| title | `components/{ComponentName}` | `components/EventDayList` |
| ストーリー名 | PascalCase で状態を表す | `Default`, `Empty`, `Loading` |
