# Phase 2: Core Migration - Research

**Researched:** 2026-01-17
**Domain:** React SVG interactivity, TypeScript type exports, component API design
**Confidence:** HIGH

## Summary

Phase 2 transforms the existing Body component API to be simpler, more explicit, and fully typed. The current implementation already uses native SVG elements (completed in Phase 1), so this phase focuses on:

1. **API Simplification** - Remove exercise/intensity concepts, use direct `{ slug, color }` data format
2. **Bilateral Muscle Split** - Convert implicit left/right handling to explicit `left-biceps`, `right-biceps` prefixes
3. **Interactive States** - Add hover states with cursor:pointer, onClick handlers, disabled/hidden parts
4. **TypeScript Exports** - Export all types for consumer use

The codebase already has most functionality in place. This phase is primarily a refactoring and cleanup effort, not a rebuild.

**Primary recommendation:** Keep the existing Body component structure, simplify the data prop to `{ slug: string, color: string }[]`, add explicit left/right slug prefixes to body part assets, remove intensity/exercise references, and export TypeScript types.

## Current State Analysis

### Existing Implementation (from Phase 1)

The codebase already has:
- Native SVG rendering with `<svg>`, `<g>`, `<path>` elements
- `onClick` handlers on paths (converted from `onPress`)
- `cursor: pointer` styling on interactive paths
- Male/female body variants (front/back views)
- Per-part color support via `color` prop
- Left/right path separation in assets (via `path.left[]` and `path.right[]`)
- `disabledParts` and `hiddenParts` props
- `role="img"` and `aria-label` for accessibility

### What Needs to Change

| Current | Target | Change Type |
|---------|--------|-------------|
| `data: ExtendedBodyPart[]` | `data: { slug: string, color: string }[]` | Simplify |
| `intensity` prop on data items | Remove | Delete |
| `onBodyPartPress` callback | `onClick` callback | Rename |
| `colors` array for intensity | Remove | Delete |
| Implicit left/right via `side` prop | Explicit `left-biceps`, `right-biceps` slugs | Refactor |
| `Slug` type (25 values) | `BodyPartSlug` type (expanded with L/R) | Expand |
| Types not exported | All types exported | Add exports |

### Files Requiring Changes

| File | Changes |
|------|---------|
| `src/index.tsx` | Simplify props, rename callback, remove intensity logic |
| `src/assets/bodyFront.ts` | Split slugs to `left-*`, `right-*` format |
| `src/assets/bodyBack.ts` | Same as above |
| `src/assets/bodyFemaleFront.ts` | Same as above |
| `src/assets/bodyFemaleBack.ts` | Same as above |

## Standard Stack

### Core (No new dependencies needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^18.0.0 \|\| ^19.0.0 | Peer dependency | Already configured |
| typescript | ^5.6+ | Type checking | Already configured |
| tsup | ^8.4.0 | Bundler | Already configured, handles type exports |

### Testing
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | ^16.x | Component testing | Already available, migrate from RN testing |
| jest | ^29.x | Test runner | Already in devDependencies |
| jest-environment-jsdom | ^30.x | DOM environment | Already in devDependencies |

**No new installations required** - Phase 1 already set up all necessary dependencies.

## Architecture Patterns

### Pattern 1: Simplified Data Prop

**What:** Replace complex `ExtendedBodyPart` with simple `{ slug, color }` objects
**When to use:** All data passed to the Body component

**Before (current):**
```typescript
interface ExtendedBodyPart {
  color?: string;
  intensity?: number;
  side?: "left" | "right";
  styles?: BodyPartStyles;
  slug?: Slug;
  path?: { common?: string[]; left?: string[]; right?: string[] };
}

// Usage
<Body data={[
  { slug: "biceps", intensity: 2, side: "left" },
  { slug: "biceps", color: "#ff0000", side: "right" }
]} />
```

**After (target):**
```typescript
interface BodyPartData {
  slug: BodyPartSlug;
  color: string;
}

// Usage
<Body data={[
  { slug: "left-biceps", color: "#ff0000" },
  { slug: "right-biceps", color: "#00ff00" }
]} />
```

### Pattern 2: Explicit Bilateral Slug Prefixes

**What:** Body parts that have left/right variants get explicit slug prefixes
**When to use:** All bilateral muscles

**Current slugs (25 total):**
```
abs, adductors, ankles, biceps, calves, chest, deltoids, feet, forearm,
gluteal, hamstring, hands, hair, head, knees, lower-back, neck, obliques,
quadriceps, tibialis, trapezius, triceps, upper-back
```

**Target slugs (expanded with L/R):**
```
// Bilateral muscles (need left/right variants)
left-adductors, right-adductors
left-ankles, right-ankles
left-biceps, right-biceps
left-calves, right-calves
left-deltoids, right-deltoids
left-feet, right-feet
left-forearm, right-forearm
left-gluteal, right-gluteal
left-hamstring, right-hamstring
left-hands, right-hands
left-knees, right-knees
left-obliques, right-obliques
left-quadriceps, right-quadriceps
left-tibialis, right-tibialis
left-trapezius, right-trapezius
left-triceps, right-triceps

// Centerline muscles (no left/right)
abs, chest, head, hair, neck, lower-back, upper-back
```

### Pattern 3: TypeScript Event Typing for SVG

**What:** Properly typed onClick handlers for SVG path elements
**When to use:** All interactive body part paths

```typescript
// Source: React TypeScript Cheatsheet
interface ModelProps {
  data: BodyPartData[];
  onClick?: (slug: BodyPartSlug, event: React.MouseEvent<SVGPathElement>) => void;
  gender?: "male" | "female";
  side?: "front" | "back";
}

// In the path element
<path
  d={pathData}
  fill={color}
  onClick={(e: React.MouseEvent<SVGPathElement>) => {
    if (!isDisabled) onClick?.(slug, e);
  }}
  style={{ cursor: isDisabled ? 'default' : 'pointer' }}
/>
```

### Pattern 4: Type Exports from Entry Point

**What:** Export all public types from the main entry point
**When to use:** Always for library packages

```typescript
// src/index.tsx

// Types
export type { BodyPartSlug } from './types';
export type { BodyPartData, ModelProps } from './types';

// Components
export { Model } from './components/Model';
export { Body } from './components/Body'; // Alias for backward compat
```

### Anti-Patterns to Avoid

- **Implicit left/right via side prop:** Confusing API, hard to highlight one side only
- **Intensity-based colors:** Adds complexity, colors array, harder to understand
- **styles.fill alongside color:** Redundant, pick one (color is simpler)
- **Optional slug in data:** Should be required, type should enforce

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Type exports | Manual .d.ts | tsup `dts: true` | Already configured, auto-generates |
| SVG event types | Custom types | `React.MouseEvent<SVGPathElement>` | Built into React types |
| Union types | String arrays | TypeScript literal unions | Better autocomplete, compile-time checks |
| Disabled state logic | Complex conditionals | CSS pointer-events + aria-disabled | Standard accessibility pattern |

## Common Pitfalls

### Pitfall 1: Slug Case Sensitivity
**What goes wrong:** `"Left-Biceps"` doesn't match `"left-biceps"`, part doesn't highlight
**Why it happens:** Inconsistent casing in consumer code vs type definition
**How to avoid:** Use lowercase-kebab-case for all slugs, document clearly
**Warning signs:** "Works sometimes" - some parts highlight, others don't

### Pitfall 2: Forgetting Common Paths
**What goes wrong:** Centerline muscles (abs, chest) have no left/right and use `path.common`
**Why it happens:** Assumed all parts have left/right structure
**How to avoid:** Check for `path.common` array, not just `path.left`/`path.right`
**Warning signs:** Abs, chest, head not rendering

### Pitfall 3: Event Target vs CurrentTarget
**What goes wrong:** Wrong slug reported in onClick callback
**Why it happens:** Using `e.target` instead of `e.currentTarget` in nested SVG
**How to avoid:** Always use `e.currentTarget` for the element with the handler
**Warning signs:** Click on biceps reports different slug

### Pitfall 4: Missing Type Re-exports
**What goes wrong:** Consumers get "Cannot find type 'BodyPartSlug'" errors
**Why it happens:** Types defined but not exported from entry point
**How to avoid:** Explicit `export type { ... }` in index.tsx
**Warning signs:** TypeScript errors only when consuming package

### Pitfall 5: Hover on Disabled Parts
**What goes wrong:** Cursor shows pointer on disabled parts
**Why it happens:** Forgot to check disabled state in style
**How to avoid:** `style={{ cursor: isDisabled ? 'default' : 'pointer' }}`
**Warning signs:** Visual feedback suggests clickability for non-clickable parts

## Code Examples

### Simplified Body Component Props

```typescript
// src/types.ts

/** All valid body part slugs including left/right variants */
export type BodyPartSlug =
  // Bilateral muscles (left/right)
  | "left-adductors" | "right-adductors"
  | "left-ankles" | "right-ankles"
  | "left-biceps" | "right-biceps"
  | "left-calves" | "right-calves"
  | "left-deltoids" | "right-deltoids"
  | "left-feet" | "right-feet"
  | "left-forearm" | "right-forearm"
  | "left-gluteal" | "right-gluteal"
  | "left-hamstring" | "right-hamstring"
  | "left-hands" | "right-hands"
  | "left-knees" | "right-knees"
  | "left-obliques" | "right-obliques"
  | "left-quadriceps" | "right-quadriceps"
  | "left-tibialis" | "right-tibialis"
  | "left-trapezius" | "right-trapezius"
  | "left-triceps" | "right-triceps"
  // Centerline muscles (no left/right)
  | "abs"
  | "chest"
  | "head"
  | "hair"
  | "neck"
  | "lower-back"
  | "upper-back";

/** Data for highlighting a body part */
export interface BodyPartData {
  /** The body part to highlight */
  slug: BodyPartSlug;
  /** The fill color (hex, rgb, or named color) */
  color: string;
}

/** Props for the Model component */
export interface ModelProps {
  /** Array of body parts to highlight with colors */
  data: BodyPartData[];
  /** Callback when a body part is clicked */
  onClick?: (slug: BodyPartSlug, event: React.MouseEvent<SVGPathElement>) => void;
  /** Gender variant to display */
  gender?: "male" | "female";
  /** Which side of the body to show */
  side?: "front" | "back";
  /** Scale factor for the SVG */
  scale?: number;
  /** Color for the body outline, or "none" to hide */
  border?: string | "none";
  /** Body parts that should appear disabled (grayed out, non-interactive) */
  disabledParts?: BodyPartSlug[];
  /** Body parts that should be hidden completely */
  hiddenParts?: BodyPartSlug[];
  /** Default fill color for non-highlighted parts */
  defaultFill?: string;
}
```

### Updated Asset Structure

```typescript
// src/assets/bodyFront.ts

import { BodyPartSlug } from '../types';

export interface BodyPartAsset {
  slug: BodyPartSlug;
  pathData: string[];
}

export const bodyFrontAssets: BodyPartAsset[] = [
  // Bilateral - left side
  {
    slug: "left-biceps",
    pathData: [
      "M189.52 492.51c-2.43.62-7.38.57-7.51-3.08..."
    ]
  },
  {
    slug: "right-biceps",
    pathData: [
      "M526.69 486.31c-9.9-8.61-17.75-33.21-20.65-47.73..."
    ]
  },
  // Centerline
  {
    slug: "abs",
    pathData: [
      "M311.02 531.71a.23.23 0 01-.19-.21...",
      "M321 577.76c-5.17-.33-8.71-.44-10-6.26..."
    ]
  },
  // ... etc
];
```

### Path Rendering with Disabled/Hover States

```typescript
// Inside Body component render

const renderPath = (slug: BodyPartSlug, pathData: string, index: number) => {
  const isDisabled = disabledParts?.includes(slug);
  const isHidden = hiddenParts?.includes(slug);
  const highlightData = data.find(d => d.slug === slug);
  const fillColor = isDisabled
    ? "#EBEBE4"
    : highlightData?.color ?? defaultFill;

  if (isHidden) return null;

  return (
    <path
      key={`${slug}-${index}`}
      d={pathData}
      fill={fillColor}
      onClick={isDisabled ? undefined : (e) => onClick?.(slug, e)}
      style={{ cursor: isDisabled ? 'default' : 'pointer' }}
      aria-disabled={isDisabled}
      data-testid={slug}
    />
  );
};
```

### Test Migration Example

```typescript
// __tests__/Body.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Body } from '../src';
import type { BodyPartSlug } from '../src';

describe('Body Component', () => {
  it('renders without crashing', () => {
    render(<Body data={[]} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('highlights body parts with specified colors', () => {
    render(<Body data={[{ slug: 'left-biceps', color: '#ff0000' }]} />);
    const path = screen.getByTestId('left-biceps');
    expect(path).toHaveAttribute('fill', '#ff0000');
  });

  it('calls onClick with correct slug when body part clicked', () => {
    const handleClick = jest.fn();
    render(<Body data={[]} onClick={handleClick} />);

    const path = screen.getByTestId('left-biceps');
    fireEvent.click(path);

    expect(handleClick).toHaveBeenCalledWith(
      'left-biceps',
      expect.any(Object) // MouseEvent
    );
  });

  it('shows cursor: pointer on interactive parts', () => {
    render(<Body data={[]} />);
    const path = screen.getByTestId('left-biceps');
    expect(path).toHaveStyle({ cursor: 'pointer' });
  });

  it('shows cursor: default on disabled parts', () => {
    render(<Body data={[]} disabledParts={['left-biceps']} />);
    const path = screen.getByTestId('left-biceps');
    expect(path).toHaveStyle({ cursor: 'default' });
    expect(path).toHaveAttribute('aria-disabled', 'true');
  });

  it('hides hidden parts', () => {
    render(<Body data={[]} hiddenParts={['left-biceps']} />);
    expect(screen.queryByTestId('left-biceps')).not.toBeInTheDocument();
  });
});
```

### Entry Point with Type Exports

```typescript
// src/index.tsx

// Export types
export type {
  BodyPartSlug,
  BodyPartData,
  ModelProps
} from './types';

// Export component
export { Body } from './Body';

// Alias for backward compatibility during transition
export { Body as Model } from './Body';

// Default export
export default Body;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `onPress` (RN) | `onClick` (web) | Phase 1 | Already done |
| Intensity colors | Direct color prop | This phase | Simpler API |
| Implicit L/R via side | Explicit `left-*` slugs | This phase | More control |
| No type exports | Full type exports | This phase | Better DX |

**Deprecated after this phase:**
- `intensity` prop on data items
- `colors` array prop
- `side` prop on data items (for L/R selection)
- `styles.fill` (use `color` instead)
- `onBodyPartPress` (use `onClick`)

## Open Questions

1. **Backward Compatibility Period**
   - What we know: v4.0.0 is a breaking change, but some consumers may need migration path
   - What's unclear: Should old props be deprecated-but-working, or removed entirely?
   - Recommendation: Remove entirely in v4.0.0, document migration in CHANGELOG

2. **Neck Slug Treatment**
   - What we know: Current assets have neck with both `common` and `left`/`right` paths
   - What's unclear: Whether neck should be `neck` or `left-neck`/`right-neck`
   - Recommendation: Keep as single `neck` slug, it's typically treated as centerline

3. **Hair and Head**
   - What we know: These are purely visual, rarely interactive
   - What's unclear: Whether they should be in the BodyPartSlug type at all
   - Recommendation: Include them, let consumers decide if they want to use them

## Mapping: Current to New Slugs

For the planner - this is the exact mapping needed for asset refactoring:

| Current Slug | Current Structure | New Slug(s) |
|--------------|-------------------|-------------|
| abs | common, left, right | abs (keep as-is, use all paths) |
| adductors | left, right | left-adductors, right-adductors |
| ankles | left, right | left-ankles, right-ankles |
| biceps | left, right | left-biceps, right-biceps |
| calves | left, right | left-calves, right-calves |
| chest | left, right | chest (centerline, combine paths) |
| deltoids | left, right | left-deltoids, right-deltoids |
| feet | left, right | left-feet, right-feet |
| forearm | left, right | left-forearm, right-forearm |
| gluteal | left, right | left-gluteal, right-gluteal |
| hair | common | hair |
| hamstring | left, right | left-hamstring, right-hamstring |
| hands | left, right | left-hands, right-hands |
| head | common | head |
| knees | left, right | left-knees, right-knees |
| lower-back | left, right | lower-back (combine to centerline) |
| neck | common, left, right | neck, left-neck, right-neck |
| obliques | left, right | left-obliques, right-obliques |
| quadriceps | left, right | left-quadriceps, right-quadriceps |
| tibialis | left, right | left-tibialis, right-tibialis |
| trapezius | left, right | left-trapezius, right-trapezius |
| triceps | left, right | left-triceps, right-triceps |
| upper-back | left, right | upper-back (combine to centerline) |

## Sources

### Primary (HIGH confidence)
- [React TypeScript Cheatsheet - Component Props](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/) - Type export patterns
- [MDN - SVG pointer-events](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pointer-events) - SVG interactivity
- [MDN - SVG cursor attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/cursor) - Cursor styling

### Secondary (MEDIUM confidence)
- [LogRocket - Using SVGs in React](https://blog.logrocket.com/how-to-use-svgs-react/) - SVG event handling patterns
- [React Aria - useHover](https://react-spectrum.adobe.com/react-aria/useHover.html) - Hover state best practices
- [SitePoint - React with TypeScript Best Practices](https://www.sitepoint.com/react-with-typescript-best-practices/) - Interface vs Type guidance

### Tertiary (LOW confidence)
- Community patterns for body highlighter components (general guidance only)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies, using existing setup
- Architecture: HIGH - Clear refactoring path, existing code provides template
- Pitfalls: HIGH - Common SVG/React issues well-documented
- Slug mapping: HIGH - Derived directly from current asset files

**Research date:** 2026-01-17
**Valid until:** 2026-04-17 (90 days - stable patterns)
