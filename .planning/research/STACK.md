# Stack Research: React SVG Component Library (Browser)

**Project:** react-native-body-highlighter web migration
**Researched:** 2026-01-17
**Goal:** Zero runtime dependencies beyond React as peer dependency

---

## Executive Summary

For building a React SVG component library targeting browsers in 2025/2026, the recommended stack is minimal by design: **TypeScript + tsup + Vitest + native browser SVG elements**. No SVG abstraction library is needed because React's built-in JSX support for SVG elements (`<svg>`, `<path>`, `<g>`) is complete and type-safe via `@types/react`.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| React | ^18.0.0 \|\| ^19.0.0 | Peer dependency | Wide compatibility range. React 19 is stable but many projects still use 18. Supporting both maximizes adoption. |
| TypeScript | ^5.6.0 | Type safety | 5.6+ stable, 5.9 available. Use 5.6+ for compatibility with ecosystem tools. |

**Confidence:** HIGH - Verified via [React docs](https://react.dev/versions), [TypeScript releases](https://github.com/microsoft/typescript/releases)

### SVG Rendering

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Native browser SVG | N/A | SVG rendering | **NO LIBRARY NEEDED.** React JSX natively supports all SVG elements (`<svg>`, `<path>`, `<g>`, etc.) with full TypeScript support via `React.SVGProps<SVGSVGElement>`. This achieves the zero-dependency goal. |

**Confidence:** HIGH - This is core React functionality, not a library

**Current code uses:**
```tsx
// react-native-svg (REMOVE)
import { Path } from "react-native-svg";
<Path d={...} fill={...} stroke={...} />
```

**Replace with:**
```tsx
// Native browser SVG (ADD)
<path d={...} fill={...} stroke={...} />
```

Key differences:
- Element names are lowercase (`path` not `Path`)
- No imports needed for SVG elements
- `onPress` becomes `onClick`
- All SVG attributes work natively (`strokeWidth`, `fill`, `d`, etc.)

### Build Tools

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| tsup | ^8.5.1 | Bundler | Zero-config TypeScript bundling. Produces ESM + CJS dual builds with declarations. Faster than Rollup, simpler than Vite for libraries. |
| TypeScript | ^5.6.0 | Compiler | Declaration generation, type checking |

**Confidence:** HIGH - Verified via [tsup GitHub releases](https://github.com/egoist/tsup/releases) (v8.5.1 released Nov 2024)

**tsup.config.ts:**
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  jsx: 'automatic', // Uses react-jsx transform
});
```

### Testing

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Vitest | ^4.0.0 | Test runner | Vite-native, fast, ESM-first. Drop-in Jest replacement with better performance. |
| @testing-library/react | ^16.3.0 | Component testing | React 19 support added in v16.1.0. Standard for React component testing. |
| @testing-library/dom | ^10.0.0 | DOM testing utilities | Peer dependency of @testing-library/react since v16.0.0 |
| jsdom | ^26.0.0 | DOM environment | Required for Vitest browser-like testing |

**Confidence:** HIGH - Verified via [Vitest docs](https://vitest.dev/), [React Testing Library releases](https://github.com/testing-library/react-testing-library/releases)

### Development Tools

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| @types/react | ^18.0.0 \|\| ^19.0.0 | React types | Match peer dependency range |
| @types/react-dom | ^18.0.0 \|\| ^19.0.0 | React DOM types | Match peer dependency range |
| prettier | ^3.6.0 | Formatting | Already in project, keep current |

**Confidence:** HIGH

---

## TypeScript Configuration

**tsconfig.json (recommended):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.tsx"]
}
```

**Key changes from current config:**
- `jsx: "react-jsx"` (not `"react-native"`) - Uses automatic JSX runtime, no React import needed
- `moduleResolution: "bundler"` - Modern resolution for library bundlers
- `module: "ESNext"` - Enables tree-shaking
- Removed: `"react-native"` target

**Confidence:** HIGH - Verified via [TypeScript JSX docs](https://www.typescriptlang.org/tsconfig/jsx.html)

---

## Package.json Structure

```json
{
  "name": "react-body-highlighter",
  "version": "4.0.0",
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
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.0.0",
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^26.0.0",
    "prettier": "^3.6.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.5.1",
    "typescript": "^5.6.0",
    "vitest": "^4.0.0"
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  }
}
```

**Key changes:**
- Removed `react-native-svg` dependency (was runtime dependency)
- Removed all React Native related dev dependencies
- Added `react-dom` as peer dependency (required for web)
- Added proper ESM/CJS exports with types
- `sideEffects: false` enables tree-shaking

---

## What NOT to Use

### Do NOT Use: react-native-svg
**Current:** `"react-native-svg": "^15.9.0"` as dependency

**Why remove:**
- Designed for React Native, not web browsers
- Adds ~50KB+ to bundle
- Unnecessary abstraction - browser SVG works natively
- Goal is zero runtime dependencies

**Confidence:** HIGH

### Do NOT Use: SVGR
**What it is:** Tool that converts SVG files to React components

**Why not for this project:**
- This library already has SVG path data as TypeScript strings in `assets/*.ts`
- SVGR is for converting external `.svg` files
- Would add build complexity without benefit
- Path data is already in the correct format

**Confidence:** HIGH - Verified via [SVGR docs](https://react-svgr.com/)

### Do NOT Use: Rollup (directly)
**Why not:**
- tsup wraps esbuild with sensible defaults
- Rollup requires more configuration for same result
- Only use Rollup directly if you need custom plugins

**Confidence:** MEDIUM - Rollup is viable but tsup is simpler

### Do NOT Use: Vite (for library bundling)
**Why not:**
- Vite excels at app development, not library publishing
- Vite library mode uses Rollup under the hood anyway
- tsup is purpose-built for npm package bundling

**Confidence:** MEDIUM - Vite works but tsup is more appropriate

### Do NOT Use: Jest
**Why not:**
- Slower than Vitest
- Requires more configuration for ESM/TypeScript
- Vitest is drop-in compatible but faster

**Confidence:** MEDIUM - Jest works but Vitest is recommended for new projects

### Do NOT Use: Webpack
**Why not:**
- Overkill for a simple component library
- Complex configuration
- Slower builds
- Designed for applications, not libraries

**Confidence:** HIGH

### Do NOT Use: @babel/* packages
**Current project has:** Multiple Babel presets

**Why remove:**
- tsup uses esbuild for transpilation (much faster)
- TypeScript compiler handles type checking
- Babel is unnecessary overhead for this use case

**Confidence:** HIGH

---

## Confidence Assessment Summary

| Recommendation | Confidence | Verification Source |
|----------------|------------|---------------------|
| Native browser SVG | HIGH | Core React/JSX functionality |
| React ^18 \|\| ^19 peer dep | HIGH | React docs, ecosystem analysis |
| TypeScript ^5.6 | HIGH | TypeScript releases, npm |
| tsup ^8.5.1 | HIGH | GitHub releases, npm |
| Vitest ^4.0 | HIGH | Vitest docs |
| @testing-library/react ^16.3 | HIGH | GitHub releases |
| Remove react-native-svg | HIGH | Project requirement |
| Remove Babel | HIGH | tsup handles transpilation |
| Avoid Rollup/Vite directly | MEDIUM | Works but unnecessary complexity |

---

## Migration Path Summary

**Remove (dependencies):**
- `react-native-svg` (runtime dependency)

**Remove (devDependencies):**
- `@babel/plugin-transform-flow-strip-types`
- `@babel/preset-env`
- `@babel/preset-flow`
- `@babel/preset-react`
- `@babel/preset-typescript`
- `@react-native/babel-preset`
- `@testing-library/jest-native`
- `@testing-library/react-native`
- `@types/react-native`
- `babel-jest`
- `jest`
- `jest-environment-jsdom`
- `metro-react-native-babel-preset`
- `react-native`
- `react-native-typescript-transformer`
- `react-test-renderer`

**Add (devDependencies):**
- `tsup`
- `vitest`
- `@testing-library/react`
- `@testing-library/dom`
- `jsdom`
- `react-dom` (move from peer to dev for testing)

**Modify:**
- `peerDependencies`: Add `react-dom`, update React range
- `tsconfig.json`: Change jsx to `react-jsx`
- Build script: `tsc` -> `tsup`

---

## Sources

- [tsup GitHub releases](https://github.com/egoist/tsup/releases) - Version 8.5.1 confirmed
- [tsup documentation](https://tsup.egoist.dev/)
- [Vitest documentation](https://vitest.dev/) - Version 4.0.17
- [React Testing Library releases](https://github.com/testing-library/react-testing-library/releases) - v16.3.1 with React 19 support
- [TypeScript releases](https://github.com/microsoft/typescript/releases) - 5.9.3 latest
- [TypeScript JSX configuration](https://www.typescriptlang.org/tsconfig/jsx.html)
- [React versions](https://react.dev/versions)
- [SVGR documentation](https://react-svgr.com/)
- [LogRocket: tsup bundling guide](https://blog.logrocket.com/tsup/)
- [tsup vs Vite/Rollup comparison](https://dropanote.de/en/blog/20250914-tsup-vs-vite-rollup-when-simple-beats-complex/)
- [LogRocket: SVGs in React](https://blog.logrocket.com/guide-svgs-react/)
