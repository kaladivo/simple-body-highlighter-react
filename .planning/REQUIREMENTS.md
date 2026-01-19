# Requirements: simple-body-highlighter-react

**Defined:** 2026-01-17 (v4.0 migration), updated 2026-01-19 (v1.0.0 publish)
**Core Value:** Display and interact with body parts visually -- highlight muscle groups with per-part colors and handle user selection

---

## v1.0.0 Requirements (Current Milestone)

Requirements for npm publishing under new package name.

### Package Rename

- [ ] **REN-01**: Update package.json name to `simple-body-highlighter-react`
- [ ] **REN-02**: Update package.json version to `1.0.0`
- [ ] **REN-03**: Update all internal references to old package name

### Cleanup

- [ ] **CLN-01**: Remove any react-native specific files
- [ ] **CLN-02**: Remove react-native references from code/comments
- [ ] **CLN-03**: Verify no react-native dependencies remain in package.json

### Build Verification

- [ ] **BLD-01**: Confirm build outputs ESM + CJS correctly
- [ ] **BLD-02**: Verify TypeScript declarations generate
- [ ] **BLD-03**: Ensure all tests pass

### Git/Remote

- [ ] **GIT-01**: Add new remote for kaladivo/simple-body-highlighter-react
- [ ] **GIT-02**: Push codebase to new remote

### Documentation

- [ ] **DOC-04**: README with installation instructions
- [ ] **DOC-05**: README with basic usage examples
- [ ] **DOC-06**: README with props documentation
- [ ] **DOC-07**: README with body parts reference link

### CI/CD

- [ ] **CI-01**: GitHub Actions workflow file (.github/workflows/publish.yml)
- [ ] **CI-02**: Trigger workflow on git tag push (v*)
- [ ] **CI-03**: Configure npm publish step
- [ ] **CI-04**: Document NPM_TOKEN secret setup in README

---

## v4.0 Requirements (Complete — Web Migration)

Requirements for web migration. All completed.

### Core Rendering

- [x] **CORE-01**: Replace react-native-svg with native browser SVG elements
- [x] **CORE-02**: Render male body variant (front and back views)
- [x] **CORE-03**: Render female body variant (front and back views)
- [x] **CORE-04**: Support per-part color highlighting via data prop
- [x] **CORE-05**: All bilateral muscles split into left/right (left-biceps, right-biceps, etc.)

### Interaction

- [x] **INTR-01**: onClick handler for each body part
- [x] **INTR-02**: Hover states with cursor pointer
- [x] **INTR-03**: Support disabling specific body parts
- [x] **INTR-04**: Support hiding specific body parts

### API

- [x] **API-01**: Simplified component API: `<Body data={[...]} onClick={...} gender={...} side={...}/>`
- [x] **API-02**: Remove exercise-related references from codebase
- [x] **API-03**: Data prop accepts array of `{ slug: string, color: string }`
- [x] **API-04**: Export TypeScript types for all props and data structures

### Accessibility

- [x] **A11Y-01**: ARIA labels on interactive body parts
- [x] **A11Y-02**: Role attributes on SVG elements

### Build/Package

- [x] **PKG-01**: Rename package to react-body-highlighter
- [x] **PKG-02**: Update package.json for web-only React library
- [x] **PKG-03**: Remove all React Native dependencies
- [x] **PKG-04**: tsup bundler with ESM + CJS output
- [x] **PKG-05**: React 18/19 as peer dependency

### Documentation

- [x] **DOC-01**: Update README with new installation instructions
- [x] **DOC-02**: Update README with new API examples
- [x] **DOC-03**: Document all available body part slugs

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
| CORE-01 | Phase 1 | Complete |
| CORE-02 | Phase 2 | Complete |
| CORE-03 | Phase 2 | Complete |
| CORE-04 | Phase 2 | Complete |
| CORE-05 | Phase 2 | Complete |
| INTR-01 | Phase 2 | Complete |
| INTR-02 | Phase 2 | Complete |
| INTR-03 | Phase 2 | Complete |
| INTR-04 | Phase 2 | Complete |
| API-01 | Phase 2 | Complete |
| API-02 | Phase 2 | Complete |
| API-03 | Phase 2 | Complete |
| API-04 | Phase 2 | Complete |
| A11Y-01 | Phase 3 | Complete |
| A11Y-02 | Phase 3 | Complete |
| PKG-01 | Phase 1 | Complete |
| PKG-02 | Phase 1 | Complete |
| PKG-03 | Phase 1 | Complete |
| PKG-04 | Phase 1 | Complete |
| PKG-05 | Phase 1 | Complete |
| DOC-01 | Phase 3 | Complete |
| DOC-02 | Phase 3 | Complete |
| DOC-03 | Phase 3 | Complete |

**v4.0 Coverage:**
- v4.0 requirements: 23 total
- Completed: 23 ✓

---

## v1.0.0 Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REN-01 | Phase 1 | Pending |
| REN-02 | Phase 1 | Pending |
| REN-03 | Phase 1 | Pending |
| CLN-01 | Phase 1 | Pending |
| CLN-02 | Phase 1 | Pending |
| CLN-03 | Phase 1 | Pending |
| BLD-01 | Phase 1 | Pending |
| BLD-02 | Phase 1 | Pending |
| BLD-03 | Phase 1 | Pending |
| GIT-01 | Phase 2 | Pending |
| GIT-02 | Phase 2 | Pending |
| DOC-04 | Phase 2 | Pending |
| DOC-05 | Phase 2 | Pending |
| DOC-06 | Phase 2 | Pending |
| DOC-07 | Phase 2 | Pending |
| CI-01 | Phase 2 | Pending |
| CI-02 | Phase 2 | Pending |
| CI-03 | Phase 2 | Pending |
| CI-04 | Phase 2 | Pending |

**v1.0.0 Coverage:**
- v1.0.0 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-17*
*Last updated: 2026-01-19 - v1.0.0 requirements added (19 total)*
