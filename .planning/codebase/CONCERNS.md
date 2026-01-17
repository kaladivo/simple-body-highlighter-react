# Codebase Concerns

**Analysis Date:** 2026-01-17

## Tech Debt

**Non-null Assertions on Optional Properties:**
- Issue: The code uses non-null assertions (`!`) on optional `slug` properties in multiple places
- Files: `index.tsx` (lines 108, 121)
- Impact: Could cause runtime errors if a body part without a slug is passed
- Fix approach: Add proper null checks or make `slug` required in the type definition

**Duplicate Type Union Entry:**
- Issue: `"deltoids"` appears twice in the `Slug` type union
- Files: `index.tsx` (lines 19-20)
- Impact: Minor - no runtime issue but indicates copy/paste error and reduces code quality
- Fix approach: Remove the duplicate entry from the Slug type

**Unused Utility Function:**
- Issue: `differenceWith` function imported but never used in the codebase
- Files: `index.tsx` (line 3), `utils/differenceWith.ts`
- Impact: Dead code increases bundle size slightly and causes confusion
- Fix approach: Remove the import and the utility file if truly unused, or implement its intended usage

**Unused Comparison Function:**
- Issue: `comparison` function defined but never used
- Files: `index.tsx` (lines 76-77)
- Impact: Dead code that was likely intended for data deduplication
- Fix approach: Remove if unused or implement its intended functionality

**Large Hardcoded SVG Paths:**
- Issue: SVG path data is embedded directly in TypeScript files (1071 lines total across 4 asset files)
- Files: `assets/bodyFront.ts`, `assets/bodyBack.ts`, `assets/bodyFemaleFront.ts`, `assets/bodyFemaleBack.ts`
- Impact: Makes maintenance difficult; changes require editing large string constants
- Fix approach: Consider exporting SVG paths from external SVG files or using a build-time extraction process

**Inconsistent Border Path Definitions:**
- Issue: Border outline paths are defined inline in wrapper components with very long strings
- Files: `components/SvgMaleWrapper.tsx`, `components/SvgFemaleWrapper.tsx`
- Impact: Hard to maintain; mixes presentation with component logic
- Fix approach: Extract border paths to asset files similar to body part paths

## Known Bugs

**Head Part Missing on Female Back:**
- Symptoms: Female back view may not include all body parts that male back has
- Files: `assets/bodyFemaleBack.ts` (compare with `assets/bodyBack.ts`)
- Trigger: Using `gender="female"` with `side="back"`
- Workaround: Use male view or accept limited female back support

## Security Considerations

**No Input Validation on Color Props:**
- Risk: Malformed color strings could cause rendering issues
- Files: `index.tsx` (all color-related props)
- Current mitigation: React Native SVG handles invalid colors gracefully
- Recommendations: Add color validation or sanitization for user-provided colors

## Performance Bottlenecks

**Repeated Data Lookups in Render:**
- Problem: `data.find()` is called inside `.map()` for left and right paths, causing O(n*m) complexity
- Files: `index.tsx` (lines 202, 224)
- Cause: Finding matching user data for each path during render
- Improvement path: The `userDataMap` optimization is good but these additional lookups bypass it; refactor to use the map consistently

**No Memoization of Merged Body Parts:**
- Problem: `mergedBodyParts` creates new objects on every render even when data unchanged
- Files: `index.tsx` (lines 105-147)
- Cause: `useCallback` memoizes the function but not its return value
- Improvement path: Use `useMemo` for the merged result, not just `useCallback` for the function

**Component Not Memoized:**
- Problem: `Body` component is not wrapped in `React.memo`
- Files: `index.tsx` (line 79)
- Cause: Functional component without memoization
- Improvement path: Add `React.memo(Body)` export with custom comparison if needed

## Fragile Areas

**SVG Path Data Structure:**
- Files: `assets/bodyFront.ts`, `assets/bodyBack.ts`, `assets/bodyFemaleFront.ts`, `assets/bodyFemaleBack.ts`
- Why fragile: Path data is manually crafted; any modification risks breaking the visual appearance
- Safe modification: Use SVG editing tools, export paths, and thoroughly visual-test changes
- Test coverage: No automated visual regression tests for SVG rendering

**Slug-Path Mapping:**
- Files: `index.tsx`, all `assets/*.ts` files
- Why fragile: Slugs in type definition must match slugs in asset files exactly
- Safe modification: Add validation that all slugs in types have corresponding path data
- Test coverage: No tests verify slug-path correspondence

## Scaling Limits

**Memory with Many Body Parts:**
- Current capacity: ~20 body part slugs defined
- Limit: SVG rendering performance degrades with many complex paths
- Scaling path: Consider SVG optimization or lazy loading of unused paths

## Dependencies at Risk

**react-native-svg Version Pinning:**
- Risk: Pinned to `^15.9.0` which may have breaking changes in future major versions
- Impact: SVG rendering could break on upgrade
- Migration plan: Test thoroughly before major version upgrades; consider version range constraints

## Missing Critical Features

**No TypeScript Strict Null Checks Enforcement:**
- Problem: While `strict: true` is set, non-null assertions (`!`) suggest potential runtime null issues
- Blocks: Confident runtime safety for optional slug handling

**No Prop Validation at Runtime:**
- Problem: Invalid intensity values (e.g., 0, -1, or values exceeding colors array length) not handled
- Blocks: Graceful error handling for invalid input

**No Accessibility for Individual Body Parts:**
- Problem: Only the wrapper SVG has accessibility labels, not individual body parts
- Blocks: Screen reader users cannot identify specific body parts

## Test Coverage Gaps

**No Tests for Hidden/Disabled Parts:**
- What's not tested: `hiddenParts` and `disabledParts` props behavior
- Files: `index.tsx` (lines 69-70, 107-109, 150-151, 170)
- Risk: Breaking changes to filtering logic could go unnoticed
- Priority: Medium

**No Tests for Left/Right Side Selection:**
- What's not tested: `side: "left"` or `side: "right"` in body part data
- Files: `index.tsx` (lines 200-243)
- Risk: Side-specific rendering logic could break
- Priority: Medium

**No Tests for Female Body:**
- What's not tested: `gender="female"` rendering path
- Files: `index.tsx` (lines 251-252), `components/SvgFemaleWrapper.tsx`
- Risk: Female-specific rendering issues would go unnoticed
- Priority: High

**No Tests for Back View:**
- What's not tested: `side="back"` rendering path
- Files: `index.tsx` (lines 252, 255)
- Risk: Back view rendering issues would go unnoticed
- Priority: High

**No Tests for Border Rendering:**
- What's not tested: `border` prop and "none" value behavior
- Files: `components/SvgMaleWrapper.tsx`, `components/SvgFemaleWrapper.tsx`
- Risk: Border rendering could break silently
- Priority: Low

**No Integration Tests for onBodyPartPress:**
- What's not tested: Press event callback with correct parameters
- Files: `index.tsx` (lines 186-188, 209-212, 231-234)
- Risk: Press handler changes could break user interactions
- Priority: Medium

---

*Concerns audit: 2026-01-17*
