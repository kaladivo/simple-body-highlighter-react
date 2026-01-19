# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Single Component Library with Static Asset Data

**Key Characteristics:**
- Single exported React component (`Body`) as the entire public API
- Declarative props-based configuration (no internal state management)
- SVG path data stored as static TypeScript constants
- Gender and view variants handled through asset selection, not component branching

## Layers

**Public API Layer:**
- Purpose: Exposes the library's functionality to consumers
- Location: `src/index.tsx`
- Contains: Main `Body` component, type exports
- Depends on: Components layer, Assets layer, Types
- Used by: Consumer applications

**Components Layer:**
- Purpose: SVG wrapper components that handle viewBox and outline rendering
- Location: `src/components/`
- Contains: `SvgMaleWrapper.tsx`, `SvgFemaleWrapper.tsx`
- Depends on: React
- Used by: Main Body component

**Assets Layer:**
- Purpose: Static SVG path data for all body parts
- Location: `src/assets/`
- Contains: `bodyFront.ts`, `bodyBack.ts`, `bodyFemaleFront.ts`, `bodyFemaleBack.ts`
- Depends on: Types (BodyPartSlug)
- Used by: Main Body component

**Types Layer:**
- Purpose: TypeScript type definitions for the entire library
- Location: `src/types.ts`
- Contains: `BodyPartSlug`, `BodyPartData`, `ModelProps`
- Depends on: React (for event types)
- Used by: All other layers

## Data Flow

**Rendering Flow:**

1. Consumer passes `data` array (BodyPartData[]) with slug/color pairs to Body component
2. Body component creates a Map for O(1) color lookup from data
3. Based on `gender` and `side` props, appropriate asset array is selected
4. Each body part in assets is rendered as SVG path(s) with computed fill color
5. SVG wrapper (male/female) provides viewBox and optional border outline

**Color Resolution:**

1. Check if part is in `disabledParts` array -> return disabled gray (#EBEBE4)
2. Check colorMap for explicit color from `data` prop -> return that color
3. Fall back to `defaultFill` prop (default: #3f3f3f)

**Click Handling:**

1. User clicks/taps on SVG path element
2. If part is disabled, no handler is attached -> click ignored
3. If enabled, `onClick(slug, event)` callback is invoked
4. Consumer handles state update (e.g., toggling highlight)

**State Management:**
- The component is stateless - all state lives in the consumer
- Color state managed via `useMemo` for performance (colorMap)
- No internal state for selection, highlighting, etc.

## Key Abstractions

**BodyPartSlug:**
- Purpose: Type-safe identifier for all 44 body parts
- Examples: `"left-biceps"`, `"abs"`, `"right-neck"`
- Pattern: Union type of string literals

**BodyPartAsset:**
- Purpose: Connects a slug to its SVG path data
- Examples: `src/assets/bodyFront.ts` entries
- Pattern: Object with `slug: BodyPartSlug` and `pathData: string[]`

**SvgWrapper:**
- Purpose: Encapsulates gender-specific viewBox and outline SVG
- Examples: `src/components/SvgMaleWrapper.tsx`, `src/components/SvgFemaleWrapper.tsx`
- Pattern: React FC receiving children (body part paths) and view configuration

## Entry Points

**Library Entry (npm package):**
- Location: `src/index.tsx`
- Triggers: `import { Body } from 'react-body-highlighter'`
- Responsibilities: Export Body component and all public types

**Build Entry:**
- Location: `src/index.tsx` (via tsup)
- Triggers: `npm run build`
- Responsibilities: Bundle to ESM and CJS formats in `dist/`

**Demo Entry:**
- Location: `demo/main.tsx`
- Triggers: Vite dev server
- Responsibilities: Render interactive demo application

## Error Handling

**Strategy:** Fail-safe defaults, no runtime errors

**Patterns:**
- Missing `data` prop defaults to empty array
- Unknown slugs in `data` are silently ignored (no matching asset)
- Missing `onClick` prop is safely handled via optional chaining
- Invalid colors pass through to SVG (browser handles)

## Cross-Cutting Concerns

**Logging:** None - library has no logging
**Validation:** None at runtime - TypeScript provides compile-time safety
**Accessibility:** Built into component via ARIA attributes on SVG paths:
  - `role="button"` on interactive paths
  - `aria-label` with human-readable body part name
  - `tabIndex` for keyboard navigation
  - `aria-disabled` for disabled parts
  - Keyboard handlers for Enter/Space activation

---

*Architecture analysis: 2026-01-19*
