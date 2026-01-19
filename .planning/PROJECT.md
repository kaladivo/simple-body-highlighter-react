# simple-body-highlighter-react

## What This Is

A React component library for rendering interactive human body SVGs in the browser. Users can highlight specific body parts (muscle groups) with custom colors and respond to clicks on individual regions. Supports male/female body variants with front/back views.

Shipped v4.0 on 2026-01-19 — complete web migration from react-native-body-highlighter.

## Current Milestone: v1.0.0 Publish to npm

**Goal:** Rename package to simple-body-highlighter-react, clean up any react-native remnants, publish to npm with automated GitHub Actions workflow.

**Target features:**
- Rename package from react-body-highlighter to simple-body-highlighter-react
- Remove all react-native related files and references
- Push to new GitHub remote (kaladivo/simple-body-highlighter-react)
- Complete README with installation and usage documentation
- GitHub Actions workflow for automated npm publishing on git tags

## Core Value

Display and interact with body parts visually — highlight muscle groups with per-part colors and handle user selection.

## Requirements

### Validated

- ✓ SVG body rendering with male/female variants — v4.0
- ✓ Front/back view toggle — v4.0
- ✓ Body part highlighting with colors — v4.0
- ✓ Click handlers on body parts — v4.0
- ✓ TypeScript type definitions — v4.0
- ✓ Native browser SVG elements (no react-native-svg) — v4.0
- ✓ Simplified API: `<Body data={[...]} onClick={...} gender={...} side={...}/>` — v4.0
- ✓ Per-part color support: `data={[{ slug: "left-biceps", color: "#ff0000" }]}` — v4.0
- ✓ All bilateral muscles split into left/right (44 total slugs) — v4.0
- ✓ Keyboard navigation (Tab, Enter, Space) — v4.0
- ✓ Screen reader support (aria-label, role="button") — v4.0
- ✓ Documentation with BODY_PARTS.md reference — v4.0

### Active

- [ ] Rename package to simple-body-highlighter-react
- [ ] Remove react-native remnants from codebase
- [ ] Verify build outputs correctly
- [ ] Push to new GitHub remote
- [ ] README with install and usage examples
- [ ] GitHub Actions npm publish workflow (on git tags)

### Out of Scope

- React Native support — migrating to web-only
- Dual platform support — complexity not worth it for this use case
- Intensity-based coloring — replaced by explicit per-part colors
- 3D body rendering — different library
- Medical accuracy claims — legal liability

## Context

**Current State (v4.0):**
- 1,473 lines of TypeScript
- Tech stack: React 18/19, TypeScript, tsup bundler
- ESM + CJS dual output with TypeScript declarations
- 24 tests passing (18 functional + 6 accessibility)
- 44 body part slugs documented in BODY_PARTS.md

**Package:**
- Name: simple-body-highlighter-react (renaming from react-body-highlighter)
- Version: 1.0.0 (fresh start with new package name)
- Peer dependencies: react ^18.0.0 || ^19.0.0
- npm: unscoped, published via GitHub Actions on git tags

## Constraints

- **Tech stack**: React 18+, TypeScript, no runtime dependencies
- **Browser support**: Modern browsers with native SVG support
- **Bundle size**: ~143 KB (ESM) — only React as peer dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web-only (drop RN) | Simpler codebase, clear target audience | ✓ Good |
| Inline SVG | No dependencies, native browser support | ✓ Good |
| Per-part colors | More flexible than intensity system | ✓ Good |
| Left/right prefixes | Explicit control over bilateral muscles | ✓ Good |
| role="button" for paths | Standard accessible interactive pattern | ✓ Good |
| Map-based color lookup | O(1) performance vs array merging | ✓ Good |

| simple-body-highlighter-react | New package name for npm clarity | — Pending |

---
*Last updated: 2026-01-19 after v1.0.0 milestone planning*
