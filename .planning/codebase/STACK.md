# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- TypeScript 5.6.3 - All source code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- JavaScript (ES Module) - Configuration files (`jest.config.js`, `babel.config.js`)

## Runtime

**Environment:**
- Node.js 18+ (CI uses Node 18, peer deps support React 18/19)
- Browser (React DOM target)

**Package Manager:**
- Yarn 1.22.22 (Classic)
- Lockfile: `package-lock.json` present (npm lockfile, not yarn.lock)

## Frameworks

**Core:**
- React 18/19 - Peer dependency, component library target
- React DOM 18/19 - Peer dependency for web rendering

**Testing:**
- Jest 29.7.0 - Test runner
- Testing Library React 16.3.1 - Component testing utilities
- Testing Library Jest DOM 6.9.1 - DOM matchers

**Build/Dev:**
- tsup 8.4.0 - TypeScript bundler (ESM + CJS output)
- Vite 7.3.1 - Development server for demo
- Babel 7.28.5 - Jest transpilation

## Key Dependencies

**Critical:**
- React 18/19 (peer) - Required for component usage
- React DOM 18/19 (peer) - Required for SVG rendering

**Development Only:**
- `@vitejs/plugin-react` 5.1.2 - Vite React plugin for demo
- `prettier` 3.6.2 - Code formatting
- `react-test-renderer` 19.2.0 - React testing utilities

**Zero Runtime Dependencies:**
- This library has NO runtime dependencies beyond React peer deps
- All SVG path data is bundled inline in the library

## Configuration

**TypeScript (`tsconfig.json`):**
- Target: ES2020
- Module: ESNext with bundler resolution
- JSX: react-jsx (automatic runtime)
- Strict mode enabled
- Output: `./dist`

**Build (`tsup.config.ts`):**
- Entry: `src/index.tsx`
- Formats: ESM (`.js`) + CJS (`.cjs`)
- Type declarations: `.d.ts` and `.d.cts`
- Sourcemaps enabled
- React externalized (not bundled)

**Testing (`jest.config.js`):**
- Environment: jsdom
- Transform: babel-jest for TypeScript
- Test pattern: `__tests__/**/*.test.{ts,tsx}`

**Demo (`vite.config.ts`):**
- Port: 5173 with auto-open
- Uses `index.html` at root with `demo/main.tsx`

## Platform Requirements

**Development:**
- Node.js 18+
- Yarn 1.x (or npm)

**Production:**
- React 18.0.0+ or 19.0.0+
- React DOM 18.0.0+ or 19.0.0+
- Modern browser with SVG support

**Package Exports:**
```json
{
  ".": {
    "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
  }
}
```

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `tsup` | Build library to `dist/` |
| `dev` | `tsup --watch` | Watch mode for library |
| `test` | `jest` | Run test suite |
| `typecheck` | `tsc --noEmit` | Type checking without emit |

**Demo (via Vite):**
```bash
npx vite        # Start demo dev server
npx vite build  # Build demo (not typical workflow)
```

---

*Stack analysis: 2026-01-19*
