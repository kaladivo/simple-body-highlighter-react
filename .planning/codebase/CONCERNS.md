# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**Legacy React Native Configuration File:**
- Issue: `rn-cli.config.js` still exists referencing `react-native-typescript-transformer`
- Files: `/Users/kaladivo/workspace/funCoding/react-native-body-highlighter/rn-cli.config.js`
- Impact: Confusing for contributors; suggests React Native support that no longer exists
- Fix approach: Delete the file - it serves no purpose in the web-only v4.0 codebase

**SVG Path Data Embedded in TypeScript:**
- Issue: Large SVG path strings hardcoded in asset files (1132 lines across 4 files)
- Files: `src/assets/bodyFront.ts` (313 lines), `src/assets/bodyBack.ts` (263 lines), `src/assets/bodyFemaleFront.ts` (316 lines), `src/assets/bodyFemaleBack.ts` (240 lines)
- Impact: Increased bundle size; difficult to edit/maintain SVG data; no visual editing possible
- Fix approach: Consider extracting to .svg files and importing, or generating from a single source-of-truth SVG

**Duplicate SVG Wrapper Components:**
- Issue: `SvgMaleWrapper.tsx` and `SvgFemaleWrapper.tsx` are nearly identical (50 lines each)
- Files: `src/components/SvgMaleWrapper.tsx`, `src/components/SvgFemaleWrapper.tsx`
- Impact: Code duplication; changes require updating both files
- Fix approach: Merge into single `SvgWrapper` component with gender-specific viewBox/path data passed as props

**Keyboard Event Type Casting:**
- Issue: Unsafe type cast `e as unknown as React.MouseEvent<SVGPathElement>` in keyboard handler
- Files: `src/index.tsx` (line 25)
- Impact: Type safety violation; misleading event type passed to onClick callback
- Fix approach: Update `onClick` signature to accept union type `React.MouseEvent | React.KeyboardEvent`, or add separate `onKeyDown` prop

## Known Bugs

**None identified during analysis.**

The test suite passes 24 tests with 100% statement coverage and 96.15% branch coverage.

## Security Considerations

**No Critical Security Issues Found.**

The library is a pure UI component with:
- No network requests
- No user data storage
- No authentication
- SVG paths are static data, not user input

**Low Risk - Color Injection:**
- Risk: User-provided colors passed directly to SVG fill attribute
- Files: `src/index.tsx` (line 77)
- Current mitigation: React handles attribute escaping
- Recommendations: Document that colors should be validated if from untrusted sources; consider adding color format validation

## Performance Bottlenecks

**Bundle Size (SVG Data):**
- Problem: 143 KB ESM / 144 KB CJS bundle includes inline SVG path data
- Files: `src/assets/*.ts`
- Cause: All 4 body variants (male/female front/back) bundled together
- Improvement path: Code-split by gender/side; lazy-load unused variants; extract to external SVG files

**Color Lookup Optimization Already Done:**
- The codebase uses `useMemo` + `Map` for O(1) color lookups - this is good
- Files: `src/index.tsx` (lines 41-45)

**No Virtualization Needed:**
- Fixed number of body parts (44 slugs max) - no performance concern with rendering

## Fragile Areas

**SVG ViewBox Coordinates:**
- Files: `src/components/SvgMaleWrapper.tsx` (line 16), `src/components/SvgFemaleWrapper.tsx` (line 16)
- Why fragile: Magic numbers for viewBox (`"0 0 724 1448"`, `"724 0 724 1448"`, etc.) tied to specific SVG artwork
- Safe modification: Do not change viewBox without also updating all path data coordinates
- Test coverage: Covered by render tests, but visual regression testing would be better

**Body Part Slug Consistency:**
- Files: `src/types.ts` (lines 18-65), `src/assets/*.ts`
- Why fragile: `BodyPartSlug` type must exactly match slugs in asset files
- Safe modification: Use generated types from asset files, or add build-time validation
- Test coverage: TypeScript catches type mismatches but not missing entries

## Scaling Limits

**Not Applicable.**

This is a client-side UI component with fixed data (44 body parts). No server scaling concerns.

**Maximum Highlighted Parts:**
- Current capacity: Can highlight all 44 parts simultaneously
- Limit: None practical - React handles re-renders efficiently
- Scaling path: Not needed

## Dependencies at Risk

**Jest Version Mismatch:**
- Risk: `jest@29.7.0` in devDependencies but `jest-environment-jsdom@30.2.0` (version mismatch)
- Impact: Potential compatibility issues; tests work now but may break on jest updates
- Migration plan: Align both to same major version (either 29.x or 30.x)

**No Production Dependencies:**
- The library has zero runtime dependencies beyond React peer dependency
- This is excellent for long-term maintainability

## Missing Critical Features

**Deferred from v4.0 (documented in `.planning/STATE.md`):**

**CSS Transitions for Color Changes:**
- Problem: Color changes are instant with no animation
- Blocks: Smooth UX for highlighting/unhighlighting
- Tracking: INTR-05

**Arrow Key Navigation:**
- Problem: No keyboard navigation between adjacent body parts
- Blocks: Full keyboard accessibility for users who can't use mouse
- Tracking: INTR-06

**Focus Indicators:**
- Problem: No visible focus ring for keyboard users
- Blocks: WCAG compliance for visible focus
- Tracking: INTR-07

**SSR/Hydration Testing:**
- Problem: Not verified to work with server-side rendering
- Blocks: Usage in Next.js/Remix apps with SSR
- Tracking: ADV-01

## Test Coverage Gaps

**Keyboard Handler Branches:**
- What's not tested: Lines 23-30 in `src/index.tsx` (handleKeyDown function branches)
- Files: `src/index.tsx`
- Risk: Keyboard accessibility could break without detection
- Priority: Low (96.15% branch coverage; keyboard tests exist but not all branches)

**Female Body Variants:**
- What's not tested: Female-specific SVG path rendering validated visually
- Files: `src/assets/bodyFemaleFront.ts`, `src/assets/bodyFemaleBack.ts`
- Risk: Female body could render incorrectly without visual detection
- Priority: Medium - add visual regression tests or snapshot tests

**Border="none" Case:**
- What's not tested: Explicit test for `border="none"` hiding outline
- Files: `src/components/SvgMaleWrapper.tsx`, `src/components/SvgFemaleWrapper.tsx`
- Risk: Border visibility logic could break
- Priority: Low - code is simple conditional

---

*Concerns audit: 2026-01-19*
