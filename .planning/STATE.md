# Project State: react-body-highlighter

## Project Reference

**Core Value:** Display and interact with body parts visually -- highlight muscle groups with per-part colors and handle user selection

**Current Focus:** Migrating react-native-body-highlighter to web-only react-body-highlighter

---

## Current Position

**Phase:** 2 of 3 (Core Migration)
**Plan:** 2 of 4 complete
**Status:** In progress - Plan 02-02 complete
**Last activity:** 2026-01-17 - Completed 02-02-PLAN.md (Asset Refactoring)

**Progress:**
```
Phase 1: [##########] 100% (3/3 plans) COMPLETE
Phase 2: [#####.....] 50% (2/4 plans)
Phase 3: [..........] 0%
Overall: [#####.....] ~56% (5/9 estimated plans)
```

**Next Action:** Execute 02-03-PLAN.md (Component Refactoring)

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Session count | 5 |
| Plans completed | 5 |
| Requirements done | 11/23 |
| Phases complete | 1/3 |

---

## Accumulated Context

### Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Web-only (drop RN) | Simpler codebase, clear target audience | 2026-01-17 |
| Inline SVG | No dependencies, native browser support | 2026-01-17 |
| Per-part colors | More flexible than intensity system | 2026-01-17 |
| Left/right prefixes | Explicit control over bilateral muscles | 2026-01-17 |
| Quick depth (3 phases) | User requested minimal phase structure | 2026-01-17 |
| Package name: react-body-highlighter | Breaking change from RN, v4.0.0 | 2026-01-17 |
| ESM-first with type: module | Modern default, CJS fallback via exports | 2026-01-17 |
| React 18/19 peer dependency | Broad compatibility without legacy support | 2026-01-17 |
| Native SVG elements | Use lowercase svg/g/path for web compatibility | 2026-01-17 |
| onClick over onPress | Standard web event handlers | 2026-01-17 |
| cursor: pointer styling | Visual feedback for interactive body parts | 2026-01-17 |
| role="img" + aria-label | Web accessibility replacing RN accessible props | 2026-01-17 |
| 44 slugs total (38 bilateral + 4 centerline + 2 back-neck) | Based on SVG asset path structure analysis | 2026-01-17 |
| upper-back and lower-back are bilateral | Assets have path.left/right, not centerline | 2026-01-17 |
| chest is bilateral | Assets have path.left/right in bodyFront.ts | 2026-01-17 |
| Both slug and color required in BodyPartData | Simplified API, no optional fields | 2026-01-17 |
| Female back has no head entry | Only hair centerline, matches original assets | 2026-01-17 |
| BodyPartAsset local to each file | Interface defined in each asset file | 2026-01-17 |

### Technical Notes

- Replace `onPress` with `onClick` (silent failure otherwise)
- SVG must have explicit width/height alongside viewBox for Safari
- Use lowercase element names (`<path>` not `<Path>`)
- Use `React.SVGProps<SVGPathElement>` for TypeScript types
- tsup for bundling (ESM + CJS dual output)
- exports field with types-first ordering for proper module resolution
- Add `display: 'block'` to SVG to prevent inline spacing issues
- Export Body as both default and named export
- ESM import test: `node --input-type=module -e "import { Body } from './dist/index.js'"`
- CJS import test: `node -e "const { Body } = require('./dist/index.cjs')"`
- BodyPartSlug: 44 slugs - 19 bilateral pairs, 4 centerline, 2 back-view-only
- neck is dual: centerline "neck" for front view, bilateral "left-neck"/"right-neck" for back view
- Asset entry counts: bodyFront (34), bodyBack (30), bodyFemaleFront (34), bodyFemaleBack (27)
- pathData is flat string[] - no nested path.left/right structure

### Todos

- [x] Plan Phase 1
- [x] Execute 01-01 (Build System Setup)
- [x] Execute 01-02 (SVG Component Migration)
- [x] Execute 01-03 (Build Verification)
- [x] Plan Phase 2
- [x] Execute 02-01 (Type System)
- [x] Execute 02-02 (Asset Refactoring)
- [ ] Execute 02-03 (Component Refactoring)
- [ ] Execute 02-04 (Testing)

### Blockers

None

---

## Phase 2 Progress

**Phase 2: Core Migration** is in progress.

| Plan | Name | Status | Key Output |
|------|------|--------|------------|
| 02-01 | Type System | Complete | src/types.ts with BodyPartSlug, BodyPartData, ModelProps |
| 02-02 | Asset Refactoring | Complete | 4 asset files with bilateral slug split |
| 02-03 | Component Refactoring | Pending | Simplified Body component API |
| 02-04 | Testing | Pending | Web testing library tests |

**Type system ready:**
- BodyPartSlug: 44 values (38 bilateral + 4 centerline + 2 back-neck)
- BodyPartData: { slug: BodyPartSlug, color: string } (both required)
- ModelProps: onClick callback with (slug, event) signature
- Types exported in dist/index.d.ts
- Legacy types preserved for transition

**Asset refactoring complete:**
- All 4 asset files use BodyPartAsset type
- Bilateral muscles split into left-*/right-* entries
- Centerline muscles use unprefixed slugs
- pathData is flat string[] array
- No color field in assets

---

## Session Continuity

**Last session:** 2026-01-17T17:15Z
**Stopped at:** Completed 02-02-PLAN.md (Asset Refactoring)
**Resume file:** None - ready for 02-03-PLAN.md

**Context for next session:**
- Asset files fully refactored with BodyPartAsset type
- Component needs update to use new asset format
- Current TS errors in src/index.tsx expected (using old BodyPart type)
- Next: Refactor Body component to use new types and asset format

---
*State initialized: 2026-01-17*
*Last updated: 2026-01-17T17:15Z*
