---
phase: 02-core-migration
plan: 01
subsystem: api
tags: [typescript, types, exports, body-highlighter]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Build system with tsup, ESM/CJS dual output, type generation
provides:
  - BodyPartSlug type with 44 explicit slugs (38 bilateral + 4 centerline + 2 back-neck)
  - BodyPartData interface for simplified data prop
  - ModelProps interface with onClick (replaces onBodyPartPress)
  - Type exports in dist/index.d.ts
affects: [02-02-asset-refactoring, 02-03-component-refactoring, 02-04-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Explicit left/right slug prefixes for bilateral muscles
    - Simplified data format with required slug and color fields
    - onClick callback with slug and MouseEvent parameters

key-files:
  created:
    - src/types.ts
  modified:
    - src/index.tsx

key-decisions:
  - "44 slugs total: 38 bilateral (19 pairs), 4 centerline (abs, head, hair, neck), 2 back-view-only (left-neck, right-neck)"
  - "upper-back and lower-back are bilateral (have path.left/right in assets)"
  - "chest is bilateral (has path.left/right in assets)"
  - "neck is dual: centerline for front view, bilateral for back view"
  - "Both slug and color required in BodyPartData (no optional fields)"
  - "onClick replaces onBodyPartPress with typed SVGPathElement event"

patterns-established:
  - "BodyPartSlug: union type of all valid body part identifiers"
  - "BodyPartData: { slug: BodyPartSlug, color: string } with both fields required"
  - "ModelProps: simplified props interface with onClick callback"

# Metrics
duration: 2min
completed: 2026-01-17
---

# Phase 02 Plan 01: Type System Summary

**New simplified type system with 44 body part slugs, BodyPartData interface, and ModelProps with onClick callback**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-17T16:40:02Z
- **Completed:** 2026-01-17T16:42:04Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created src/types.ts with BodyPartSlug (44 slugs), BodyPartData, and ModelProps
- Correctly categorized all body parts: bilateral vs centerline based on SVG path structure
- Added comprehensive JSDoc comments with usage examples
- Re-exported new types from src/index.tsx while preserving legacy types
- Build verified: types appear in dist/index.d.ts

## Task Commits

Each task was committed atomically:

1. **Task 1: Create types.ts with new type definitions** - `d013579` (feat)
2. **Task 2: Add type re-exports to index.tsx** - `3db4cb7` (feat)

## Files Created/Modified

- `src/types.ts` - New type definitions: BodyPartSlug (44 values), BodyPartData, ModelProps
- `src/index.tsx` - Added type re-exports for new types, kept legacy types for transition

## Decisions Made

1. **44 slugs in BodyPartSlug** - Based on SVG asset analysis:
   - 19 bilateral pairs (38 slugs): adductors, ankles, biceps, calves, chest, deltoids, feet, forearm, gluteal, hamstring, hands, knees, lower-back, obliques, quadriceps, tibialis, trapezius, triceps, upper-back
   - 4 centerline: abs, head, hair, neck (front view)
   - 2 back-view-only: left-neck, right-neck (neck has bilateral paths in bodyBack.ts)

2. **upper-back and lower-back are bilateral** - Verified in bodyBack.ts that these have path.left and path.right arrays, so they are left-upper-back/right-upper-back, not centerline

3. **chest is bilateral** - Verified in bodyFront.ts that chest has path.left and path.right arrays

4. **Both fields required in BodyPartData** - Simplified API: no optional slug, no intensity system. Users must specify both slug and color.

5. **onClick callback signature** - Takes `(slug: BodyPartSlug, event: React.MouseEvent<SVGPathElement>)` for type safety and access to event properties

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Type foundation complete for asset refactoring (Plan 02)
- BodyPartSlug type defines the target slug format for asset files
- Old types preserved so existing component still works during migration
- Build and typecheck both pass

---
*Phase: 02-core-migration*
*Completed: 2026-01-17*
