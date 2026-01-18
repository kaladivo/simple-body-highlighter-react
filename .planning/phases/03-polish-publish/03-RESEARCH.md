# Phase 3: Polish + Publish - Research

**Researched:** 2026-01-18
**Domain:** SVG Accessibility, README Documentation, npm Publishing
**Confidence:** HIGH

## Summary

This phase focuses on accessibility improvements, documentation updates, and publication preparation for `react-body-highlighter` v4.0.0. The component already has good foundational accessibility (`role="img"`, `aria-label` on SVG containers) but needs individual body part accessibility for interactive elements. The README needs complete rewriting for the new web-only API with visual-first structure per user decisions.

The primary challenge is making 44 interactive SVG paths accessible while maintaining clean code. The solution involves adding `aria-label`, `tabindex`, and keyboard handlers to each path element. Documentation follows established React library patterns with live demo links and TypeScript examples.

**Primary recommendation:** Add accessibility attributes to the `<path>` elements in `src/index.tsx` (not the wrapper components), create a new BODY_PARTS.md slug reference, and rewrite README with new API examples and visual-first structure.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18/19 | Component library | Already peer dependency |
| TypeScript | 5.6+ | Type safety | Already in use |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | 16.3+ | Accessibility testing | Already in use, verify a11y |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| aria-label | aria-labelledby + title | More verbose, requires id management |
| tabindex on paths | wrapping in button | Breaks SVG structure, overkill |

**Installation:**
No new dependencies required. All accessibility is achievable with native HTML/SVG attributes.

## Architecture Patterns

### Current Component Structure
```
src/
├── index.tsx              # Body component with path rendering
├── types.ts               # BodyPartSlug, BodyPartData, ModelProps
├── components/
│   ├── SvgMaleWrapper.tsx   # Male SVG container with role="img"
│   └── SvgFemaleWrapper.tsx # Female SVG container with role="img"
└── assets/
    ├── bodyFront.ts        # Front male body paths
    ├── bodyBack.ts         # Back male body paths
    ├── bodyFemaleFront.ts  # Front female body paths
    └── bodyFemaleBack.ts   # Back female body paths
```

### Pattern 1: Interactive SVG Path Accessibility
**What:** Add accessibility attributes directly to clickable `<path>` elements
**When to use:** When SVG paths are interactive (have onClick handlers)
**Example:**
```typescript
// Source: MDN ARIA button role docs, A11Y Collective SVG guide
<path
  key={`${part.slug}-${index}`}
  d={pathD}
  fill={fillColor}
  onClick={isDisabled ? undefined : (e) => onClick?.(part.slug, e)}
  onKeyDown={isDisabled ? undefined : (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(part.slug, e as unknown as React.MouseEvent<SVGPathElement>);
    }
  }}
  tabIndex={isDisabled ? -1 : 0}
  role="button"
  aria-label={formatSlugForAriaLabel(part.slug)} // "left biceps"
  aria-disabled={isDisabled || undefined}
  style={{ cursor: isDisabled ? 'default' : 'pointer' }}
  data-testid={part.slug}
/>
```

### Pattern 2: Slug to Human-Readable Label
**What:** Convert kebab-case slugs to readable labels for screen readers
**When to use:** For aria-label values
**Example:**
```typescript
// Source: Common accessibility pattern
function formatSlugForAriaLabel(slug: BodyPartSlug): string {
  return slug.replace(/-/g, ' '); // "left-biceps" -> "left biceps"
}
```

### Anti-Patterns to Avoid
- **Adding tabindex to SVG container:** The container already has role="img", making individual paths focusable is correct
- **Using role="button" on SVG container:** Wrong scope, role belongs on individual interactive elements
- **Skipping keyboard handlers:** `role="button"` requires both Space and Enter key support
- **Using onClick alone for paths:** Screen reader users need keyboard activation

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slug formatting | Complex regex | Simple replace('-', ' ') | Kebab-case is consistent |
| Focus styles | Custom focus ring | Browser default + CSS outline | Accessibility compliance |
| Keyboard handling | Custom key detection | Standard e.key checks | Cross-browser consistent |

**Key insight:** SVG accessibility is achievable with standard HTML attributes. No library needed.

## Common Pitfalls

### Pitfall 1: Missing Keyboard Event Handlers
**What goes wrong:** Adding `role="button"` without keyboard handlers makes elements appear interactive but not operable
**Why it happens:** Developers assume role="button" adds functionality (it doesn't)
**How to avoid:** Always pair role="button" with tabindex, onKeyDown for Space/Enter
**Warning signs:** Screen reader announces "button" but Enter/Space does nothing

### Pitfall 2: Forgetting preventDefault on Space Key
**What goes wrong:** Page scrolls when pressing Space on focused path
**Why it happens:** Space key defaults to page scroll in browsers
**How to avoid:** Call `e.preventDefault()` before handling Space key
**Warning signs:** Page jumps when activating path with Space

### Pitfall 3: Conflicting TypeScript Event Types
**What goes wrong:** `onKeyDown` provides KeyboardEvent but onClick expects MouseEvent
**Why it happens:** onClick signature is `(slug, React.MouseEvent<SVGPathElement>)`
**How to avoid:** Cast or create synthetic event, or make onClick signature more flexible
**Warning signs:** TypeScript errors when passing keyboard event to onClick

### Pitfall 4: README Examples Not Matching Actual API
**What goes wrong:** Old React Native examples still in README
**Why it happens:** Copy-paste from previous version
**How to avoid:** Test all code examples before publishing
**Warning signs:** Examples show `onBodyPartPress`, `intensity`, React Native imports

### Pitfall 5: Broken npm Package Links After Rename
**What goes wrong:** Old npm badges/links point to `react-native-body-highlighter`
**Why it happens:** Package renamed to `react-body-highlighter`
**How to avoid:** Update all badge URLs and npm install commands
**Warning signs:** Badges show wrong package, links 404

## Code Examples

Verified patterns from official sources:

### Accessible Interactive SVG Path
```typescript
// Source: MDN ARIA button role, A11Y Collective SVG accessibility
// Full implementation for Body component path rendering

const handleKeyDown = (
  slug: BodyPartSlug,
  e: React.KeyboardEvent<SVGPathElement>
) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    // Cast to MouseEvent type for onClick signature compatibility
    onClick?.(slug, e as unknown as React.MouseEvent<SVGPathElement>);
  }
};

// In render:
<path
  key={`${part.slug}-${index}`}
  d={pathD}
  fill={fillColor}
  onClick={isDisabled ? undefined : (e) => onClick?.(part.slug, e)}
  onKeyDown={isDisabled ? undefined : (e) => handleKeyDown(part.slug, e)}
  tabIndex={isDisabled ? -1 : 0}
  role="button"
  aria-label={part.slug.replace(/-/g, ' ')}
  aria-disabled={isDisabled || undefined}
  style={{ cursor: isDisabled ? 'default' : 'pointer' }}
  data-testid={part.slug}
/>
```

### Focus Visible Styles (Optional CSS)
```css
/* Source: Web accessibility best practices */
/* Can be added to README as optional enhancement */
svg path:focus {
  outline: 2px solid #4A90D9;
  outline-offset: 2px;
}

svg path:focus:not(:focus-visible) {
  outline: none;
}
```

### README Structure Template
```markdown
# react-body-highlighter

[Visual: Screenshot or demo GIF here]

[Live Demo](link-to-stackblitz-or-codesandbox)

> SVG body part highlighter for React web applications.

## Installation

\`\`\`bash
npm install react-body-highlighter
\`\`\`

## Quick Start

\`\`\`tsx
import { Body } from 'react-body-highlighter';

function App() {
  return (
    <Body
      data={[
        { slug: 'left-biceps', color: '#ff6b6b' },
        { slug: 'right-biceps', color: '#ff6b6b' },
      ]}
      onClick={(slug) => console.log(`Clicked: ${slug}`)}
    />
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | BodyPartData[] | [] | Body parts to highlight |
| onClick | (slug, event) => void | - | Click handler |
| gender | 'male' \| 'female' | 'male' | Body model |
| side | 'front' \| 'back' | 'front' | View side |
| scale | number | 1 | Scale factor |
| border | string \| 'none' | '#dfdfdf' | Outline color |
| disabledParts | BodyPartSlug[] | [] | Disabled slugs |
| hiddenParts | BodyPartSlug[] | [] | Hidden slugs |
| defaultFill | string | '#3f3f3f' | Default color |

## Body Part Slugs

See [BODY_PARTS.md](./BODY_PARTS.md) for the complete list of 44 available slugs.

## TypeScript

\`\`\`tsx
import type { BodyPartSlug, BodyPartData, ModelProps } from 'react-body-highlighter';
\`\`\`

## v4.0.0 Breaking Changes

This version is a web-only rewrite. If you're using React Native, continue using v3.x.
```

### BODY_PARTS.md Structure
```markdown
# Body Part Slugs

Complete alphabetical list of all 44 body part slugs available in react-body-highlighter.

## All Slugs

- abs
- hair
- head
- left-adductors
- left-ankles
- left-biceps
- left-calves
- left-chest
- left-deltoids
- left-feet
- left-forearm
- left-gluteal
- left-hamstring
- left-hands
- left-knees
- left-lower-back
- left-neck
- left-obliques
- left-quadriceps
- left-tibialis
- left-trapezius
- left-triceps
- left-upper-back
- neck
- right-adductors
- right-ankles
- right-biceps
- right-calves
- right-chest
- right-deltoids
- right-feet
- right-forearm
- right-gluteal
- right-hamstring
- right-hands
- right-knees
- right-lower-back
- right-neck
- right-obliques
- right-quadriceps
- right-tibialis
- right-trapezius
- right-triceps
- right-upper-back
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Native SVG | Web SVG (native) | v4.0.0 | No RN dependency |
| intensity colors | explicit color prop | v4.0.0 | Simpler, more flexible |
| onBodyPartPress | onClick | v4.0.0 | Standard React pattern |
| side on data items | left-/right- prefixes | v4.0.0 | Cleaner API |

**Deprecated/outdated:**
- `react-native-body-highlighter` package name: replaced by `react-body-highlighter`
- `ExtendedBodyPart` type: replaced by `BodyPartData`
- `intensity` property: replaced by direct `color` property
- `onBodyPartPress` callback: replaced by standard `onClick`

## Open Questions

Things that couldn't be fully resolved:

1. **Focus visible styling for SVG paths**
   - What we know: CSS `:focus-visible` works on SVG paths in modern browsers
   - What's unclear: Exact browser support for focus styles on SVG paths
   - Recommendation: Add basic focus outline via inline style or document CSS in README

2. **Live demo hosting choice**
   - What we know: StackBlitz and CodeSandbox both support React
   - What's unclear: User preference for which service
   - Recommendation: Use StackBlitz (per user discretion in CONTEXT.md)

## Sources

### Primary (HIGH confidence)
- MDN ARIA button role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/button_role
- MDN aria-label: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
- Codebase analysis: `src/index.tsx`, `src/types.ts`, `src/components/*.tsx`

### Secondary (MEDIUM confidence)
- A11Y Collective SVG accessibility: https://www.a11y-collective.com/blog/svg-accessibility/
- TPGi ARIA SVG enhancement: https://www.tpgi.com/using-aria-enhance-svg-accessibility/
- CSS-Tricks Accessible SVGs: https://css-tricks.com/accessible-svgs/

### Tertiary (LOW confidence)
- React library README patterns (general web search, no single authoritative source)

## Metadata

**Confidence breakdown:**
- SVG accessibility: HIGH - MDN documentation is authoritative
- README structure: MEDIUM - Based on common patterns, user decisions clear
- Slug formatting: HIGH - Types already defined in codebase

**Research date:** 2026-01-18
**Valid until:** 2026-02-18 (30 days - stable domain)

## Implementation Notes for Planner

### Files to Modify
1. `src/index.tsx` - Add accessibility attributes to path elements
2. `README.md` - Complete rewrite with new API
3. Create `BODY_PARTS.md` - Alphabetical slug list

### Testing Considerations
1. Existing tests verify `aria-disabled` on disabled parts
2. Need new tests for:
   - `role="button"` on paths
   - `aria-label` content
   - `tabindex` values
   - Keyboard event handling (Enter/Space)

### Current Accessibility State
- SVG containers have `role="img"` and `aria-label` (e.g., "male-body-front")
- Paths have `aria-disabled` when disabled
- Missing: individual path labels, keyboard handling, button role

### Demo Available
- Local demo at `demo/main.tsx` can be used for screenshots
- Run with Vite: existing setup supports `vite` command
