# Requirements: react-body-highlighter

**Defined:** 2026-01-17
**Core Value:** Display and interact with body parts visually -- highlight muscle groups with per-part colors and handle user selection

## v1 Requirements

Requirements for web migration. Each maps to roadmap phases.

### Core Rendering

- [ ] **CORE-01**: Replace react-native-svg with native browser SVG elements
- [ ] **CORE-02**: Render male body variant (front and back views)
- [ ] **CORE-03**: Render female body variant (front and back views)
- [ ] **CORE-04**: Support per-part color highlighting via data prop
- [ ] **CORE-05**: All bilateral muscles split into left/right (left-biceps, right-biceps, etc.)

### Interaction

- [ ] **INTR-01**: onClick handler for each body part
- [ ] **INTR-02**: Hover states with cursor pointer
- [ ] **INTR-03**: Support disabling specific body parts
- [ ] **INTR-04**: Support hiding specific body parts

### API

- [ ] **API-01**: Simplified component API: `<Model data={[...]} onPress={...} gender={...} side={...}/>`
- [ ] **API-02**: Remove exercise-related references from codebase
- [ ] **API-03**: Data prop accepts array of `{ slug: string, color: string }`
- [ ] **API-04**: Export TypeScript types for all props and data structures

### Accessibility

- [ ] **A11Y-01**: ARIA labels on interactive body parts
- [ ] **A11Y-02**: Role attributes on SVG elements

### Build/Package

- [ ] **PKG-01**: Rename package to react-body-highlighter
- [ ] **PKG-02**: Update package.json for web-only React library
- [ ] **PKG-03**: Remove all React Native dependencies
- [ ] **PKG-04**: tsup bundler with ESM + CJS output
- [ ] **PKG-05**: React 18/19 as peer dependency

### Documentation

- [ ] **DOC-01**: Update README with new installation instructions
- [ ] **DOC-02**: Update README with new API examples
- [ ] **DOC-03**: Document all available body part slugs

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Interaction

- **INTR-05**: CSS transitions for color changes
- **INTR-06**: Keyboard navigation (arrow keys between parts)
- **INTR-07**: Focus indicators for keyboard users

### Advanced Accessibility

- **A11Y-03**: Full keyboard navigation support
- **A11Y-04**: Screen reader announcements on selection

### Advanced Features

- **ADV-01**: SSR/hydration support verification
- **ADV-02**: Tooltip support on hover

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| React Native support | Migrating to web-only |
| Dual platform (RN + web) | Complexity not worth it |
| Intensity-based coloring | Replaced by explicit per-part colors |
| 3D body rendering | Out of scope, different library |
| Medical accuracy claims | Legal liability, not our domain |
| Built-in state management | Let consumers manage state |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 2 | Pending |
| CORE-03 | Phase 2 | Pending |
| CORE-04 | Phase 2 | Pending |
| CORE-05 | Phase 2 | Pending |
| INTR-01 | Phase 2 | Pending |
| INTR-02 | Phase 2 | Pending |
| INTR-03 | Phase 2 | Pending |
| INTR-04 | Phase 2 | Pending |
| API-01 | Phase 2 | Pending |
| API-02 | Phase 2 | Pending |
| API-03 | Phase 2 | Pending |
| API-04 | Phase 2 | Pending |
| A11Y-01 | Phase 3 | Pending |
| A11Y-02 | Phase 3 | Pending |
| PKG-01 | Phase 1 | Pending |
| PKG-02 | Phase 1 | Pending |
| PKG-03 | Phase 1 | Pending |
| PKG-04 | Phase 1 | Pending |
| PKG-05 | Phase 1 | Pending |
| DOC-01 | Phase 3 | Pending |
| DOC-02 | Phase 3 | Pending |
| DOC-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

---
*Requirements defined: 2026-01-17*
*Last updated: 2026-01-17 after roadmap creation*
