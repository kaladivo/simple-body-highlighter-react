---
phase: 01-foundation-build-system
plan: 01
subsystem: infra
tags: [tsup, typescript, esm, cjs, bundler, react-library]

# Dependency graph
requires: []
provides:
  - package.json configured for web-only React library
  - tsup bundler with ESM + CJS dual output
  - TypeScript config for modern web bundling
  - Build system ready for component migration
affects: [01-02, 01-03, 02-api-component, 03-polish-docs]

# Tech tracking
tech-stack:
  added: [tsup@8.4.0, @types/react-dom@18.3.0]
  patterns: [ESM-first with CJS fallback, exports field for module resolution]

key-files:
  created: [tsup.config.ts]
  modified: [package.json, tsconfig.json, .gitignore]

key-decisions:
  - "Package renamed to react-body-highlighter (v4.0.0 major version)"
  - "ESM-first with type: module"
  - "React 18/19 peer dependency range"

patterns-established:
  - "Dual ESM/CJS output via tsup"
  - "exports field with types-first ordering"
  - "sideEffects: false for tree-shaking"

# Metrics
duration: 5min
completed: 2026-01-17
---

# Phase 01 Plan 01: Build System Setup Summary

**tsup bundler with ESM+CJS dual output, package renamed to react-body-highlighter v4.0.0, all React Native dependencies removed**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-17T15:48:00Z
- **Completed:** 2026-01-17T15:53:18Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Package renamed from react-native-body-highlighter to react-body-highlighter
- All React Native dependencies removed (react-native, react-native-svg, RN tooling)
- tsup bundler configured for ESM + CJS dual output
- TypeScript config updated for React 17+ JSX transform
- Modern exports field configured for proper module resolution

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure package.json for web-only React library** - `0d90068` (feat)
2. **Task 2: Create tsup.config.ts and update tsconfig.json** - `9a2d120` (feat)
3. **Task 3: Update .gitignore and install dependencies** - `109271b` (chore)

## Files Created/Modified
- `package.json` - Renamed package, removed RN deps, added tsup, configured exports
- `tsconfig.json` - Updated for web bundling with react-jsx transform
- `tsup.config.ts` - New file for ESM+CJS bundler configuration
- `.gitignore` - Added dist/, simplified patterns
- `package-lock.json` - New lock file from npm install

## Decisions Made
- Renamed package to react-body-highlighter with major version bump to 4.0.0
- Set React 18/19 as peer dependency range for broad compatibility
- Kept existing Jest test setup (will be addressed in later plans)
- Removed yarn.lock in favor of package-lock.json (npm)

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None - all tasks completed successfully without issues.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Build system is ready for component migration
- Next plan (01-02) can convert react-native-svg components to native SVG
- tsup is installed and configured, build command exists
- Note: Build will fail until components are migrated (react-native-svg imports still exist in source)

---
*Phase: 01-foundation-build-system*
*Plan: 01 (Build System Setup)*
*Completed: 2026-01-17*
