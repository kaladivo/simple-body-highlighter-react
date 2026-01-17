# Architecture

**Analysis Date:** 2026-01-17

## Pattern Overview

**Overall:** Single-Component Library with SVG Rendering

**Key Characteristics:**
- Exports a single React component (`Body`) as the primary public API
- Uses SVG paths to render human body anatomy with customizable highlighting
- Data-driven rendering: body parts are defined as static path data, user provides highlighting configuration
- Supports male/female variants and front/back views through composition

## Layers

**Public API (Entry Point):**
- Purpose: Expose the Body component and TypeScript types for consumers
- Location: `index.tsx`
- Contains: Main `Body` component, all exported types (`Slug`, `BodyPart`, `ExtendedBodyPart`, `BodyPartStyles`, `BodyProps`)
- Depends on: Components, Assets, Utils
- Used by: External consumers (npm package users)

**SVG Wrapper Components:**
- Purpose: Provide SVG containers with gender-specific viewboxes and body outlines
- Location: `components/`
- Contains: `SvgMaleWrapper.tsx`, `SvgFemaleWrapper.tsx`
- Depends on: `react-native-svg`
- Used by: Main `Body` component in `index.tsx`

**Body Part Assets:**
- Purpose: Store SVG path definitions for each body part (muscle group)
- Location: `assets/`
- Contains: `bodyFront.ts`, `bodyBack.ts`, `bodyFemaleFront.ts`, `bodyFemaleBack.ts`
- Depends on: Type definitions from `index.tsx`
- Used by: Main `Body` component

**Utilities:**
- Purpose: Provide helper functions for data manipulation
- Location: `utils/`
- Contains: `differenceWith.ts` (array comparison utility)
- Depends on: Nothing
- Used by: Main `Body` component (note: imported but not actively used in current code)

## Data Flow

**Rendering Flow:**

1. Consumer passes `data` array with body part slugs and styling (intensity/color/styles)
2. `Body` component selects appropriate body asset based on `gender` and `side` props
3. Asset body parts are merged with user-provided data via `mergedBodyParts()` callback
4. For each body part, SVG `Path` elements are rendered with computed fill/stroke styles
5. `SvgMaleWrapper` or `SvgFemaleWrapper` wraps all paths in an SVG container

**Color Resolution Priority:**
1. Per-part `styles.fill` (highest priority)
2. Per-part `color` prop
3. Intensity-based color from `colors` array
4. `defaultFill` prop (lowest priority)

**State Management:**
- No internal state - component is fully controlled via props
- All style computation happens during render via `useCallback` memoization

## Key Abstractions

**BodyPart:**
- Purpose: Represents a single body part with its SVG path data
- Examples: `assets/bodyFront.ts` contains array of `BodyPart` objects
- Pattern: Static data structure with `slug`, `color`, and `path` (with `common`, `left`, `right` sub-paths)

**ExtendedBodyPart:**
- Purpose: Extended body part with user-provided styling and side selection
- Examples: Passed via `data` prop to `Body` component
- Pattern: Extends `BodyPart` with `intensity`, `side`, and `styles` properties

**Slug:**
- Purpose: Type-safe identifier for body parts (muscles)
- Examples: `"chest"`, `"biceps"`, `"quadriceps"`, etc.
- Pattern: Union type of all valid body part identifiers

**SvgWrapper:**
- Purpose: Gender-specific SVG container with viewBox and border outline
- Examples: `components/SvgMaleWrapper.tsx`, `components/SvgFemaleWrapper.tsx`
- Pattern: React FC accepting `children`, `scale`, `side`, `border` props

## Entry Points

**Package Entry (`index.tsx`):**
- Location: `/Users/kaladivo/workspace/funCoding/react-native-body-highlighter/index.tsx`
- Triggers: Imported by consuming applications
- Responsibilities: Export `Body` component (default) and all TypeScript types

**Build Output (`dist/index.js`):**
- Location: `dist/index.js` (generated)
- Triggers: `npm publish` or consumer imports
- Responsibilities: Compiled JS entry point for npm package

## Error Handling

**Strategy:** Silent fallbacks with sensible defaults

**Patterns:**
- Missing body part data falls back to `defaultFill` color
- Disabled parts (`disabledParts` prop) render with gray `#EBEBE4` fill
- Hidden parts (`hiddenParts` prop) are filtered out entirely
- Optional chaining used throughout (`onBodyPartPress?.()`)

## Cross-Cutting Concerns

**Logging:** None - library does not log

**Validation:** TypeScript compile-time type checking only; no runtime validation

**Authentication:** Not applicable - UI component library

**Accessibility:**
- SVG elements have `accessible={true}` and `accessibilityLabel` props
- Body parts have `aria-disabled` attribute when in `disabledParts`

---

*Architecture analysis: 2026-01-17*
