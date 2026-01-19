# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
react-native-body-highlighter/
├── src/                    # Source code (library)
│   ├── index.tsx          # Main entry point, Body component
│   ├── types.ts           # TypeScript type definitions
│   ├── components/        # SVG wrapper components
│   │   ├── SvgMaleWrapper.tsx
│   │   └── SvgFemaleWrapper.tsx
│   └── assets/            # SVG path data for body parts
│       ├── bodyFront.ts
│       ├── bodyBack.ts
│       ├── bodyFemaleFront.ts
│       └── bodyFemaleBack.ts
├── __tests__/             # Jest test files
│   └── Body.test.tsx
├── demo/                  # Vite demo application
│   ├── index.html
│   └── main.tsx
├── dist/                  # Build output (generated)
├── docs/                  # Documentation assets
│   └── screenshots/
├── .planning/             # GSD planning documents
│   ├── codebase/         # Codebase analysis (this file)
│   ├── phases/           # Implementation phases
│   ├── milestones/       # Milestone definitions
│   └── research/         # Research notes
├── package.json           # npm package config
├── tsconfig.json          # TypeScript config
├── tsup.config.ts         # Build tool config
├── vite.config.ts         # Demo dev server config
├── jest.config.js         # Test config
└── babel.config.js        # Babel config for Jest
```

## Directory Purposes

**src/**
- Purpose: All library source code
- Contains: React components, TypeScript types, SVG asset data
- Key files: `index.tsx` (main), `types.ts` (public types)

**src/components/**
- Purpose: Internal SVG wrapper components
- Contains: Male and female body outline wrappers
- Key files: `SvgMaleWrapper.tsx`, `SvgFemaleWrapper.tsx`

**src/assets/**
- Purpose: Static SVG path data for all body variants
- Contains: 4 files covering male/female x front/back combinations
- Key files: Each exports a `BodyPartAsset[]` array

**__tests__/**
- Purpose: Jest unit tests
- Contains: Component tests using Testing Library
- Key files: `Body.test.tsx`

**demo/**
- Purpose: Interactive demo for development and documentation
- Contains: Vite-based React application
- Key files: `main.tsx` (renders demo UI)

**dist/**
- Purpose: Build output for npm publishing
- Contains: ESM (.js), CJS (.cjs), TypeScript declarations (.d.ts)
- Generated: Yes (via `npm run build`)
- Committed: No (in .gitignore)

## Key File Locations

**Entry Points:**
- `src/index.tsx`: Library entry, exports Body component and types
- `demo/main.tsx`: Demo application entry

**Configuration:**
- `package.json`: Package metadata, scripts, dependencies
- `tsconfig.json`: TypeScript compiler options
- `tsup.config.ts`: Build configuration (ESM + CJS output)
- `jest.config.js`: Test runner configuration

**Core Logic:**
- `src/index.tsx`: Body component implementation (~103 lines)
- `src/types.ts`: All public TypeScript types (~139 lines)

**Testing:**
- `__tests__/Body.test.tsx`: Comprehensive component tests (~219 lines)

## Naming Conventions

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `SvgMaleWrapper.tsx`)
- Types: camelCase with `.ts` extension (`types.ts`)
- Assets: camelCase with `.ts` extension (e.g., `bodyFront.ts`)
- Tests: ComponentName.test.tsx (e.g., `Body.test.tsx`)

**Directories:**
- All lowercase, singular (e.g., `component`, `asset`)
- Exception: `__tests__` follows Jest convention

**Exports:**
- Components: Named exports in PascalCase (`export { Body }`)
- Types: Named exports in PascalCase (`export type { BodyPartSlug }`)
- Default export: Also provided for Body (`export default Body`)

## Where to Add New Code

**New Body Part:**
1. Add slug to `src/types.ts` BodyPartSlug union
2. Add SVG path data to relevant `src/assets/*.ts` files
3. Test renders correctly in demo

**New Component Prop:**
1. Add to `ModelProps` interface in `src/types.ts`
2. Implement in `src/index.tsx` Body component
3. Add tests to `__tests__/Body.test.tsx`

**New SVG Wrapper (e.g., for new gender/body type):**
1. Create `src/components/SvgNewWrapper.tsx`
2. Add asset files `src/assets/bodyNewFront.ts`, etc.
3. Update Body component to handle new variant

**New Utility Function:**
1. Create `src/utils/` directory if needed
2. Add function file (e.g., `src/utils/colorHelpers.ts`)
3. Import in `src/index.tsx`

**New Test Suite:**
1. Add to `__tests__/` directory
2. Follow pattern: `FeatureName.test.tsx`

## Special Directories

**.planning/**
- Purpose: GSD project planning and codebase analysis
- Generated: No (manually maintained)
- Committed: Yes

**dist/**
- Purpose: npm package build output
- Generated: Yes (via tsup)
- Committed: No

**node_modules/**
- Purpose: npm dependencies
- Generated: Yes (via npm install)
- Committed: No

**docs/screenshots/**
- Purpose: README images and documentation assets
- Generated: No (manually added)
- Committed: Yes

---

*Structure analysis: 2026-01-19*
