# react-body-highlighter

## What This Is

A React component library for rendering interactive human body SVGs in the browser. Users can highlight specific body parts (muscle groups) with custom colors and respond to clicks on individual regions. Supports male/female body variants with front/back views.

## Core Value

Display and interact with body parts visually — highlight muscle groups with per-part colors and handle user selection.

## Requirements

### Validated

- ✓ SVG body rendering with male/female variants — existing
- ✓ Front/back view toggle — existing
- ✓ Body part highlighting with colors — existing
- ✓ Click handlers on body parts — existing
- ✓ TypeScript type definitions — existing

### Active

- [ ] Remove all React Native dependencies (react-native-svg)
- [ ] Use native browser SVG elements (no external dependencies)
- [ ] Simplified API: `<Model data={[...]} onPress={...} gender={...} side={...}/>`
- [ ] Remove exercise-related references from codebase
- [ ] Per-part color support: `data={[{ slug: "left-biceps", color: "#ff0000" }]}`
- [ ] All muscle groups split into left/right sides (left-biceps, right-biceps, etc.)
- [ ] Update package.json for web-only React library

### Out of Scope

- React Native support — migrating to web-only
- Dual platform support — complexity not worth it for this use case
- Intensity-based coloring — replaced by explicit per-part colors

## Context

**Existing codebase:**
- React Native library using react-native-svg for SVG rendering
- SVG paths stored in assets/ as TypeScript arrays
- Male/female body variants with front/back views
- Body parts have common/left/right path groupings

**Migration approach:**
- Replace react-native-svg `Path` with native `<path>` elements
- Replace wrapper components with native `<svg>` elements
- Restructure body part slugs to use explicit left/right prefixes
- Simplify API by removing intensity system

**Current body part structure:**
Body parts currently have `path.common`, `path.left`, `path.right` arrays. These need to be converted to explicit `left-{slug}` and `right-{slug}` entries for bilateral muscle groups.

## Constraints

- **Tech stack**: React 18+, TypeScript, no runtime dependencies
- **Browser support**: Modern browsers with native SVG support
- **Bundle size**: Minimal — only React as peer dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web-only (drop RN) | Simpler codebase, clear target audience | — Pending |
| Inline SVG | No dependencies, native browser support | — Pending |
| Per-part colors | More flexible than intensity system | — Pending |
| Left/right prefixes | Explicit control over bilateral muscles | — Pending |

---
*Last updated: 2026-01-17 after initialization*
