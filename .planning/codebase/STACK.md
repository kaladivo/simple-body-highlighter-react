# Technology Stack

**Analysis Date:** 2026-01-17

## Languages

**Primary:**
- TypeScript 5.6.3 - All source code (`index.tsx`, `components/*.tsx`, `utils/*.ts`, `assets/*.ts`)

**Secondary:**
- JavaScript - Configuration files only (`babel.config.js`, `jest.config.js`, `rn-cli.config.js`)

## Runtime

**Environment:**
- Node.js 18 (specified in CI workflow)
- React Native runtime (consumer app provides this)

**Package Manager:**
- Yarn 1.22.22 (classic)
- Lockfile: `yarn.lock` (present, 213KB)

## Frameworks

**Core:**
- React Native ^0.82.1 (peer dependency) - Mobile UI framework
- React ^19.2.0 (peer dependency) - UI component library

**Testing:**
- Jest 29.7.0 - Test runner
- @testing-library/react-native 13.3.3 - Component testing utilities
- @testing-library/jest-native 5.4.3 - Jest matchers for React Native

**Build/Dev:**
- TypeScript 5.6.3 - Type checking and compilation
- Babel (via @react-native/babel-preset ^0.82.1) - JavaScript transpilation
- Prettier 3.6.2 - Code formatting

## Key Dependencies

**Critical (Runtime):**
- `react-native-svg` ^15.9.0 - SVG rendering for body part paths (only direct dependency)

**Peer Dependencies (Consumer Provides):**
- `react` * - Any version
- `react-native` * - Any version

**Development:**
- `@types/react` ^18.3.12 - React type definitions
- `@types/react-native` ^0.73.0 - React Native type definitions
- `react-test-renderer` ^19.2.0 - React component rendering for tests

## Configuration

**TypeScript (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "declaration": true
  },
  "exclude": ["__tests__", "node_modules", "dist"]
}
```

**Babel (`babel.config.js`):**
- Uses `module:@react-native/babel-preset`

**Jest (`jest.config.js`):**
- Preset: `react-native`
- Transforms `react-native-svg` and `@react-native(-community)?` packages

**Metro/RN CLI (`rn-cli.config.js`):**
- Uses `react-native-typescript-transformer`
- Source extensions: `.ts`, `.tsx`

## Build Output

**Distribution:**
- Output directory: `dist/`
- Main entry: `dist/index.js`
- Type definitions: `dist/index.d.ts`
- Published files: `dist/`, `README.md`, `LICENSE`

**Build Command:**
```bash
yarn build    # Runs tsc
```

## Platform Requirements

**Development:**
- Node.js 18+
- Yarn 1.x (classic)
- No native dependencies to build

**Consumer Requirements:**
- React Native project with `react-native-svg` installed
- Expo compatible (no native linking required)

**Production:**
- Published to npm registry
- Package name: `react-native-body-highlighter`
- Version: 3.1.3
- Access: Public

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `tsc` | Compile TypeScript to JavaScript |
| `test` | `jest` | Run test suite |
| `prepare` | `yarn build` | Build before publish (npm lifecycle) |
| `typecheck` | `tsc --noEmit` | Type check without emitting |

---

*Stack analysis: 2026-01-17*
