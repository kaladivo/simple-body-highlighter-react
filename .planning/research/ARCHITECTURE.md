# Architecture Research: React SVG Component Libraries

**Domain:** Interactive SVG body highlighting component
**Researched:** 2026-01-17
**Confidence:** HIGH (based on existing codebase analysis + verified patterns)

## Executive Summary

The existing react-native-body-highlighter has a solid component architecture that maps cleanly to browser React. The main changes involve replacing `react-native-svg` primitives with native SVG elements and converting `onPress` handlers to `onClick`. The core component hierarchy (Body -> SvgWrapper -> Path elements) can remain largely unchanged.

## Current Architecture Analysis

### Existing Structure
```
index.tsx           <- Main Body component (orchestrates rendering)
components/
  SvgMaleWrapper.tsx    <- SVG container with border/outline
  SvgFemaleWrapper.tsx  <- SVG container with border/outline
assets/
  bodyFront.ts          <- SVG path data (male front)
  bodyBack.ts           <- SVG path data (male back)
  bodyFemaleFront.ts    <- SVG path data (female front)
  bodyFemaleBack.ts     <- SVG path data (female back)
utils/
  differenceWith.ts     <- Utility function
```

### Current Data Flow
```
User Data (props.data)
       |
       v
  Body Component
       |
  +----+----+
  |         |
  v         v
mergedBodyParts()    renderBodySvg()
       |                   |
       v                   v
  Path data +        SvgWrapper
  User styles              |
       |                   v
       +-------> <Path> elements with onClick
```

## Recommended Architecture for Browser React

### Component Hierarchy

```
src/
  index.ts                 <- Public API exports
  Body.tsx                 <- Main component (orchestration)
  types.ts                 <- TypeScript interfaces
  components/
    SvgContainer.tsx       <- Generic SVG wrapper (replaces wrappers)
    BodyPath.tsx           <- Individual path with interaction
    BodyOutline.tsx        <- Border/outline paths
  assets/
    bodyFront.ts           <- Path data (unchanged)
    bodyBack.ts            <- Path data (unchanged)
    bodyFemaleFront.ts     <- Path data (unchanged)
    bodyFemaleBack.ts      <- Path data (unchanged)
  hooks/
    useBodyPartStyles.ts   <- Style calculation logic
  utils/
    differenceWith.ts      <- Utility (unchanged)
```

### Component Boundaries

| Component | Responsibility | Inputs | Outputs |
|-----------|---------------|--------|---------|
| **Body** | Orchestration, prop validation, data merging | All public props | Rendered SVG |
| **SvgContainer** | SVG element setup, viewBox, dimensions, accessibility | side, scale, gender, children | `<svg>` wrapper |
| **BodyPath** | Individual body part rendering, click handling | bodyPart, onClick, styles | `<path>` element |
| **BodyOutline** | Static border/outline rendering | side, gender, color | `<path>` element |

### Key Architectural Decisions

#### 1. Unified SvgContainer (Recommended)

**Current:** Separate `SvgMaleWrapper` and `SvgFemaleWrapper` with duplicated logic.

**Recommended:** Single `SvgContainer` component with gender-specific viewBox mapping:

```typescript
// SvgContainer.tsx
interface SvgContainerProps {
  children: React.ReactNode;
  scale: number;
  side: 'front' | 'back';
  gender: 'male' | 'female';
  border: string | 'none';
}

const VIEWBOX_MAP = {
  male: {
    front: '0 0 724 1448',
    back: '724 0 724 1448',
  },
  female: {
    front: '-50 -40 734 1538',
    back: '756 0 774 1448',
  },
};
```

**Rationale:** Eliminates code duplication, centralizes SVG configuration, easier maintenance.

#### 2. Extracted BodyPath Component (Recommended)

**Current:** Path rendering logic embedded in Body component with repeated code for common/left/right paths.

**Recommended:** Extract to dedicated `BodyPath` component:

```typescript
// BodyPath.tsx
interface BodyPathProps {
  d: string;
  id: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<SVGPathElement>) => void;
}
```

**Rationale:**
- Single responsibility for path rendering
- Cleaner click handler management
- Easier to add hover states, animations later
- Better testing surface

#### 3. Type Definitions Separate File

**Current:** Types defined inline in main component file.

**Recommended:** Dedicated `types.ts` for all public types:

```typescript
// types.ts
export type Slug = 'abs' | 'biceps' | 'chest' | /* ... */;

export interface BodyPartStyles {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface ExtendedBodyPart {
  color?: string;
  slug?: Slug;
  intensity?: number;
  side?: 'left' | 'right';
  styles?: BodyPartStyles;
}

export interface BodyProps {
  colors?: ReadonlyArray<string>;
  data: ReadonlyArray<ExtendedBodyPart>;
  scale?: number;
  side?: 'front' | 'back';
  gender?: 'male' | 'female';
  onBodyPartPress?: (bodyPart: ExtendedBodyPart, side?: 'left' | 'right') => void;
  border?: string | 'none';
  disabledParts?: Slug[];
  hiddenParts?: Slug[];
  defaultFill?: string;
  defaultStroke?: string;
  defaultStrokeWidth?: number;
}
```

**Rationale:** Better IDE support, easier imports for consumers, cleaner component files.

## Data Flow (Browser Version)

```
props.data (body parts to highlight)
    |
    v
Body Component
    |
    +-- mergedBodyParts() -- Merge user data with asset path data
    |         |
    |         v
    |   ExtendedBodyPart[] (path + user styles merged)
    |
    +-- SvgContainer
            |
            +-- BodyOutline (if border !== 'none')
            |
            +-- BodyPath[] (mapped from merged body parts)
                    |
                    +-- onClick -> onBodyPartPress callback
```

## SVG-Specific Patterns for Browser

### Event Handling Migration

| react-native-svg | Browser SVG | Notes |
|------------------|-------------|-------|
| `onPress` | `onClick` | Direct replacement |
| `onPressIn` | `onMouseDown` / `onPointerDown` | For touch/mouse start |
| `onPressOut` | `onMouseUp` / `onPointerUp` | For touch/mouse end |

### SVG Element Mapping

| react-native-svg | Browser JSX | Notes |
|------------------|-------------|-------|
| `<Svg>` | `<svg>` | Lowercase for native elements |
| `<Path>` | `<path>` | Lowercase for native elements |
| `<G>` | `<g>` | Lowercase for native elements |
| `viewBox` prop | `viewBox` attribute | Same syntax |
| `accessible`, `accessibilityLabel` | `aria-label`, `role="img"` | Accessibility mapping |

### Accessibility Considerations

```tsx
// Browser-native accessibility
<svg
  viewBox={viewBox}
  width={200 * scale}
  height={400 * scale}
  role="img"
  aria-label={`${gender} body ${side} view`}
>
  {/* paths */}
</svg>

// Interactive paths
<path
  d={pathData}
  onClick={handleClick}
  role="button"
  tabIndex={0}
  aria-label={`${bodyPart.slug} muscle`}
  onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
  style={{ cursor: disabled ? 'default' : 'pointer' }}
/>
```

### CSS Considerations

Browser SVG allows direct CSS styling:

```css
/* Can use CSS classes instead of inline styles */
.body-path {
  transition: fill 0.2s ease;
  cursor: pointer;
}

.body-path:hover {
  opacity: 0.8;
}

.body-path:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.body-path--disabled {
  cursor: not-allowed;
  pointer-events: none;
}
```

## Build Order (Dependency-Driven)

### Phase 1: Foundation (No Dependencies)
1. **types.ts** - Type definitions (no dependencies)
2. **assets/*.ts** - Path data files (can be copied unchanged)
3. **utils/differenceWith.ts** - Utility (can be copied unchanged)

### Phase 2: Core Components (Depends on Phase 1)
4. **SvgContainer.tsx** - Depends on: types
5. **BodyOutline.tsx** - Depends on: types (outline path data embedded or imported)
6. **BodyPath.tsx** - Depends on: types

### Phase 3: Main Component (Depends on Phase 2)
7. **Body.tsx** - Depends on: all above components + assets + utils

### Phase 4: Public API (Depends on Phase 3)
8. **index.ts** - Re-exports Body component and all types

### Rationale for Build Order

```
types.ts ─────────────────────────────────┐
                                          │
assets/*.ts ─────────────────────────────>│
                                          │
utils/differenceWith.ts ─────────────────>├──> Body.tsx ──> index.ts
                                          │
SvgContainer.tsx ──> BodyOutline.tsx ────>│
                                          │
BodyPath.tsx ─────────────────────────────┘
```

- **Types first:** Everything depends on types
- **Assets unchanged:** Path data doesn't need modification
- **Utils unchanged:** Pure functions work in any environment
- **Container before parts:** BodyOutline and BodyPath render inside SvgContainer
- **Body last:** Orchestrates all other components
- **Index last:** Just re-exports

## Anti-Patterns to Avoid

### 1. Prop Drilling Through Many Layers
**Problem:** Passing callbacks through SvgContainer to BodyPath creates coupling.
**Solution:** Keep Body component responsible for click handlers; map over paths at Body level.

### 2. Inline Event Handler Creation
**Problem:** Creating new function on every render causes unnecessary re-renders.
**Solution:** Use `useCallback` for event handlers that depend on props.

### 3. Direct DOM Manipulation
**Problem:** Using refs to modify SVG attributes directly.
**Solution:** Use React state and props; let React handle DOM updates.

### 4. Massive Single Component
**Problem:** All logic in Body.tsx (current state is borderline).
**Solution:** Extract BodyPath, consolidate wrappers into SvgContainer.

## Performance Considerations

### Memoization Strategy

```tsx
// Memoize expensive calculations
const mergedParts = useMemo(
  () => mergeBodyParts(assetData, userData),
  [assetData, userData]
);

// Memoize callbacks passed to children
const handlePartClick = useCallback(
  (bodyPart: ExtendedBodyPart, side?: 'left' | 'right') => {
    onBodyPartPress?.(bodyPart, side);
  },
  [onBodyPartPress]
);

// Memoize individual path components if list is large
const MemoizedBodyPath = React.memo(BodyPath);
```

### SVG Rendering Performance

- Keep path count reasonable (current ~50 paths is fine)
- Avoid complex filters or effects unless necessary
- Use `will-change: transform` for animated paths

## Sources

- [Using SVGs in React](https://refine.dev/blog/react-svg/) - General SVG integration patterns
- [SVGR](https://react-svgr.com/) - SVG to React component transformation
- [Building SVG Components with React.js](https://pganalyze.com/blog/building-svg-components-in-react) - Interactive SVG patterns
- [react-native-svg GitHub](https://github.com/software-mansion/react-native-svg) - Original library documentation
- [React Folder Structure Best Practices](https://www.robinwieruch.de/react-folder-structure/) - Component organization patterns
- [Declarative Graphics with SVG and React](https://datagraphs.com/blog/graphical-uis-with-svg-and-react-part-1-declarative-graphics) - SVG component architecture
