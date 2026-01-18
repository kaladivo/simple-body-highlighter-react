# react-body-highlighter

[![npm](https://img.shields.io/npm/v/react-body-highlighter.svg)](https://www.npmjs.com/package/react-body-highlighter) [![Downloads](https://img.shields.io/npm/dt/react-body-highlighter.svg)](https://www.npmjs.com/package/react-body-highlighter)

> SVG body part highlighter for React web applications.

<div style="text-align:center;width:100%;">
  <img src="./docs/screenshots/example-female-front.PNG" width="150" alt="body-highlighter" />
  <img src="./docs/screenshots/example-female-back.PNG" width="150" alt="body-highlighter" />
  <img src="./docs/screenshots/example-male-front.PNG" width="150" alt="body-highlighter" />
  <img src="./docs/screenshots/example-male-back.PNG" width="150" alt="body-highlighter" />
</div>

## Installation

```bash
npm install react-body-highlighter
```

## Quick Start

```tsx
import { Body } from 'react-body-highlighter';

function App() {
  return (
    <Body
      data={[
        { slug: 'left-biceps', color: '#ff6b6b' },
        { slug: 'right-biceps', color: '#ff6b6b' },
      ]}
      onClick={(slug) => console.log(`Clicked: ${slug}`)}
    />
  );
}
```

## Interactive Example

```tsx
import { useState } from 'react';
import { Body, BodyPartSlug } from 'react-body-highlighter';

function App() {
  const [selected, setSelected] = useState<BodyPartSlug[]>([]);

  const handleClick = (slug: BodyPartSlug) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Body
        data={selected.map((slug) => ({ slug, color: '#ff6b6b' }))}
        onClick={handleClick}
        gender="male"
        side="front"
      />
      <Body
        data={selected.map((slug) => ({ slug, color: '#ff6b6b' }))}
        onClick={handleClick}
        gender="male"
        side="back"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | `BodyPartData[]` | `[]` | Body parts to highlight |
| onClick | `(slug: BodyPartSlug, event: React.MouseEvent) => void` | - | Click handler |
| gender | `'male' \| 'female'` | `'male'` | Body model |
| side | `'front' \| 'back'` | `'front'` | View side |
| scale | `number` | `1` | Scale factor |
| border | `string \| 'none'` | `'#dfdfdf'` | Outline color |
| disabledParts | `BodyPartSlug[]` | `[]` | Disabled slugs (grayed out, non-interactive) |
| hiddenParts | `BodyPartSlug[]` | `[]` | Hidden slugs (not rendered) |
| defaultFill | `string` | `'#3f3f3f'` | Default color for non-highlighted parts |

## Body Part Slugs

See [BODY_PARTS.md](./BODY_PARTS.md) for the complete list of 44 available slugs.

Bilateral muscles use `left-` and `right-` prefixes (e.g., `left-biceps`, `right-biceps`).

## TypeScript

All types are exported for TypeScript users:

```tsx
import type { BodyPartSlug, BodyPartData, ModelProps } from 'react-body-highlighter';
```

## Accessibility

Body parts have ARIA labels and keyboard navigation (Tab + Enter/Space).

## v4.0.0 Breaking Changes

This is a web-only rewrite of the original `react-native-body-highlighter`. For React Native, use v3.x.

Key changes:
- Package renamed from `react-native-body-highlighter` to `react-body-highlighter`
- `onClick` replaces `onBodyPartPress`
- `data` items require `{ slug, color }` (no more `intensity` or `side` properties)
- Bilateral muscles now use `left-`/`right-` prefixes in the slug
