# Roadmap: react-body-highlighter

**Created:** 2026-01-17
**Depth:** Quick (3 phases)
**Coverage:** 23/23 v1 requirements mapped

## Overview

Migration from react-native-body-highlighter to react-body-highlighter (web-only). Three phases: foundation/build setup, core migration with full feature parity, and polish/publish. Each phase delivers a verifiable capability.

---

## Phase 1: Foundation + Build System

**Goal:** Project builds and exports a minimal working React component with native SVG

**Dependencies:** None (starting point)

**Requirements:**
- PKG-01: Rename package to react-body-highlighter
- PKG-02: Update package.json for web-only React library
- PKG-03: Remove all React Native dependencies
- PKG-04: tsup bundler with ESM + CJS output
- PKG-05: React 18/19 as peer dependency
- CORE-01: Replace react-native-svg with native browser SVG elements

**Success Criteria:**
1. User can `npm install` the package and import `{ Body }` from 'react-body-highlighter'
2. Package exports ESM and CJS bundles (verified via `ls dist/`)
3. TypeScript declarations are generated (`.d.ts` files exist in output)
4. No react-native or react-native-svg in node_modules after install
5. A minimal `<Body />` renders an SVG element in the browser (verified in test app)

---

## Phase 2: Core Migration

**Goal:** All existing functionality works with the new web-based implementation

**Dependencies:** Phase 1 complete

**Requirements:**
- CORE-02: Render male body variant (front and back views)
- CORE-03: Render female body variant (front and back views)
- CORE-04: Support per-part color highlighting via data prop
- CORE-05: All bilateral muscles split into left/right (left-biceps, right-biceps, etc.)
- INTR-01: onClick handler for each body part
- INTR-02: Hover states with cursor pointer
- INTR-03: Support disabling specific body parts
- INTR-04: Support hiding specific body parts
- API-01: Simplified component API: `<Model data={[...]} onPress={...} gender={...} side={...}/>`
- API-02: Remove exercise-related references from codebase
- API-03: Data prop accepts array of `{ slug: string, color: string }`
- API-04: Export TypeScript types for all props and data structures

**Success Criteria:**
1. User can render male/female body in front/back views by setting `gender` and `side` props
2. User can highlight specific body parts by passing `data={[{ slug: "left-biceps", color: "#ff0000" }]}`
3. User can click on any body part and receive the slug in the callback via `onPress`
4. User sees cursor change to pointer when hovering over interactive body parts
5. User can disable parts (unclickable but visible) and hide parts (not rendered)

---

## Phase 3: Polish + Publish

**Goal:** Package is accessible, documented, and published to npm

**Dependencies:** Phase 2 complete

**Requirements:**
- A11Y-01: ARIA labels on interactive body parts
- A11Y-02: Role attributes on SVG elements
- DOC-01: Update README with new installation instructions
- DOC-02: Update README with new API examples
- DOC-03: Document all available body part slugs

**Success Criteria:**
1. Screen reader announces body part names when user navigates to them
2. SVG container has appropriate `role` attribute for accessibility tools
3. README shows correct installation command (`npm install react-body-highlighter`)
4. README includes working code examples that match the actual API
5. User can find complete list of available body part slugs in documentation

---

## Progress

| Phase | Status | Requirements | Completion |
|-------|--------|--------------|------------|
| 1 - Foundation + Build System | Pending | 6 | 0% |
| 2 - Core Migration | Pending | 12 | 0% |
| 3 - Polish + Publish | Pending | 5 | 0% |

**Total:** 0/23 requirements complete (0%)

---

## Dependency Graph

```
Phase 1: Foundation + Build System
    |
    v
Phase 2: Core Migration
    |
    v
Phase 3: Polish + Publish
```

Phases are sequential. Each phase depends on the previous phase being complete.

---
*Roadmap created: 2026-01-17*
*Last updated: 2026-01-17*
