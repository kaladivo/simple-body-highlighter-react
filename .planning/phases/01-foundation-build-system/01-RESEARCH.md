# Phase 1: Foundation + Build System - Research

**Researched:** 2026-01-17
**Domain:** React component library bundling, react-native-svg to native SVG migration
**Confidence:** HIGH

## Summary

Phase 1 transforms this React Native package into a web-only React library. The codebase currently uses `react-native-svg` components (capitalized `<Svg>`, `<Path>`, `<G>`) which must be converted to native browser SVG elements (lowercase `<svg>`, `<path>`, `<g>`).

The build system needs to switch from TypeScript Compiler (tsc) to tsup for modern dual-format (ESM + CJS) publishing. tsup provides zero-config bundling powered by esbuild with automatic TypeScript declaration generation.

The package.json requires restructuring: removing React Native dependencies, setting React 18/19 as peer dependencies, and configuring the exports field for proper module resolution.

**Primary recommendation:** Use tsup with `format: ['esm', 'cjs']`, `dts: true`, and `external: ['react', 'react-dom']` for the build. Convert react-native-svg components to native SVG elements by lowercasing element names and replacing `onPress` with `onClick`.

## Current Codebase Analysis

### Files Requiring Migration

| File | Changes Needed |
|------|----------------|
| `index.tsx` | Replace `Path` import with native `<path>`, change `onPress` to `onClick` |
| `components/SvgMaleWrapper.tsx` | Replace `Svg`, `G`, `Path` with native `<svg>`, `<g>`, `<path>` |
| `components/SvgFemaleWrapper.tsx` | Same as above |
| `assets/bodyFront.ts` | No changes (just path data) |
| `assets/bodyBack.ts` | No changes (just path data) |
| `assets/bodyFemaleFront.ts` | No changes (just path data) |
| `assets/bodyFemaleBack.ts` | No changes (just path data) |
| `utils/differenceWith.ts` | No changes needed |

### Current React Native Dependencies

```json
// Current package.json dependencies to REMOVE
{
  "dependencies": {
    "react-native-svg": "^15.9.0"  // REMOVE
  },
  "peerDependencies": {
    "react": "*",         // UPDATE to specific versions
    "react-native": "*"   // REMOVE
  },
  "devDependencies": {
    "@babel/plugin-transform-flow-strip-types": "^7.27.1",  // REMOVE
    "@babel/preset-flow": "^7.27.1",                        // REMOVE
    "@react-native/babel-preset": "^0.82.1",                // REMOVE
    "@testing-library/jest-native": "^5.4.3",               // REMOVE
    "@testing-library/react-native": "^13.3.3",             // REMOVE
    "@types/react-native": "^0.73.0",                       // REMOVE
    "metro-react-native-babel-preset": "^0.77.0",           // REMOVE
    "react-native": "^0.82.1",                              // REMOVE
    "react-native-typescript-transformer": "^1.2.13"        // REMOVE
  }
}
```

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsup | ^8.x | Bundler | Zero-config, esbuild-powered, ESM/CJS output, auto-dts |
| typescript | ^5.6+ | Type checking | Already in project, standard for React libs |
| react | ^18.0.0 \|\| ^19.0.0 | Peer dependency | Broad compatibility |
| react-dom | ^18.0.0 \|\| ^19.0.0 | Peer dependency | Required for web React |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | ^16.x | Testing | Web-based component testing |
| vitest | ^2.x | Test runner | Modern, fast, Vite-compatible |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| tsup | rollup | More config, slower, more control |
| tsup | vite library mode | More complex setup for component library |
| tsup | unbuild | Less mature ecosystem |

**Installation:**
```bash
# Remove old dependencies
npm uninstall react-native-svg react-native @types/react-native @react-native/babel-preset @testing-library/react-native @testing-library/jest-native metro-react-native-babel-preset react-native-typescript-transformer @babel/plugin-transform-flow-strip-types @babel/preset-flow

# Add new dependencies
npm install -D tsup @testing-library/react vitest jsdom @types/react @types/react-dom
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  index.tsx           # Main export, Body component
  components/
    SvgMaleWrapper.tsx
    SvgFemaleWrapper.tsx
  assets/
    bodyFront.ts
    bodyBack.ts
    bodyFemaleFront.ts
    bodyFemaleBack.ts
  utils/
    differenceWith.ts
  types.ts            # Shared TypeScript types (optional)
dist/
  index.js            # ESM output
  index.cjs           # CJS output
  index.d.ts          # TypeScript declarations
  index.d.cts         # CJS TypeScript declarations
```

### Pattern 1: react-native-svg to Native SVG Conversion

**What:** Convert React Native SVG components to native browser SVG elements
**When to use:** Always - this is the core migration

**Before (React Native):**
```tsx
import Svg, { G, Path } from "react-native-svg";

<Svg viewBox="0 0 724 1448" height={400} width={200}>
  <G strokeWidth={2} fill="none">
    <Path
      d="M..."
      fill="#3f3f3f"
      onPress={() => handlePress()}
    />
  </G>
</Svg>
```

**After (Native SVG):**
```tsx
// No import needed - native SVG elements

<svg viewBox="0 0 724 1448" height={400} width={200}>
  <g strokeWidth={2} fill="none">
    <path
      d="M..."
      fill="#3f3f3f"
      onClick={() => handleClick()}
      style={{ cursor: 'pointer' }}
    />
  </g>
</svg>
```

### Pattern 2: Safari-Safe SVG Dimensions

**What:** Ensure SVG renders correctly in Safari
**When to use:** Always for the wrapper components

**Example:**
```tsx
// Source: Technical notes + MDN/CSS-Tricks Safari SVG guides
<svg
  viewBox="0 0 724 1448"
  width={200 * scale}     // Explicit width REQUIRED for Safari
  height={400 * scale}    // Explicit height REQUIRED for Safari
  style={{ display: 'block' }}  // Prevents inline spacing issues
>
  {children}
</svg>
```

### Pattern 3: TypeScript Props for SVG Elements

**What:** Use correct TypeScript types for native SVG
**When to use:** For all SVG element props

**Example:**
```tsx
// Source: React TypeScript docs
interface PathProps extends React.SVGProps<SVGPathElement> {
  d: string;
}

// For the wrapper
interface SvgWrapperProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
  scale: number;
  side: "front" | "back";
}
```

### Anti-Patterns to Avoid
- **Using `onPress` instead of `onClick`:** React Native event handlers silently fail in web browsers
- **Omitting width/height on SVG:** Safari will not render correctly with only viewBox
- **Capital SVG element names:** `<Path>` is not a valid web SVG element, must use `<path>`
- **Importing from react-native-svg:** Remove all imports, use native elements

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ESM + CJS bundling | Custom webpack/rollup config | tsup | Handles edge cases, declaration files, sourcemaps |
| TypeScript declarations | Manual .d.ts files | tsup `dts: true` | Automatic generation from source |
| Module resolution | Custom exports field | tsup conventions | Well-tested patterns |
| Package exports validation | Manual testing | `@arethetypeswrong/cli` | Catches resolution issues |

**Key insight:** tsup eliminates hundreds of lines of bundler configuration. Trust it for standard React library patterns.

## Common Pitfalls

### Pitfall 1: onPress Silent Failure
**What goes wrong:** Event handlers never fire in web browser
**Why it happens:** `onPress` is React Native specific, web uses `onClick`
**How to avoid:** Search-replace all `onPress` with `onClick`
**Warning signs:** Click handlers not working, no console errors

### Pitfall 2: Safari SVG Blank Render
**What goes wrong:** SVG appears but content is invisible or wrong size
**Why it happens:** Safari requires explicit width/height alongside viewBox
**How to avoid:** Always set width and height attributes, not just viewBox
**Warning signs:** Works in Chrome/Firefox, blank or tiny in Safari

### Pitfall 3: TypeScript JSX Transform
**What goes wrong:** Build errors about JSX or React not found
**Why it happens:** tsconfig.json still set to `"jsx": "react-native"`
**How to avoid:** Update to `"jsx": "react-jsx"` for React 17+ JSX transform
**Warning signs:** "Cannot find name 'React'" or JSX-related errors

### Pitfall 4: Missing External Dependencies
**What goes wrong:** React is bundled into output, causing duplicate React errors
**Why it happens:** Forgot to mark React as external in tsup config
**How to avoid:** Set `external: ['react', 'react-dom']` in tsup.config.ts
**Warning signs:** Bundle size unexpectedly large, "Invalid hook call" errors

### Pitfall 5: Incorrect Module Resolution
**What goes wrong:** Consumers get "module not found" or wrong types
**Why it happens:** package.json exports field misconfigured
**How to avoid:** Use validated exports pattern, test with `@arethetypeswrong/cli`
**Warning signs:** Works in some bundlers but not others, TypeScript errors for consumers

## Code Examples

Verified patterns for this phase:

### tsup.config.ts
```typescript
// Source: tsup docs + LogRocket guide
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Use .js for ESM (default), .cjs for CommonJS
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
});
```

### package.json (updated)
```json
{
  "name": "react-body-highlighter",
  "version": "4.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./package.json": "./package.json"
  },
  "files": ["dist", "README.md", "LICENSE"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.4.0",
    "typescript": "^5.6.0",
    "vitest": "^2.0.0",
    "jsdom": "^25.0.0"
  },
  "keywords": [
    "react",
    "body",
    "highlighter",
    "anatomy",
    "muscle",
    "svg",
    "interactive"
  ]
}
```

### tsconfig.json (updated)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

### Native SVG Wrapper Example
```tsx
// src/components/SvgMaleWrapper.tsx
import * as React from "react";

type SvgWrapperProps = {
  children: React.ReactNode;
  scale: number;
  side: "front" | "back";
  border: string | "none";
};

export const SvgMaleWrapper: React.FC<SvgWrapperProps> = ({
  children,
  scale,
  side,
  border,
}) => {
  const viewBox = side === "front" ? "0 0 724 1448" : "724 0 724 1448";

  return (
    <svg
      viewBox={viewBox}
      height={400 * scale}
      width={200 * scale}
      aria-label={`male-body-${side}`}
      role="img"
    >
      {border !== "none" && (
        <g strokeWidth={2} fill="none" strokeLinecap="butt">
          {/* Border path content */}
        </g>
      )}
      {children}
    </svg>
  );
};
```

### Simple Test App (for verification)
```bash
# Create test app in separate directory
npm create vite@latest test-app -- --template react-ts
cd test-app

# Link local package
npm link ../react-body-highlighter

# Or use file protocol in package.json
# "react-body-highlighter": "file:../react-body-highlighter"
```

```tsx
// test-app/src/App.tsx
import { Body } from 'react-body-highlighter';

function App() {
  return (
    <div>
      <h1>Body Highlighter Test</h1>
      <Body
        data={[{ slug: 'chest', color: '#ff0000' }]}
        side="front"
        gender="male"
      />
    </div>
  );
}

export default App;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tsc for bundling | tsup/esbuild | 2022-2023 | 10x faster builds, dual format output |
| `"jsx": "react"` | `"jsx": "react-jsx"` | React 17 (2020) | No React import needed |
| `main` + `module` only | `exports` field | Node 12.7+ | Proper dual package support |
| react-native-svg | Native SVG | This migration | No dependencies, smaller bundle |

**Deprecated/outdated:**
- `@babel/preset-react-native`: Not needed for web-only library
- `metro-react-native-babel-preset`: React Native bundler config, remove
- `react-native-svg`: Replace with native SVG elements

## Open Questions

Things that couldn't be fully resolved:

1. **Test migration approach**
   - What we know: Current tests use `@testing-library/react-native`
   - What's unclear: Whether to fully migrate tests in Phase 1 or defer
   - Recommendation: Minimal test in Phase 1 (just verify render), full test migration in Phase 2

2. **Existing consumers**
   - What we know: Package will break backward compatibility (major version bump)
   - What's unclear: Whether any web consumers exist using this package
   - Recommendation: Bump to v4.0.0 to signal breaking change

## Sources

### Primary (HIGH confidence)
- [tsup Official Documentation](https://tsup.egoist.dev/) - Configuration options, format support
- [LogRocket tsup Guide](https://blog.logrocket.com/tsup/) - React library configuration examples
- [Johnny Reilly: Dual Publishing ESM/CJS](https://johnnyreilly.com/dual-publishing-esm-cjs-modules-with-tsup-and-are-the-types-wrong) - exports field configuration

### Secondary (MEDIUM confidence)
- [CSS-Tricks: How to Scale SVG](https://css-tricks.com/scale-svg/) - Safari SVG requirements
- [Ben Frain: Responsive SVGs in Safari](https://benfrain.com/attempting-to-fix-responsive-svgs-in-desktop-safari/) - Safari-specific fixes
- [Liran Tal: TypeScript ESM/CJS Publishing 2025](https://lirantal.com/blog/typescript-in-2025-with-esm-and-cjs-npm-publishing) - Current state of dual publishing

### Tertiary (LOW confidence)
- Community blog posts about react-native-svg migration (general patterns only)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - tsup is well-documented, widely used for React libraries
- Architecture: HIGH - Migration pattern is straightforward (lowercase elements, onClick)
- Pitfalls: HIGH - Safari SVG issues are well-documented, onPress/onClick is known

**Research date:** 2026-01-17
**Valid until:** 2026-04-17 (90 days - stable technologies)
