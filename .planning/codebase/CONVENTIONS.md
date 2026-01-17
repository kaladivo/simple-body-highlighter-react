# Coding Conventions

**Analysis Date:** 2026-01-17

## Naming Patterns

**Files:**
- Component files: PascalCase with `.tsx` extension (e.g., `SvgMaleWrapper.tsx`, `SvgFemaleWrapper.tsx`)
- Data/asset files: camelCase with `.ts` extension (e.g., `bodyFront.ts`, `bodyFemaleBack.ts`)
- Utility files: camelCase with `.ts` extension (e.g., `differenceWith.ts`)
- Entry point: `index.tsx` at root

**Functions:**
- camelCase for all functions and hooks (e.g., `getColorToFill`, `mergedBodyParts`, `getPartStyles`)
- React components use PascalCase (e.g., `Body`, `SvgMaleWrapper`)
- Callbacks prefixed with handler verbs (e.g., `onBodyPartPress`)

**Variables:**
- camelCase for variables (e.g., `fillColor`, `bodyPart`, `userDataMap`)
- Constants use camelCase (e.g., `bodyFront`, `bodyBack`)
- Boolean variables not prefixed with `is` consistently (e.g., `isOnlyRight`, `isOnlyLeft`)

**Types:**
- PascalCase for type and interface names (e.g., `BodyPart`, `ExtendedBodyPart`, `BodyProps`)
- Type unions for string literals (e.g., `"front" | "back"`, `"male" | "female"`)
- `Slug` type is a union of string literals for body part identifiers

## Code Style

**Formatting:**
- Prettier 3.6.2 installed as devDependency
- No `.prettierrc` configuration file detected - uses Prettier defaults
- 2-space indentation observed in source files
- Double quotes for strings in TypeScript/TSX files

**Linting:**
- No ESLint configuration detected
- No linting rules enforced

**TypeScript:**
- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- ES6 target with CommonJS modules
- JSX mode: `react-native`
- Declaration files generated (`"declaration": true`)

## Import Organization

**Order:**
1. React imports first (`import React, { memo, useCallback } from "react"`)
2. External library imports (`import { Path } from "react-native-svg"`)
3. Local utility imports (`import { differenceWith } from "./utils/differenceWith"`)
4. Asset/data imports (`import { bodyFront } from "./assets/bodyFront"`)
5. Component imports (`import { SvgMaleWrapper } from "./components/SvgMaleWrapper"`)

**Path Aliases:**
- No path aliases configured
- Relative imports used throughout (e.g., `"./utils/differenceWith"`, `"../index"`)

## Error Handling

**Patterns:**
- Defensive checks with early returns in utility functions:
  ```typescript
  if (!Array.isArray(list1) || list1.length === 0) return [];
  if (!Array.isArray(list2) || list2.length === 0) return [...list1];
  ```
- Optional chaining used extensively (e.g., `bodyPart.styles?.fill`, `bodyPart.path?.common`)
- Nullish coalescing for defaults (e.g., `bodyPart.styles?.fill ?? defaultFill`)
- No try-catch blocks - errors propagate to consumer

## Logging

**Framework:** None

**Patterns:**
- No logging present in library code
- Console statements not used

## Comments

**When to Comment:**
- Inline comments for logic explanation (e.g., `// Per-part styles override global defaults`)
- Comments for data sections in asset files (e.g., `// Chest`, `// Obliques`)

**JSDoc/TSDoc:**
- Not used - types exported for consumer documentation
- No function documentation comments

## Function Design

**Size:**
- Functions generally under 50 lines
- `renderBodySvg` is the largest at ~75 lines

**Parameters:**
- Destructured props pattern for components:
  ```typescript
  const Body = ({
    colors = ["#0984e3", "#74b9ff"],
    data,
    scale = 1,
    // ...
  }: BodyProps) => {
  ```
- Default parameter values provided inline
- ReadonlyArray used for array props to prevent mutation

**Return Values:**
- Components return JSX.Element
- Utility functions return explicit types
- `undefined` returned explicitly when no value (e.g., `return undefined; // Let getPartStyles provide the default`)

## Module Design

**Exports:**
- Default export for main component (`export default Body`)
- Named exports for types (`export type Slug`, `export interface BodyPart`)
- Named exports for wrapper components (`export const SvgMaleWrapper`)
- Named exports for utility functions (`export function differenceWith`)

**Barrel Files:**
- No barrel files - direct imports from specific modules
- Entry point `index.tsx` serves as main export

## React Patterns

**Hooks:**
- `useCallback` for memoizing functions that depend on props:
  ```typescript
  const getPartStyles = useCallback(
    (bodyPart: ExtendedBodyPart): BodyPartStyles => {
      // ...
    },
    [defaultFill, defaultStroke, defaultStrokeWidth]
  );
  ```
- No `memo` wrapper on main component despite import

**Props:**
- All props have explicit types via `BodyProps` interface
- Default values provided via destructuring
- Callbacks typed with function signatures (e.g., `onBodyPartPress?: (b: ExtendedBodyPart, side?: "left" | "right") => void`)

**Component Structure:**
- Wrapper components for SVG rendering (`SvgMaleWrapper`, `SvgFemaleWrapper`)
- Main component handles logic, wrappers handle presentation
- Accessibility props included (`accessible`, `accessibilityLabel`)

---

*Convention analysis: 2026-01-17*
