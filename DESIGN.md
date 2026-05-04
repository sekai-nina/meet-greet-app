# Bright Sky — Design System

> A clear-skied, energetic design system for mobile-first products.
> _"晴れた日の朝のような明るさを、UIに。"_

**Version 0.2.0** — All foundational tokens defined.

---

## 1. Concept

Bright Sky は、**Sky Blue × Sunshine Yellow** を主役にした明るく若々しい配色を、効率的でクリーンな構造で支えるデザインシステムです。教育・スポーツ・フィットネス・ヘルスケア・SaaS など、ユーザーに前向きな行動を促すモバイルプロダクトに最適化しています。

### キャラクター

```
Tone:        効率的・クリア・キビキビ・親しみやすい
Avoid:       高級感・厳粛・夜・大人すぎる落ち着き
Inspiration: Linear（構造）+ iOS（操作感）+ 晴れた日の青空（情緒）
```

### 一貫性の柱

すべての判断は以下の方向性を共有しています:

> **Tool-leaning structure, warmed by color and icon expressiveness.**
> 構造は効率重視（Compact / Crisp / Modern radius）。それを Bright Sky の配色と Phosphor アイコンの多ウェイト表現で人間味を加える。

---

## 2. Design Principles

1. **Two stars, one stage.** プライマリ青とアクセント黄が主役。サポートカラーはこれらを引き立てる中立色に保つ。
2. **Yellow is a spice, not a sauce.** 黄色は飽和度が高い。CTA・バッジ・進捗バーなど "決定打" として点で使う。
3. **Dark text wins.** 青と黄の上には、白ではなく濃紺テキストを載せる（コントラスト比 7:1 以上）。
4. **Calm whitespace, dense content.** Compact density は情報量を上げるが、その代償としてホワイトスペースの "間" を意識する。
5. **Crisp motion communicates.** 動きは装飾ではなく合図。高速 (80–250ms) で標準カーブの ease を使い、UI が "邪魔をしない" 。
6. **Icon weight expresses state.** Phosphor の 6 ウェイトを活用し、状態（非選択/選択/無効/強調）をフォントの太さで伝える。

---

## 3. Color Tokens

### 3.1 Core Palette

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--color-bg` | `#FAFBFC` | 250, 251, 252 | アプリ全体の背景 |
| `--color-surface` | `#E8F4FA` | 232, 244, 250 | カード、モーダル、入力欄 |
| `--color-primary` | `#5BBEE5` | 91, 190, 229 | CTA、リンク、選択状態 |
| `--color-accent` | `#FFE100` | 255, 225, 0 | バッジ、ハイライト、進捗 |
| `--color-text` | `#14253A` | 20, 37, 58 | 本文、見出し |
| `--color-text-muted` | `#5A6B78` | 90, 107, 120 | 補助テキスト |

### 3.2 Primary State Variants

| Token | Hex | 用途 |
|---|---|---|
| `--color-primary` | `#5BBEE5` | デフォルト |
| `--color-primary-hover` | `#3FA8D1` | ホバー時 |
| `--color-primary-pressed` | `#2B92BB` | 押下時 |
| `--color-primary-disabled` | `#B8DEEA` | 無効時 |
| `--color-primary-soft` | `#D9EFF8` | 選択行ハイライト |

### 3.3 Accent State Variants

| Token | Hex | 用途 |
|---|---|---|
| `--color-accent` | `#FFE100` | デフォルト |
| `--color-accent-hover` | `#E8CD00` | ホバー時 |
| `--color-accent-pressed` | `#CFB700` | 押下時 |
| `--color-accent-soft` | `#FFF5A0` | 注釈背景 |

### 3.4 Semantic Colors

> ⚠️ アクセントを黄色で消費しているため、warning は **amber** で別定義。

| Token | Hex | 用途 |
|---|---|---|
| `--color-success` | `#2EAA5C` | 成功通知、完了バッジ |
| `--color-warning` | `#F59E0B` | 警告（黄ではなく**アンバー**） |
| `--color-error` | `#E5484D` | エラー、破壊的アクション |
| `--color-info` | `#5BBEE5` | 情報通知（プライマリと共有） |

### 3.5 Borders

| Token | Hex | 用途 |
|---|---|---|
| `--color-border` | `#DDE6ED` | 入力欄、カードの枠線 |
| `--color-border-strong` | `#B8C5D0` | 強調された区切り線 |
| `--color-divider` | `#EEF2F5` | 控えめな水平線 |

---

## 4. Typography

### 4.1 Font Stacks

```css
/* Latin */
--font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body:    'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, monospace;

/* Japanese (paired) */
--font-jp:      'Murecho', 'Hiragino Sans', 'Yu Gothic', sans-serif;
```

**Why this combo:** Plus Jakarta Sans は2020年代を代表する幾何学サンセリフで、可読性と個性のバランスが良い。Murecho は Plus Jakarta Sans とペアリング設計された日本語書体で、欧文との太さ・字面の差が出にくい。

### 4.2 Loading

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Murecho:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 4.3 Type Scale

モバイル最適化された **1.25倍系** のスケール。

| Token | Size | Line Height | 用途 |
|---|---|---|---|
| `--text-caption` | 11px | 1.4 | キャプション、極小ラベル |
| `--text-small` | 13px | 1.5 | 補助テキスト、メタ情報 |
| `--text-body` | 15px | 1.6 | 本文（デフォルト） |
| `--text-large` | 17px | 1.5 | リード文、強調本文 |
| `--text-h3` | 20px | 1.3 | 小見出し |
| `--text-h2` | 24px | 1.25 | 中見出し |
| `--text-h1` | 32px | 1.15 | 大見出し（画面タイトル） |
| `--text-display` | 40px | 1.05 | ディスプレイ（ヒーロー） |

### 4.4 Font Weight

| Token | Value | 用途 |
|---|---|---|
| `--weight-regular` | 400 | 本文 |
| `--weight-medium` | 500 | やや強調、UI要素 |
| `--weight-semibold` | 600 | 小見出し、ボタンラベル |
| `--weight-bold` | 700 | 強調 |
| `--weight-extrabold` | 800 | 大見出し、display |

> **Tip:** 日本語側は欧文より重く感じやすい。和文を 1段階軽くする（例: 欧文 600 + 和文 500）と統一感が出ます。

### 4.5 Letter Spacing

```css
--tracking-tight:   -0.025em;  /* 大見出し */
--tracking-normal:  0;          /* 本文 */
--tracking-wide:    0.05em;     /* キャプション、ラベル */
--tracking-widest:  0.15em;     /* オールキャップス */
```

---

## 5. Spacing

ベースは **4px グリッド**、主要値は **8 の倍数**。

### 5.1 Base Scale

| Token | px |
|---|---|
| `--space-0` | 0 |
| `--space-1` | 4 |
| `--space-2` | 8 |
| `--space-3` | 12 |
| `--space-4` | 16 |
| `--space-5` | 20 |
| `--space-6` | 24 |
| `--space-8` | 32 |
| `--space-10` | 40 |
| `--space-12` | 48 |
| `--space-16` | 64 |
| `--space-20` | 80 |

### 5.2 Density: Compact

情報量重視、効率的なリスト・ダッシュボード向きの設定。

| 用途 | 値 | 対応トークン |
|---|---|---|
| 画面の左右パディング | 16px | `space-4` |
| カード内側パディング | 12px | `space-3` |
| カード間の縦ギャップ | 8px | `space-2` |
| セクション間ギャップ | 16px | `space-4` |
| ボタン上下パディング | 12px | `space-3` |
| ボタン左右パディング | 16px | `space-4` |
| アイコン + テキスト | 8–10px | `space-2` |

### 5.3 Component Spacing Examples

```css
/* Card */
.card {
  padding: var(--space-3);              /* 12px */
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);        /* 8px */
}

/* Stack of items in a section */
.stack > * + * {
  margin-top: var(--space-2);           /* 8px */
}

/* Section divider */
.section + .section {
  margin-top: var(--space-4);           /* 16px */
}
```

---

## 6. Border Radius

**Modern スケール** — 現代的で最も一般的なバランス。

| Token | px | 用途 |
|---|---|---|
| `--radius-xs` | 4 | タグ、小さなバッジ |
| `--radius-sm` | 8 | 入力欄、小ボタン、アイコンの背景 |
| `--radius-md` | 12 | カード、主要ボタン |
| `--radius-lg` | 16 | 大きなカード、モーダル |
| `--radius-xl` | 24 | ヒーロー、特大エリア、ナビゲーションバー |
| `--radius-full` | 9999 | アバター、ピル型ボタン、バッジ |

### 6.1 Component Mapping

```
Tag / Badge          → radius-xs (4px)
Input field          → radius-sm (8px)
Icon background      → radius-sm (8px)
Standard button      → radius-md (12px)
Card                 → radius-md (12px)
Modal / Dialog       → radius-lg (16px)
Bottom sheet         → radius-xl 上端のみ
Avatar               → radius-full
Pill button / Badge  → radius-full
FAB                  → radius-full
```

---

## 7. Elevation (Shadows)

**Subtle スケール** — 控えめな多層シャドウ。**Tinted shadow** 技法を使用（`rgba(20, 37, 58, X)` = `--color-text` で染める）。

### 7.1 Shadow Scale

| Token | CSS | 用途 |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(20, 37, 58, 0.04)` | 統計カード、小タグ |
| `--shadow-sm` | `0 1px 3px rgba(20, 37, 58, 0.06), 0 1px 2px rgba(20, 37, 58, 0.04)` | タスクカード、リストアイテム |
| `--shadow-md` | `0 4px 6px rgba(20, 37, 58, 0.06), 0 2px 4px rgba(20, 37, 58, 0.06)` | ボタン (hover)、ナビゲーションバー |
| `--shadow-lg` | `0 10px 15px rgba(20, 37, 58, 0.08), 0 4px 6px rgba(20, 37, 58, 0.04)` | ドロップダウン、ポップオーバー、FAB |
| `--shadow-xl` | `0 20px 25px rgba(20, 37, 58, 0.10), 0 10px 10px rgba(20, 37, 58, 0.04)` | トースト通知、サイドシート |
| `--shadow-2xl` | `0 25px 50px rgba(20, 37, 58, 0.15)` | モーダル、ダイアログ |

### 7.2 Why Tinted Shadows

純粋な黒影 `rgba(0, 0, 0, 0.1)` は、明るい配色の上で "灰色っぽくくすんで" 見えます。テキスト色（`#14253A`）でほんのり染めることで、影が背景と調和し、より自然な深度感が出ます。

### 7.3 Multi-Layer Technique

自然な影は **2層重ねる** ことで作ります。1層目は柔らかく広い影、2層目は鋭く近い影。

```css
/* ❌ 単層 — 平坦に見える */
box-shadow: 0 4px 8px rgba(20, 37, 58, 0.1);

/* ✅ 多層 — リアルな深度感 */
box-shadow:
  0 4px 6px rgba(20, 37, 58, 0.06),  /* 広く柔らかい */
  0 2px 4px rgba(20, 37, 58, 0.06);  /* 鋭く近い */
```

---

## 8. Motion

**Crisp プロファイル** — キビキビした、効率重視の動き。

### 8.1 Duration Scale

| Token | ms | 用途 |
|---|---|---|
| `--duration-instant` | 80ms | 瞬時のフィードバック（チェックなど） |
| `--duration-fast` | 150ms | 小さなUI（ホバー、フォーカス） |
| `--duration-base` | 200ms | カード、モーダル、トースト（最頻出） |
| `--duration-slow` | 300ms | 画面遷移 |
| `--duration-slower` | 450ms | ヒーロー、オンボーディング |

### 8.2 Easing Curves

| Token | CSS | 用途 |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | 登場（速く始まり、ゆっくり止まる） |
| `--ease-in` | `cubic-bezier(0.4, 0.0, 1, 1)` | 退場（ゆっくり始まり、速く去る） |
| `--ease-in-out` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | 移動（両端なめらか） |
| `--ease-emphasized` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | 強調された登場 |

### 8.3 Stagger

リスト要素を一斉に出すと雑な印象に。**30ms ずつずらす** ことで波のような上品な動きに。

```css
.list-item {
  animation: enter var(--duration-base) var(--ease-out) both;
  animation-delay: calc(var(--i) * 30ms);
}
```

### 8.4 Common Animation Patterns

#### Button Press (Tactile feedback)

```css
.btn:active {
  transform: scale(0.98);
  transition: transform var(--duration-fast) var(--ease-out);
}
```

#### Modal / Toast Entry

```css
@keyframes modal-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.modal { animation: modal-in var(--duration-base) var(--ease-emphasized) both; }
```

#### Card List Entry (with stagger)

```css
@keyframes card-in {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-list .card {
  animation: card-in var(--duration-base) var(--ease-out) both;
  animation-delay: calc(var(--i) * 30ms);
}
```

### 8.5 Reduce Motion

ユーザーが reduced motion を希望している場合は、トランジションを短縮または無効化。

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Icons (Phosphor)

### 9.1 Library Choice

**[Phosphor Icons](https://phosphoricons.com/)** — 6 ウェイトを持つ柔軟なアイコンセット。状態によってウェイトを使い分けることで、色だけに頼らない表現が可能。

| 項目 | 値 |
|---|---|
| 総アイコン数 | 9,000+ (1,500 × 6 weights) |
| ライセンス | MIT |
| ViewBox | `0 0 256 256` |
| Stroke (Regular) | 16px (256vb 換算 = 約 1.5px @ 24px display) |
| パッケージ | `@phosphor-icons/react` / `@phosphor-icons/web` |

### 9.2 Installation

```bash
# React
npm install @phosphor-icons/react

# Web Components
npm install @phosphor-icons/web

# iOS (SwiftUI)
# https://github.com/phosphor-icons/swift
```

### 9.3 Weight Usage by State

Phosphor の最大の強み — **状態をウェイトで表現**:

| 状態 | Weight | 例 |
|---|---|---|
| デフォルト | `regular` | 通常のナビアイコン |
| アクティブ・選択中 | `fill` | 選択中のタブ |
| 重要・強調 | `bold` | エラー時のアラートアイコン |
| 無効 | `light` | 無効化されたボタンのアイコン |
| 装飾的 | `thin` / `duotone` | エンプティステート、ヒーロー |

```jsx
// React example: bottom navigation with state
import { House } from "@phosphor-icons/react";

<NavIcon>
  <House
    size={24}
    weight={isActive ? "fill" : "regular"}
    color="currentColor"
  />
</NavIcon>
```

### 9.4 Sizing Rules

3段階に絞ることで、画面ごとのバラつきを防止。

| Size | px | 用途 |
|---|---|---|
| `--icon-sm` | 16 | 本文インライン、メタ情報 |
| `--icon-md` | 20 | ボタン内、タスクカード、トースト |
| `--icon-lg` | 24 | ナビゲーション、見出し横 |

### 9.5 Color Inheritance

アイコンは `currentColor` で塗ることで、テキスト色に追従させる。

```css
.icon { color: var(--color-text); }
.nav-icon.active { color: var(--color-primary); }
.icon-button:disabled { color: var(--color-text-muted); }
```

---

## 10. Accessibility

### 10.1 Color Contrast (WCAG 2.2 AA)

| 前景 | 背景 | 比 | AA本文 (4.5:1) | AA UI (3:1) |
|---|---|---|---|---|
| `text` `#14253A` | `bg` `#FAFBFC` | ~15.0:1 | ✅ | ✅ |
| `text` `#14253A` | `surface` `#E8F4FA` | ~13.1:1 | ✅ | ✅ |
| `text-muted` `#5A6B78` | `bg` `#FAFBFC` | ~5.6:1 | ✅ | ✅ |
| `text` `#14253A` | `primary` `#5BBEE5` | ~7.7:1 | ✅ | ✅ |
| **white** | `primary` `#5BBEE5` | ~2.0:1 | ❌ | ❌ |
| `text` `#14253A` | `accent` `#FFE100` | ~14.5:1 | ✅ | ✅ |

**実装ルール:** プライマリ青と黄色アクセントの上には、**必ず濃紺テキスト** を載せる。

### 10.2 Focus Indicators

すべてのインタラクティブ要素に visible なフォーカスリングを設置:

```css
.interactive:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}
```

### 10.3 Touch Targets

モバイルでは最小 **44 × 44px** のタップ領域を確保（iOS HIG / Material 推奨）。Compact density でも touch target だけは妥協しない。

### 10.4 Reduced Motion

§8.5 参照。

---

## 11. Implementation

### 11.1 Complete CSS Variables

```css
:root {
  /* ─── Colors ─────────────────────────────────────── */
  --color-bg: #FAFBFC;
  --color-surface: #E8F4FA;
  --color-primary: #5BBEE5;
  --color-primary-hover: #3FA8D1;
  --color-primary-pressed: #2B92BB;
  --color-primary-disabled: #B8DEEA;
  --color-primary-soft: #D9EFF8;
  --color-accent: #FFE100;
  --color-accent-hover: #E8CD00;
  --color-accent-pressed: #CFB700;
  --color-accent-soft: #FFF5A0;
  --color-text: #14253A;
  --color-text-muted: #5A6B78;
  --color-success: #2EAA5C;
  --color-warning: #F59E0B;
  --color-error: #E5484D;
  --color-info: #5BBEE5;
  --color-border: #DDE6ED;
  --color-border-strong: #B8C5D0;
  --color-divider: #EEF2F5;

  /* ─── Typography ─────────────────────────────────── */
  --font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-body:    'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;
  --font-jp:      'Murecho', 'Hiragino Sans', 'Yu Gothic', sans-serif;

  --text-caption: 11px;
  --text-small:   13px;
  --text-body:    15px;
  --text-large:   17px;
  --text-h3:      20px;
  --text-h2:      24px;
  --text-h1:      32px;
  --text-display: 40px;

  --leading-display: 1.05;
  --leading-h1:      1.15;
  --leading-h2:      1.25;
  --leading-h3:      1.3;
  --leading-large:   1.5;
  --leading-body:    1.6;
  --leading-small:   1.5;
  --leading-caption: 1.4;

  --weight-regular:   400;
  --weight-medium:    500;
  --weight-semibold:  600;
  --weight-bold:      700;
  --weight-extrabold: 800;

  --tracking-tight:   -0.025em;
  --tracking-normal:  0;
  --tracking-wide:    0.05em;
  --tracking-widest:  0.15em;

  /* ─── Spacing (4px grid) ─────────────────────────── */
  --space-0:  0;
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Compact density values */
  --pad-screen:    16px;
  --pad-card:      12px;
  --pad-button-y:  12px;
  --pad-button-x:  16px;
  --gap-card:      8px;
  --gap-section:   16px;
  --gap-icon-text: 8px;

  /* ─── Radius ─────────────────────────────────────── */
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  /* ─── Elevation ──────────────────────────────────── */
  --shadow-xs:  0 1px 2px rgba(20, 37, 58, 0.04);
  --shadow-sm:  0 1px 3px rgba(20, 37, 58, 0.06), 0 1px 2px rgba(20, 37, 58, 0.04);
  --shadow-md:  0 4px 6px rgba(20, 37, 58, 0.06), 0 2px 4px rgba(20, 37, 58, 0.06);
  --shadow-lg:  0 10px 15px rgba(20, 37, 58, 0.08), 0 4px 6px rgba(20, 37, 58, 0.04);
  --shadow-xl:  0 20px 25px rgba(20, 37, 58, 0.10), 0 10px 10px rgba(20, 37, 58, 0.04);
  --shadow-2xl: 0 25px 50px rgba(20, 37, 58, 0.15);

  /* ─── Motion ─────────────────────────────────────── */
  --duration-instant: 80ms;
  --duration-fast:    150ms;
  --duration-base:    200ms;
  --duration-slow:    300ms;
  --duration-slower:  450ms;

  --ease-out:        cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in:         cubic-bezier(0.4, 0.0, 1, 1);
  --ease-in-out:     cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-emphasized: cubic-bezier(0.0, 0.0, 0.2, 1);

  --stagger: 30ms;

  /* ─── Icons ──────────────────────────────────────── */
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 11.2 Tailwind Config (Complete)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: '#FAFBFC',
        surface: '#E8F4FA',
        primary: {
          DEFAULT: '#5BBEE5',
          hover:   '#3FA8D1',
          pressed: '#2B92BB',
          disabled:'#B8DEEA',
          soft:    '#D9EFF8',
        },
        accent: {
          DEFAULT: '#FFE100',
          hover:   '#E8CD00',
          pressed: '#CFB700',
          soft:    '#FFF5A0',
        },
        text: {
          DEFAULT: '#14253A',
          muted:   '#5A6B78',
        },
        success: '#2EAA5C',
        warning: '#F59E0B',
        error:   '#E5484D',
        border: {
          DEFAULT: '#DDE6ED',
          strong:  '#B8C5D0',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        sans:    ['Plus Jakarta Sans', 'sans-serif'],
        jp:      ['Murecho', 'Hiragino Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        caption: ['11px', { lineHeight: '1.4' }],
        small:   ['13px', { lineHeight: '1.5' }],
        body:    ['15px', { lineHeight: '1.6' }],
        large:   ['17px', { lineHeight: '1.5' }],
        h3:      ['20px', { lineHeight: '1.3' }],
        h2:      ['24px', { lineHeight: '1.25' }],
        h1:      ['32px', { lineHeight: '1.15' }],
        display: ['40px', { lineHeight: '1.05' }],
      },
      spacing: {
        '0':  '0',
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '5':  '20px',
        '6':  '24px',
        '8':  '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      borderRadius: {
        xs:   '4px',
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '24px',
        full: '9999px',
      },
      boxShadow: {
        xs:    '0 1px 2px rgba(20, 37, 58, 0.04)',
        sm:    '0 1px 3px rgba(20, 37, 58, 0.06), 0 1px 2px rgba(20, 37, 58, 0.04)',
        md:    '0 4px 6px rgba(20, 37, 58, 0.06), 0 2px 4px rgba(20, 37, 58, 0.06)',
        lg:    '0 10px 15px rgba(20, 37, 58, 0.08), 0 4px 6px rgba(20, 37, 58, 0.04)',
        xl:    '0 20px 25px rgba(20, 37, 58, 0.10), 0 10px 10px rgba(20, 37, 58, 0.04)',
        '2xl': '0 25px 50px rgba(20, 37, 58, 0.15)',
      },
      transitionDuration: {
        instant: '80ms',
        fast:    '150ms',
        base:    '200ms',
        slow:    '300ms',
        slower:  '450ms',
      },
      transitionTimingFunction: {
        out:        'cubic-bezier(0.0, 0.0, 0.2, 1)',
        in:         'cubic-bezier(0.4, 0.0, 1, 1)',
        'in-out':   'cubic-bezier(0.4, 0.0, 0.2, 1)',
        emphasized: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      },
    },
  },
};
```

### 11.3 Component Examples (React)

```jsx
// Primary button
<button className="
  bg-primary text-text
  font-semibold text-body
  px-4 py-3 rounded-md
  shadow-xs
  transition-all duration-fast ease-out
  hover:bg-primary-hover hover:shadow-sm
  active:scale-[0.98] active:bg-primary-pressed
  disabled:bg-primary-disabled disabled:cursor-not-allowed
  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft
">
  続ける
</button>

// Card with icon
import { Brain } from "@phosphor-icons/react";

<div className="
  bg-white rounded-md p-3 shadow-sm
  flex items-center gap-2
  transition-shadow duration-fast ease-out
  hover:shadow-md
">
  <div className="w-8 h-8 rounded-sm bg-primary-soft flex items-center justify-center">
    <Brain size={20} weight="regular" className="text-text" />
  </div>
  <div className="flex-1">
    <div className="font-bold text-small text-text">Morning Meditation</div>
    <div className="text-caption text-text-muted">10分 ・ 残り3.5分</div>
  </div>
</div>
```

---

## 12. Do's & Don'ts

### ✅ Do

- プライマリ青に黒/濃紺テキストを載せる
- 黄色アクセントを「点」で使う（バッジ・進捗・ハイライト）
- アイコンは Phosphor の Regular がデフォルト、選択中のみ Fill に切り替え
- 影は2層重ねでテキスト色に染める
- アニメーションは ease-out で登場、ease-in で退場
- スペーシングは 4 の倍数のみ使う
- フォーカスリングを必ず可視化

### ❌ Don't

- プライマリ青に白テキストを載せる（コントラスト不足）
- 黄色を warning に流用（amber を使う）
- スペーシング値を勝手に増やす（13px、17px などはNG）
- 影に純黒を使う（くすんで見える）
- 異なるアイコンライブラリを混ぜる
- アニメーションに linear イージングを使う
- 角丸の値を独自決め（決まったスケール内で選ぶ）

---

## 13. Future Work

### 13.1 Dark Mode

ダークモードは反転ではなく **専用パレット** を別途設計予定:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:       #0E1A26;
    --color-surface:  #1A2A3C;
    --color-primary:  #6FCAEA;  /* わずかに明るく */
    --color-accent:   #FFE742;  /* 明度をやや上げる */
    --color-text:     #E8EEF4;
    --color-text-muted: #8B9CAB;
    /* シャドウは透明度を下げる、または border に置換 */
  }
}
```

### 13.2 まだ手をつけていないもの

- [ ] Form components (input, select, checkbox, radio, toggle)
- [ ] Table styles
- [ ] Empty states / illustrations
- [ ] Loading states (skeleton, spinner)
- [ ] Error states
- [ ] Internationalization (RTL対応など)
- [ ] Accessibility audit (実機で screen reader テスト)
- [ ] Print stylesheet

---

## 14. Asset Index

### Fonts
- **Plus Jakarta Sans** — [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Murecho** — [Google Fonts](https://fonts.google.com/specimen/Murecho)
- **JetBrains Mono** — [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono)

### Icons
- **Phosphor Icons** — [phosphoricons.com](https://phosphoricons.com)
- React: `@phosphor-icons/react`
- Web: `@phosphor-icons/web`

---

## 15. Changelog

| Date | Version | 変更内容 |
|---|---|---|
| 2026-04-29 | 0.1.0 | 初版。Color palette のみ |
| 2026-04-29 | 0.2.0 | **Typography / Spacing / Radius / Elevation / Motion / Icons をすべて追加。デザインシステムの基盤完成** |

---

_— Crafted with care, ☀️ + ☁️_
_Bright Sky v0.2.0_
