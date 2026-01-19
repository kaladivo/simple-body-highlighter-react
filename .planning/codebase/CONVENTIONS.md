# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `SvgMaleWrapper.tsx`)
- Type definitions: camelCase with `.ts` extension (e.g., `types.ts`)
- Asset data files: camelCase with `.ts` extension (e.g., `bodyFront.ts`)
- Test files: Component name followed by `.test.tsx` (e.g., `Body.test.tsx`)
- Config files: lowercase with appropriate extension (e.g., `jest.config.js`, `tsup.config.ts`)

**Functions:**
- camelCase for all functions and handlers (e.g., `handleKeyDown`, `getColor`, `getAssets`)
- Prefix `handle` for event handlers (e.g., `handleKeyDown`)
- Prefix `get` for accessor/getter functions (e.g., `getColor`, `getAssets`)
- Prefix `render` for functions returning JSX (e.g., `renderBodySvg`)

**Variables:**
- camelCase for all variables (e.g., `colorMap`, `fillColor`, `isDisabled`)
- Boolean variables prefixed with `is` (e.g., `isDisabled`)
- Constants in camelCase, not SCREAMING_CASE (e.g., `bodyFront`, not `BODY_FRONT`)

**Types:**
- PascalCase for interfaces and type aliases (e.g., `BodyPartSlug`, `BodyPartData`, `ModelProps`)
- Interface names describe what they represent, no `I` prefix
- Type union members use kebab-case strings (e.g., `"left-biceps"`, `"right-chest"`)

## Code Style

**Formatting:**
- Prettier configured (listed in devDependencies)
- 2-space indentation (observed in source files)
- Double quotes for strings in TSX/TS files
- Semicolons at end of statements
- No explicit Prettier config file - uses defaults

**Linting:**
- No ESLint configuration present
- TypeScript strict mode enabled in `tsconfig.json`
- Relies on TypeScript for type checking (`npm run typecheck`)

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Import Organization

**Order:**
1. React imports first (`import React, { useCallback, useMemo } from "react"`)
2. Internal asset imports (`import { bodyFront } from "./assets/bodyFront"`)
3. Internal component imports (`import { SvgMaleWrapper } from "./components/SvgMaleWrapper"`)
4. Type imports (`import { BodyPartSlug, BodyPartData, ModelProps } from "./types"`)

**Path Aliases:**
- No path aliases configured
- All imports use relative paths (e.g., `"./assets/bodyFront"`, `"../types"`)

**Export Pattern:**
```typescript
// Named exports preferred for components
export const SvgMaleWrapper: React.FC<Props> = ({ ... }) => { ... };

// Default + named exports for main component
export default Body;
export { Body };

// Re-export types from index
export type { BodyPartSlug, BodyPartData, ModelProps } from "./types";
```

## Error Handling

**Patterns:**
- No explicit try/catch blocks in component code
- Optional chaining for callback invocation: `onClick?.(slug, e)`
- Default parameter values for graceful fallback: `data = []`, `gender = "male"`
- Nullish coalescing for fallback values: `colorMap.get(slug) ?? defaultFill`

## Logging

**Framework:** None (no logging in library code)

**Patterns:**
- No console.log statements in source code
- Library code is silent by design

## Comments

**When to Comment:**
- JSDoc comments for exported types and interfaces
- Inline comments for non-obvious logic sections
- Section comments in asset files to group related parts

**JSDoc/TSDoc:**
```typescript
/**
 * All valid body part slugs for the body highlighter component.
 *
 * Includes:
 * - 38 bilateral slugs (19 muscle pairs with left/right prefixes)
 * - 4 centerline slugs (abs, head, hair, neck for front view)
 * - 2 back-view-only bilateral neck slugs (left-neck, right-neck)
 *
 * Total: 44 unique slugs
 *
 * @example
 * ```typescript
 * const slug: BodyPartSlug = "left-biceps";
 * ```
 */
export type BodyPartSlug = ...
```

## Function Design

**Size:** Functions are small and focused, typically 5-20 lines

**Parameters:**
- Props destructured in function signature with default values
- Single object parameter pattern for component props

**Return Values:**
- React components return JSX directly
- Helper functions return typed values
- Use `useMemo` and `useCallback` for expensive computations and stable references

## Module Design

**Exports:**
- Single component per file for wrapper components
- Main component file exports component + types
- Assets export typed arrays

**Barrel Files:**
- `src/index.tsx` serves as barrel file
- Exports main component as default and named export
- Re-exports all public types

## React Patterns

**Component Structure:**
```typescript
const Body = ({
  data = [],
  onClick,
  gender = "male",
  // ... props with defaults
}: ModelProps) => {
  // 1. Memoized values
  const colorMap = useMemo(() => { ... }, [data]);

  // 2. Callbacks
  const getColor = useCallback((slug) => { ... }, [deps]);

  // 3. Helper functions
  const getAssets = () => { ... };
  const renderBodySvg = (assets) => { ... };

  // 4. Return
  return renderBodySvg(getAssets());
};
```

**Props Pattern:**
- All props optional except core data prop
- Sensible defaults provided
- TypeScript interfaces for prop types

## Accessibility Patterns

**ARIA Attributes:**
- `role="img"` on SVG container
- `role="button"` on interactive paths
- `aria-label` with human-readable text (dashes replaced with spaces)
- `aria-disabled` for disabled states
- `tabIndex` for keyboard navigation

**Keyboard Support:**
- Enter and Space key handlers for interactive elements
- `tabIndex={-1}` to exclude disabled parts from tab order

---

*Convention analysis: 2026-01-19*
