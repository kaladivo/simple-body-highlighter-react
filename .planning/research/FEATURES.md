# Feature Landscape: Body Highlighter Components

**Domain:** Interactive SVG body/anatomy visualization components
**Researched:** 2026-01-17
**Focus:** Web browser support for existing React Native body highlighter

## Executive Summary

Body highlighter components occupy a niche between simple image maps and full 3D anatomy viewers. The table stakes are clear: users expect clickable regions, visual feedback, and basic customization. Differentiators focus on developer experience (TypeScript, controlled components) and advanced interaction patterns (hover states, animations, accessibility). Anti-features include scope creep toward medical-grade detail or 3D rendering.

---

## Table Stakes

Features users expect. Missing = product feels incomplete or unusable.

| Feature | Why Expected | Complexity | Current Status | Notes |
|---------|--------------|------------|----------------|-------|
| **Clickable body parts** | Core purpose of the component | Low | DONE | `onBodyPartPress` callback exists |
| **Per-part color highlighting** | Visual feedback is fundamental | Low | DONE | `color`, `intensity`, and `styles.fill` supported |
| **Multiple body views (front/back)** | Users need complete body coverage | Medium | DONE | `side="front|back"` prop exists |
| **Gender variants** | Different body shapes needed | Medium | DONE | `male`/`female` variants exist |
| **Scale/sizing control** | Must fit various layouts | Low | DONE | `scale` prop exists |
| **Bilateral selection (left/right)** | Muscles are paired | Medium | DONE | `side` property on body parts |
| **TypeScript support** | Modern React expectation | Low | DONE | Full type definitions exported |
| **Disable individual parts** | Common UI pattern for validation states | Low | DONE | `disabledParts` prop exists |
| **Hide individual parts** | Selective rendering for use cases | Low | DONE | `hiddenParts` prop exists |
| **Default styling props** | Consistent base appearance | Low | DONE | `defaultFill`, `defaultStroke`, `defaultStrokeWidth` |
| **Custom per-part styling** | Override defaults for specific parts | Low | DONE | `styles` object per body part |
| **Responsive sizing** | Must work on different screen sizes | Medium | PARTIAL | Scale works but no fluid/responsive mode |
| **Basic accessibility** | Screen readers must identify the component | Medium | DONE | `accessibilityLabel` on SVG wrappers |

### Table Stakes for Web (Not Yet Implemented)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Mouse hover states** | Web users expect hover feedback | Low | CSS `:hover` or event handlers |
| **Cursor changes** | Visual affordance for clickability | Low | `cursor: pointer` on interactive parts |
| **Keyboard navigation** | Web accessibility requirement (WCAG) | Medium | Tab navigation between parts |
| **Focus indicators** | Required for keyboard users | Low | Visible focus ring on parts |

---

## Differentiators

Features that set the product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Priority | Notes |
|---------|-------------------|------------|----------|-------|
| **Smooth color transitions/animations** | Polish and delight | Medium | HIGH | Use CSS transitions or Framer Motion |
| **Tooltip support** | Show part names on hover | Medium | HIGH | Common UX pattern for educational use |
| **Controlled component pattern** | Predictable state management | Low | HIGH | Let parent fully control selection state |
| **Multi-select mode** | Select multiple parts simultaneously | Low | MEDIUM | Checkbox-like behavior vs radio |
| **Selection groups** | Select muscle groups (all arm muscles) | Medium | MEDIUM | Pre-defined part groupings |
| **Export to image** | Share/save highlighted body | High | LOW | Canvas/SVG export functionality |
| **Zoom and pan** | Detailed inspection | High | LOW | Touch gestures, mouse wheel |
| **Intensity legends** | Explain color meanings | Low | LOW | Companion component for color scale |
| **Custom SVG paths** | User-supplied body artwork | High | LOW | Plugin architecture for custom bodies |
| **Dark mode support** | Match app themes | Low | MEDIUM | Configurable color schemes |
| **RTL support** | International markets | Low | LOW | Mirror SVG for RTL layouts |
| **Undo/redo selection** | Complex workflows | Medium | LOW | Selection history stack |

### Web-Specific Differentiators

| Feature | Value Proposition | Complexity | Priority |
|---------|-------------------|------------|----------|
| **CSS class hooks** | Deep style customization | Low | HIGH |
| **Server-side rendering (SSR)** | SEO and performance | Medium | HIGH |
| **Zero dependencies (web)** | Bundle size optimization | Medium | HIGH |
| **Lazy loading** | Performance for large SVGs | Low | MEDIUM |

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **3D rendering** | Massive complexity increase, different product category | Stay with optimized 2D SVG; recommend Three.js alternatives for 3D needs |
| **Anatomically accurate medical detail** | Liability concerns, scope explosion, requires medical review | Keep abstracted muscle groups; don't claim medical accuracy |
| **Built-in state management** | Couples component to specific patterns | Provide controlled component API; let users manage state |
| **Workout/exercise database** | Out of scope, feature creep | Stay focused on visualization; let users bring their own data |
| **Animation sequencing** | Complex, rarely needed | Provide hooks for users to implement custom animations |
| **Internal organ visualization** | Different use case, requires new artwork | Stick to external body/muscle visualization |
| **Skeletal system** | Different use case, requires new artwork | Stay focused on muscular/body regions |
| **Body measurement overlays** | Fitness app specific, out of scope | Let users implement via composition |
| **Calorie/workout tracking** | Application-level feature | Pure visualization component only |
| **User accounts/persistence** | Application-level feature | Stateless component; users handle persistence |

### Web-Specific Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Heavy animation library bundled** | Bundle bloat | Make animation optional via peer dependency |
| **jQuery dependency** | Outdated, conflicts with React | Pure React implementation |
| **Global CSS** | Conflicts with app styles | Scoped styles or CSS-in-JS |
| **Canvas fallback** | SVG is widely supported | Trust modern browser SVG support |

---

## Feature Dependencies

Dependencies show what must be built first.

```
Core Platform Support
---------------------
react-native-svg (current) ──> web SVG (new)
                                   │
                                   ├──> Hover states (web-only)
                                   ├──> Keyboard navigation (web-only)
                                   └──> CSS class hooks (web-only)

Selection Enhancements
----------------------
Clickable parts (DONE) ──> Multi-select mode
                              │
                              └──> Selection groups

Styling Enhancements
--------------------
Per-part colors (DONE) ──> Smooth transitions ──> Animation API
                              │
Default styling (DONE) ──────┘

Accessibility Chain
-------------------
Basic a11y (DONE) ──> Keyboard navigation ──> Focus management
                              │                    │
                              └──> ARIA labels ────┘

Advanced Features
-----------------
Scale prop (DONE) ──> Responsive sizing ──> Zoom/pan
                                               │
SVG rendering ────────────────────────────────┴──> Export to image
```

### Critical Path for Web Support

```
1. Platform abstraction layer (separate react-native-svg usage)
      │
      v
2. Web SVG rendering (use standard <svg> elements)
      │
      v
3. Event normalization (onClick vs onPress, hover events)
      │
      v
4. Styling adaptation (CSS transitions, hover states)
      │
      v
5. Accessibility (keyboard nav, focus management)
```

---

## Competitor Feature Matrix

| Feature | react-native-body-highlighter (this) | react-body-highlighter | react-svg-map |
|---------|--------------------------------------|------------------------|---------------|
| React Native | YES | NO | NO |
| React Web | NO (goal) | YES | YES |
| TypeScript | YES | YES | YES |
| Click handlers | YES | YES | YES |
| Hover support | NO | CSS only | YES |
| Keyboard nav | NO | NO | YES (WAI-ARIA) |
| Gender variants | YES | YES | NO (maps) |
| Bilateral parts | YES | YES | N/A |
| Custom colors | YES | YES | YES |
| Intensity levels | YES | YES | NO |
| Disable parts | YES | NO | NO |
| Hide parts | YES | NO | NO |
| Per-part styles | YES | NO | Partial |
| Accessibility | Basic | None | Full |
| Multi-select | NO | NO | YES |
| Radio select | NO | NO | YES |

**Competitive advantage:** This library has the richest feature set for body visualization specifically. The web port should maintain feature parity while adding web-specific capabilities (hover, keyboard nav).

---

## MVP Recommendation for Web Support

### Phase 1: Core Web Parity

Build these first (table stakes for web):

1. **Web SVG rendering** - Replace react-native-svg with standard SVG
2. **Click handlers** - Normalize onPress to onClick
3. **Hover states** - Add onMouseEnter/onMouseLeave
4. **Cursor styling** - Pointer cursor on interactive parts
5. **CSS transitions** - Smooth color changes

### Phase 2: Web Polish

Add differentiators:

1. **Keyboard navigation** - Tab through parts, Enter to select
2. **Focus indicators** - Visible focus rings
3. **ARIA attributes** - Full accessibility
4. **SSR support** - Work in Next.js/Remix

### Defer to Post-MVP

- Tooltip support (can be composed externally)
- Export to image (edge case)
- Zoom/pan (rarely needed)
- Animation API (users can use Framer Motion)
- Selection groups (convenience, not essential)

---

## Sources

### Direct Competitors

- [react-body-highlighter](https://github.com/giavinh79/react-body-highlighter) - Web-focused fork with similar API
- [react-svg-map](https://github.com/VictorCazanave/react-svg-map) - WAI-ARIA compliant interactive SVG maps

### Accessibility Standards

- [The A11Y Collective - SVG Accessibility](https://www.a11y-collective.com/blog/svg-accessibility/) - tabindex and focus patterns
- [React Accessibility Documentation](https://legacy.reactjs.org/docs/accessibility.html) - Keyboard navigation patterns
- [React Native Accessibility](https://reactnative.dev/docs/accessibility) - Cross-platform a11y patterns

### Animation Patterns

- [Motion.dev - React SVG Animation](https://motion.dev/docs/react-svg-animation) - Framer Motion for SVG
- [CSS SVG Animation Tutorial](https://blog.logrocket.com/how-to-animate-svg-css-tutorial-examples/) - CSS transitions for SVG

### Medical/Anatomy References (for feature scope)

- [BioDigital Human](https://www.biodigital.com/) - Example of what NOT to build (full 3D platform)
- [iMuscle 2](https://3d4medical.com/apps/imuscle-2) - Fitness app anatomy UI patterns

### React Patterns

- [React Select Controlled/Uncontrolled](https://react.dev/reference/react-dom/components/select) - Official patterns
- [Partially Controlled Components](https://www.jameskerr.blog/posts/partially-controlled-react-components/) - Hybrid approach

---

## Confidence Assessment

| Category | Confidence | Reasoning |
|----------|------------|-----------|
| Table Stakes | HIGH | Based on current implementation and competitor analysis |
| Web-Specific Features | HIGH | Well-documented browser standards (WCAG, WAI-ARIA) |
| Differentiators | MEDIUM | Market research limited to open-source competitors |
| Anti-Features | HIGH | Clear scope boundaries from competitor failures |
| Dependencies | HIGH | Technical analysis of current codebase |
