# Pitfalls Research: React Native SVG to Browser SVG Migration

**Domain:** React Native body highlighter component migrating to pure React/browser SVG
**Researched:** 2026-01-17
**Confidence:** HIGH (verified via official documentation and multiple sources)

---

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Event Handler Name Mismatch (onPress vs onClick)

**What goes wrong:** React Native SVG uses `onPress` for touch events on `Path` and other SVG elements. Browser SVG uses `onClick`. Directly replacing component imports without changing event handler names results in completely non-functional click interactions.

**Why it happens:** The current codebase uses `onPress` on Path elements:
```typescript
// Current code in index.tsx
<Path
  onPress={() => onBodyPartPress?.(bodyPart)}
  // ...
/>
```

React-native-svg's `onPress` has no equivalent in browser SVG - it simply won't fire.

**Consequences:**
- All body part click handlers silently fail
- No error messages (the prop is just ignored)
- Users cannot interact with the body highlighter

**Prevention:**
1. Create a mapping layer during migration: `onPress` -> `onClick`
2. For TypeScript, update event handler types from `GestureResponderEvent` to `React.MouseEvent<SVGPathElement>`
3. Test click interactions on every body part after migration

**Detection (warning signs):**
- Event handlers never fire during testing
- TypeScript errors about missing event types
- Props being passed but having no effect

**Phase to address:** Phase 1 (Core component migration)

---

### Pitfall 2: Event Target Confusion with SVG Elements

**What goes wrong:** In browser SVG, `event.target` returns the actual clicked element (often a nested `<path>`), not the SVG element where the handler is attached. This differs from React Native's event handling model.

**Why it happens:** SVG elements are part of the DOM and follow standard DOM event bubbling. Clicking on a path inside an SVG returns that path as `event.target`, not the parent `<svg>` or the element with the handler attached.

**Consequences:**
- Event handling logic that depends on `event.target` breaks
- Slug identification from target element fails
- Side effects like highlighting wrong body parts

**Prevention:**
1. Always use `event.currentTarget` instead of `event.target` for the element with the handler
2. Pass body part data through handler closure (as current code already does) rather than extracting from DOM
3. Add TypeScript types: `React.MouseEvent<SVGPathElement>` for proper typing

**Detection:**
- Console logging `event.target` shows unexpected elements
- Click handling works inconsistently
- Wrong body parts get selected

**Phase to address:** Phase 1 (Core component migration)

---

### Pitfall 3: SVG viewBox and Sizing Collapse

**What goes wrong:** Browser SVG without proper `viewBox`, `width`, and `height` attributes may render at 0x0 pixels, 300x150 pixels (browser default), or with incorrect aspect ratios. The current code uses React Native's sizing which works differently.

**Why it happens:** Current wrapper components calculate size like this:
```typescript
<Svg viewBox={viewBox} height={400 * scale} width={200 * scale}>
```

React Native SVG handles sizing internally. Browser SVG has complex sizing rules involving intrinsic sizing, CSS, and attribute interactions. Safari in particular computes `0px` width when SVG is in absolute/flex containers without explicit dimensions.

**Consequences:**
- SVG completely invisible (0x0)
- Falls back to 300x150 browser default
- Aspect ratio distortion
- Inconsistent sizing across browsers

**Prevention:**
1. Always specify both `viewBox` AND explicit `width`/`height` attributes
2. For responsive sizing, use the intrinsic ratio technique:
   ```css
   .svg-wrapper {
     position: relative;
     padding-bottom: 200%; /* height/width ratio */
   }
   .svg-wrapper svg {
     position: absolute;
     width: 100%;
     height: 100%;
   }
   ```
3. Test specifically in Safari and older browsers
4. Use `preserveAspectRatio="xMidYMid meet"` explicitly

**Detection:**
- SVG appears to be missing or tiny
- Console shows element with 0 or 300px dimensions
- Aspect ratio looks wrong in Safari

**Phase to address:** Phase 1 (Core component migration)

---

### Pitfall 4: vectorEffect Casing Difference

**What goes wrong:** The current code uses `vectorEffect="non-scaling-stroke"` for the border paths. React Native SVG accepts this, but in React for web, SVG attributes must be camelCased in JSX.

**Why it happens:** Current code:
```typescript
<Path
  vectorEffect="non-scaling-stroke"
  // ...
/>
```

React converts camelCase props to their HTML/SVG attribute equivalents. But the actual SVG attribute is `vector-effect`, and the value `non-scaling-stroke` is correct. The prop name must be `vectorEffect` in React (which it already is), but verification is needed.

**Consequences:**
- Border strokes scale incorrectly when the SVG is resized
- Visual appearance differs from React Native version
- Memory leaks have been reported with this property in react-native-svg

**Prevention:**
1. Verify `vectorEffect` (camelCase) prop is used in JSX
2. Test border appearance at multiple scales
3. Consider if non-scaling-stroke is even needed for the web version

**Detection:**
- Stroke width changes when SVG is scaled
- Visual comparison with React Native version shows differences

**Phase to address:** Phase 2 (Visual parity verification)

---

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

### Pitfall 5: CSS Specificity Override for Fill and Stroke

**What goes wrong:** SVG inline attributes for `fill` and `stroke` cannot be overridden by CSS unless targeted directly. Migration may expect CSS-based theming to work when it won't.

**Why it happens:** The current code sets fill/stroke via props that become inline attributes:
```typescript
<Path
  fill={fillColor ?? partStyles.fill}
  stroke={partStyles.stroke}
  strokeWidth={partStyles.strokeWidth}
/>
```

Inline SVG attributes have higher specificity than CSS rules targeting the element type or class.

**Consequences:**
- CSS theming doesn't work
- `!important` needed (code smell)
- Harder to implement dark mode or custom themes

**Prevention:**
1. Use `currentColor` pattern: set `fill="currentColor"` and control via CSS `color` property
2. Or remove inline fill/stroke and use CSS classes exclusively
3. Or accept prop-based styling (current approach) and document it

**Detection:**
- CSS color changes have no effect
- Need to pass props all the way down for styling

**Phase to address:** Phase 2 (Styling architecture)

---

### Pitfall 6: TypeScript SVG Element Types

**What goes wrong:** React Native SVG has its own TypeScript definitions. Browser React uses `SVGProps<SVGPathElement>` and similar from `@types/react`. Mixing or incorrectly migrating types causes TypeScript errors.

**Why it happens:** The current codebase imports from `react-native-svg`:
```typescript
import { Path } from "react-native-svg";
```

Browser React needs:
```typescript
// Native SVG elements, no import needed
<path d="..." />  // lowercase, native DOM element
```

**Consequences:**
- TypeScript compilation errors
- Loss of type safety
- Props that exist in react-native-svg but not in browser SVG

**Prevention:**
1. Use lowercase `<svg>`, `<path>`, `<g>` for native browser elements
2. Import types from React: `React.SVGProps<SVGPathElement>`
3. Update event handler types: `React.MouseEvent<SVGPathElement>` instead of `GestureResponderEvent`
4. Create a type mapping document for the migration

**Detection:**
- TypeScript errors about missing properties
- Props like `onPress` not being recognized
- Type mismatches on event handlers

**Phase to address:** Phase 1 (Core component migration)

---

### Pitfall 7: Accessibility Attribute Differences

**What goes wrong:** React Native SVG uses `accessible` and `accessibilityLabel` props. Browser SVG uses `aria-label`, `role`, and `<title>/<desc>` elements with different support levels.

**Why it happens:** Current code:
```typescript
<Svg
  accessible={true}
  accessibilityLabel={`male-body-${side}`}
>
```

Browser SVG accessibility is different:
- `role="img"` needed for image semantics
- `aria-label` or `aria-labelledby` for accessible names
- `<title>` and `<desc>` elements have inconsistent screen reader support

**Consequences:**
- Screen readers don't announce the SVG content
- Accessibility audit failures
- Different behavior across browsers (especially iOS VoiceOver)

**Prevention:**
1. Use this pattern for browser SVG:
   ```jsx
   <svg role="img" aria-labelledby="titleId">
     <title id="titleId">Male body front view</title>
     {/* content */}
   </svg>
   ```
2. For interactive elements (body parts), add `tabindex` and keyboard handlers
3. Test with screen readers (VoiceOver, NVDA, JAWS)

**Detection:**
- Accessibility audit tools flag issues
- Screen readers ignore or misread the content
- Keyboard navigation doesn't work

**Phase to address:** Phase 3 (Accessibility)

---

### Pitfall 8: Missing Wrapper Component (Svg vs svg)

**What goes wrong:** The current code imports `Svg` (capital S) from react-native-svg. Browser React uses native `<svg>` (lowercase). Simply changing the import without updating usage causes render failures.

**Why it happens:** React Native SVG:
```typescript
import Svg, { G, Path } from "react-native-svg";
// Used as: <Svg viewBox="...">
```

Browser React:
```typescript
// No import needed for native SVG elements
// Used as: <svg viewBox="...">
```

**Consequences:**
- Runtime errors if `Svg` import fails
- Component doesn't render
- Confusion about which elements need imports

**Prevention:**
1. Replace all react-native-svg imports with native SVG elements
2. Change all usages: `Svg` -> `svg`, `G` -> `g`, `Path` -> `path`
3. Keep attribute casing as camelCase (React handles conversion)

**Detection:**
- Import errors at build time
- Runtime errors about undefined components
- Elements not rendering

**Phase to address:** Phase 1 (Core component migration)

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

### Pitfall 9: aria-disabled vs disabled Prop

**What goes wrong:** The current code uses `aria-disabled` on Path elements. Browser SVG paths don't support `disabled` as a boolean attribute (unlike form elements).

**Why it happens:** Current code:
```typescript
<Path
  aria-disabled={isPartDisabled(bodyPart.slug)}
  // ...
/>
```

This is actually correct for accessibility, but needs CSS support for visual disabled state.

**Prevention:**
1. Keep `aria-disabled` for accessibility
2. Add CSS rules for `[aria-disabled="true"]` selector for visual styling
3. Ensure click handlers check disabled state (current code already does this)

**Detection:**
- Disabled styling doesn't apply
- Disabled parts still appear clickable

**Phase to address:** Phase 2 (Styling)

---

### Pitfall 10: Key Prop Using Path Data

**What goes wrong:** Current code uses the path `d` attribute as the React key:
```typescript
<Path key={path} d={path} />
```

While this works, path data is very long (thousands of characters) which is inefficient for React's reconciliation.

**Prevention:**
1. Generate stable unique IDs for each body part/path combination
2. Use template: `${slug}-${side}-${index}` for keys
3. Store IDs in the asset data files

**Detection:**
- Performance warnings in React DevTools
- Slow re-renders when body parts update

**Phase to address:** Phase 2 (Performance optimization)

---

## SVG-Specific Browser Issues

### Browser Compatibility Notes

| Issue | Chrome | Firefox | Safari | Edge |
|-------|--------|---------|--------|------|
| viewBox required | Works | Works | CRITICAL | Works |
| vectorEffect | Works | Works | Works | Works |
| Click events on paths | Works | Works | Works | Works |
| aria-label on SVG | Works | Works | Limited | Works |

**Safari-specific issues:**
- SVG in flex/absolute containers may compute 0px width
- VoiceOver doesn't recognize `<desc>` element
- Intrinsic sizing behaves differently

---

## API Design Anti-Patterns to Avoid

### Anti-Pattern 1: Exposing React Native-isms

**Bad:** Keep `onBodyPartPress` name suggesting mobile tap events
**Good:** Rename to `onBodyPartClick` for web clarity

### Anti-Pattern 2: Scale Prop for Sizing

**Bad:** Use `scale` prop that multiplies base dimensions
**Good:** Use standard `width`/`height` props or CSS-based sizing

### Anti-Pattern 3: react-native-svg Dependencies

**Bad:** Keep react-native-svg as peer dependency for "compatibility"
**Good:** Create a clean break - pure React component with no RN dependencies

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Component migration | Event handler names | Search/replace onPress to onClick |
| Component migration | Import changes | Use native SVG elements |
| Component migration | TypeScript types | Map RN types to React SVG types |
| Visual parity | viewBox sizing | Test in Safari specifically |
| Visual parity | Stroke appearance | Verify vectorEffect works |
| Accessibility | Screen reader support | Use aria-labelledby pattern |
| Performance | Key prop efficiency | Generate stable IDs |

---

## Prevention Checklist

Before each phase:

- [ ] Search for `onPress` - must become `onClick`
- [ ] Search for `Svg`, `Path`, `G` imports - must become native elements
- [ ] Verify viewBox + width + height all present
- [ ] Test in Safari before considering complete
- [ ] Run accessibility audit
- [ ] Verify TypeScript compiles cleanly

---

## Sources

### Event Handling
- [React SVG onClick not working - Medium](https://medium.com/swlh/a-small-svg-pitfall-in-react-39cf09a3f66c)
- [SVG click events issue - React GitHub](https://github.com/facebook/react/issues/4963)
- [react-native-svg onPress issues](https://github.com/software-mansion/react-native-svg/issues/1483)

### SVG Sizing
- [How to Scale SVG - CSS-Tricks](https://css-tricks.com/scale-svg/)
- [6 Common SVG Fails - CSS-Tricks](https://css-tricks.com/6-common-svg-fails-and-how-to-fix-them/)
- [SVG Rendering Issues Fix - Lexo](https://www.lexo.ch/blog/2025/01/how-to-fix-svg-rendering-issues-why-your-svgs-might-have-0x0-size-and-how-to-solve-it/)

### Accessibility
- [Using ARIA to enhance SVG accessibility - TPGi](https://www.tpgi.com/using-aria-enhance-svg-accessibility/)
- [Creating Accessible SVGs - Deque](https://www.deque.com/blog/creating-accessible-svgs/)
- [Reliable SVG Accessibility - Fizz Studio](https://fizz.studio/blog/reliable-valid-svg-accessibility/)

### TypeScript
- [Trouble with @types/react - pshrmn](https://blog.pshrmn.com/trouble-with-react-types/)
- [JSX.IntrinsicElements - Total TypeScript](https://www.totaltypescript.com/workshops/advanced-react-with-typescript/types-deep-dive/exploring-jsxintrinsicelements/solution)

### react-native-svg
- [react-native-svg GitHub](https://github.com/software-mansion/react-native-svg)
- [vectorEffect issues](https://github.com/software-mansion/react-native-svg/issues/885)

### SVG Standards
- [viewBox - MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox)
- [fill - MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/fill)
- [SVG in React - LogRocket](https://blog.logrocket.com/guide-svgs-react/)
