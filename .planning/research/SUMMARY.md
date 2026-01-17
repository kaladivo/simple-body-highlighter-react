# Research Summary

**Project:** react-native-body-highlighter web migration
**Domain:** Interactive SVG body highlighting component
**Researched:** 2026-01-17
**Confidence:** HIGH

## Key Takeaways

- **Zero runtime dependencies achievable:** Replace react-native-svg with native browser SVG elements (`<svg>`, `<path>`, `<g>`). React JSX has complete SVG support with full TypeScript types via `React.SVGProps<SVGPathElement>`.

- **Existing architecture maps cleanly to web:** The component hierarchy (Body -> SvgWrapper -> Path elements) requires minimal structural changes. Main work is element name casing (`Path` -> `path`) and event handler migration (`onPress` -> `onClick`).

- **Safari sizing is the critical browser pitfall:** SVG elements in flex/absolute containers may render at 0x0 pixels in Safari without explicit width/height attributes alongside viewBox. Test Safari before considering any phase complete.

- **Feature parity is high, web-specific features needed:** Current React Native version has rich functionality (bilateral selection, disable/hide parts, custom styling). Web version needs hover states, cursor changes, and keyboard navigation to meet web UX expectations.

- **Modern build tooling simplifies the stack:** tsup for bundling (ESM + CJS dual output), Vitest for testing, no Babel required. This replaces the complex React Native build setup entirely.

## Stack

**Core approach:** TypeScript + tsup + Vitest + native browser SVG elements.

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.0.0 \|\| ^19.0.0 | Peer dependency with wide compatibility |
| TypeScript | ^5.6.0 | Type safety, declaration generation |
| tsup | ^8.5.1 | Zero-config bundling (ESM + CJS + .d.ts) |
| Vitest | ^4.0.0 | Fast testing with jsdom environment |
| @testing-library/react | ^16.3.0 | Component testing with React 19 support |

**What to remove:** react-native-svg (runtime dependency), all Babel packages, Jest, React Native dev dependencies.

**Key insight:** No SVG library needed. React JSX natively renders `<path d="..." fill="..." onClick={...} />` with full type safety.

## Features

### Table Stakes (Must Have)

All current features must work in the web version:
- Clickable body parts with callbacks
- Per-part color highlighting with intensity levels
- Front/back body views
- Male/female gender variants
- Scale/sizing control
- Bilateral selection (left/right)
- Disable and hide individual parts
- Default and custom per-part styling

**Web-specific table stakes (new):**
- Mouse hover states with visual feedback
- Cursor changes on interactive parts
- Keyboard navigation (Tab + Enter)
- Focus indicators for accessibility

### Differentiators (Should Have)

- CSS transitions for smooth color changes
- CSS class hooks for deep customization
- Server-side rendering (SSR) support
- Zero runtime dependencies (achieved via native SVG)

### Defer to v2+

- Tooltip support (composable externally)
- Export to image functionality
- Zoom and pan controls
- Selection groups
- Animation API (users can use Framer Motion)

### Anti-Features (Do Not Build)

- 3D rendering
- Built-in state management
- Medical-grade anatomical detail
- Workout/exercise database

## Architecture

**Component structure:**
```
src/
  index.ts              <- Public API exports
  Body.tsx              <- Main orchestration component
  types.ts              <- All TypeScript interfaces
  components/
    SvgContainer.tsx    <- Unified SVG wrapper (replaces gender-specific wrappers)
    BodyPath.tsx        <- Individual path with click/hover handling
    BodyOutline.tsx     <- Border/outline rendering
  assets/               <- SVG path data (unchanged)
  hooks/
    useBodyPartStyles.ts <- Style calculation logic
  utils/                <- Utilities (unchanged)
```

**Build order (dependency-driven):**
1. types.ts + assets + utils (no dependencies)
2. SvgContainer, BodyPath, BodyOutline (depend on types)
3. Body.tsx (depends on all components)
4. index.ts (re-exports)

**Key migrations:**
- `<Path onPress={...}>` becomes `<path onClick={...}>`
- `<Svg>` becomes `<svg>`
- Event types: `GestureResponderEvent` becomes `React.MouseEvent<SVGPathElement>`
- Accessibility: `accessibilityLabel` becomes `aria-label` + `role="img"`

## Watch Out For

### Critical (Phase 1)

1. **Event handler names:** `onPress` silently fails in browser SVG. Must replace with `onClick`. No error messages, just broken interactions.

2. **SVG viewBox sizing in Safari:** SVG renders at 0x0 without explicit width/height alongside viewBox. Always set both attributes.

3. **Element casing:** React Native SVG uses `<Path>`, browser uses `<path>`. Must be lowercase for native elements.

4. **TypeScript types:** Replace react-native-svg types with `React.SVGProps<SVGPathElement>` and `React.MouseEvent<SVGPathElement>`.

### Moderate (Phase 2-3)

5. **Accessibility attributes:** `accessible` + `accessibilityLabel` must become `role="img"` + `aria-labelledby` with `<title>` element.

6. **CSS specificity:** Inline SVG fill/stroke attributes cannot be overridden by CSS. Document that prop-based styling is the supported pattern.

7. **Key prop efficiency:** Current code uses path `d` data as React keys (thousands of characters). Use stable IDs like `${slug}-${side}` instead.

### Prevention Checklist

Before each phase:
- [ ] Search for `onPress` - must become `onClick`
- [ ] Search for `Svg`, `Path`, `G` imports - must become native elements
- [ ] Verify viewBox + width + height all present
- [ ] Test in Safari before considering complete
- [ ] Verify TypeScript compiles cleanly

## Roadmap Implications

### Suggested Phase Structure

**Phase 1: Build System + Core Migration**

Rationale: Foundation must be solid before features. Build system enables everything else.

Delivers:
- tsup build configuration
- Vitest test setup
- types.ts with all TypeScript interfaces
- SvgContainer component (unified wrapper)
- BodyPath component (with onClick)
- Basic Body component rendering static paths

Avoids pitfalls: Event handler naming, element casing, Safari sizing

---

**Phase 2: Feature Parity**

Rationale: Match React Native functionality before adding web-specific features.

Delivers:
- Full Body component with all props working
- Click handlers calling onBodyPartPress
- Color highlighting with intensity
- Disable/hide parts functionality
- All gender/side variants

Uses: Components from Phase 1, all asset files

---

**Phase 3: Web-Specific Features**

Rationale: Web UX expectations differ from mobile. These are table stakes for web users.

Delivers:
- Hover states (onMouseEnter/onMouseLeave)
- Cursor styling (pointer on interactive parts)
- CSS transitions for color changes
- CSS class hooks for customization

Implements: Web-specific differentiators from FEATURES.md

---

**Phase 4: Accessibility**

Rationale: Accessibility is a web requirement, not optional.

Delivers:
- Keyboard navigation (Tab through parts)
- Focus indicators (visible focus rings)
- ARIA attributes (role, aria-label, aria-labelledby)
- Screen reader support

Avoids pitfall: Accessibility attribute differences

---

**Phase 5: Polish + Publish**

Rationale: Final preparation for npm release.

Delivers:
- SSR compatibility verification
- Package.json exports configuration
- Documentation updates
- npm publish

---

### Phase Ordering Rationale

1. **Build system first:** Cannot test or iterate without proper build
2. **Core migration before features:** Ensures foundation is solid
3. **Feature parity before web-specific:** Proves migration works correctly
4. **Accessibility after features:** Features must exist to make accessible
5. **Polish last:** Only after everything works

### Research Flags

**Phases with standard patterns (skip further research):**
- Phase 1: tsup/Vitest setup is well-documented
- Phase 2: Direct migration from existing code
- Phase 5: Standard npm publishing process

**Phases that may need validation during planning:**
- Phase 3: CSS transition patterns for SVG (verify browser support)
- Phase 4: Screen reader testing needed (VoiceOver, NVDA behavior varies)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified via official docs, tsup/Vitest releases confirmed |
| Features | HIGH | Based on existing implementation + competitor analysis |
| Architecture | HIGH | Direct analysis of current codebase |
| Pitfalls | HIGH | Verified via MDN, react-native-svg issues, multiple sources |

**Overall confidence:** HIGH

### Gaps to Address

- **Screen reader testing:** Will need manual testing with VoiceOver/NVDA during Phase 4
- **Safari edge cases:** May discover additional sizing issues during implementation
- **SSR behavior:** Need to verify no hydration mismatches with Next.js/Remix

## Sources

### Primary (HIGH confidence)
- [tsup documentation](https://tsup.egoist.dev/) - Build configuration
- [Vitest documentation](https://vitest.dev/) - Test setup
- [React SVG support](https://react.dev) - Native JSX SVG support
- [MDN SVG reference](https://developer.mozilla.org/en-US/docs/Web/SVG) - Browser SVG behavior

### Secondary (MEDIUM confidence)
- [CSS-Tricks SVG sizing](https://css-tricks.com/scale-svg/) - Safari sizing issues
- [TPGi SVG accessibility](https://www.tpgi.com/using-aria-enhance-svg-accessibility/) - ARIA patterns
- [react-native-svg GitHub issues](https://github.com/software-mansion/react-native-svg/issues) - Migration pitfalls

### Related Projects
- [react-body-highlighter](https://github.com/giavinh79/react-body-highlighter) - Web competitor, similar API
- [react-svg-map](https://github.com/VictorCazanave/react-svg-map) - WAI-ARIA patterns for interactive SVG

---
*Research completed: 2026-01-17*
*Ready for roadmap: yes*
