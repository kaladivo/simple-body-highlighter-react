# Codebase Structure

**Analysis Date:** 2026-01-17

## Directory Layout

```
react-native-body-highlighter/
├── index.tsx           # Main component and type exports (package entry)
├── components/         # SVG wrapper components
├── assets/             # Body part SVG path data
├── utils/              # Helper utilities
├── __tests__/          # Jest test files
├── docs/               # Documentation assets
│   └── screenshots/    # README screenshots
├── dist/               # Build output (generated, gitignored)
├── .github/            # GitHub workflows
│   └── workflows/
├── .planning/          # Planning documentation
│   └── codebase/       # Architecture docs (this file)
├── package.json        # Package manifest
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Jest configuration
├── babel.config.js     # Babel configuration
└── README.md           # Package documentation
```

## Directory Purposes

**`/` (Root):**
- Purpose: Package entry point and configuration files
- Contains: Main `index.tsx` component, all config files
- Key files: `index.tsx`, `package.json`, `tsconfig.json`

**`components/`:**
- Purpose: SVG wrapper components for male and female body variants
- Contains: React functional components that wrap body part paths in SVG
- Key files: `SvgMaleWrapper.tsx`, `SvgFemaleWrapper.tsx`

**`assets/`:**
- Purpose: Static SVG path data for body parts
- Contains: TypeScript files exporting arrays of `BodyPart` objects
- Key files: `bodyFront.ts`, `bodyBack.ts`, `bodyFemaleFront.ts`, `bodyFemaleBack.ts`

**`utils/`:**
- Purpose: Generic utility functions
- Contains: Array/data manipulation helpers
- Key files: `differenceWith.ts`

**`__tests__/`:**
- Purpose: Jest test suites
- Contains: Component tests using React Native Testing Library
- Key files: `test.tsx`

**`dist/`:**
- Purpose: TypeScript build output
- Contains: Compiled JS and type declarations
- Generated: Yes (by `yarn build`)
- Committed: No (gitignored)

## Key File Locations

**Entry Points:**
- `index.tsx`: Main package entry, exports `Body` component and types
- `dist/index.js`: Compiled entry (npm package main)
- `dist/index.d.ts`: Type declarations

**Configuration:**
- `package.json`: Package manifest, scripts, dependencies
- `tsconfig.json`: TypeScript compiler options
- `jest.config.js`: Test runner configuration
- `babel.config.js`: Babel presets for React Native

**Core Logic:**
- `index.tsx`: All component logic, type definitions, rendering
- `components/SvgMaleWrapper.tsx`: Male body SVG container (19KB of path data)
- `components/SvgFemaleWrapper.tsx`: Female body SVG container (21KB of path data)

**Body Part Data:**
- `assets/bodyFront.ts`: Male front body parts (25KB)
- `assets/bodyBack.ts`: Male back body parts (21KB)
- `assets/bodyFemaleFront.ts`: Female front body parts (32KB)
- `assets/bodyFemaleBack.ts`: Female back body parts (23KB)

**Testing:**
- `__tests__/test.tsx`: Main test file for Body component

## Naming Conventions

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `SvgMaleWrapper.tsx`)
- Assets: camelCase with `.ts` extension (e.g., `bodyFront.ts`)
- Utils: camelCase with `.ts` extension (e.g., `differenceWith.ts`)
- Tests: `test.tsx` (single file approach)
- Config: lowercase with appropriate extension (e.g., `jest.config.js`)

**Directories:**
- lowercase, no hyphens for source dirs (e.g., `components`, `assets`, `utils`)
- Double underscores for special dirs (e.g., `__tests__`)

**Exports:**
- Default export for main component (`Body`)
- Named exports for types (`Slug`, `BodyPart`, `ExtendedBodyPart`, `BodyProps`, `BodyPartStyles`)
- Named exports for assets (`bodyFront`, `bodyBack`, etc.)

## Where to Add New Code

**New Body Part:**
1. Add path data to relevant asset files in `assets/`
2. Add slug to `Slug` union type in `index.tsx`
3. Add tests in `__tests__/test.tsx`

**New Component Variant (e.g., child body):**
1. Create new wrapper in `components/` (e.g., `SvgChildWrapper.tsx`)
2. Create new asset files in `assets/` (e.g., `bodyChildFront.ts`)
3. Update `index.tsx` to handle new variant via new prop

**New Utility Function:**
- Add to `utils/` directory with `.ts` extension
- Import in `index.tsx` if needed by main component

**New Tests:**
- Add test cases to existing `__tests__/test.tsx`
- Follow existing `describe`/`it` structure

**New Props/Features:**
1. Update `BodyProps` type in `index.tsx`
2. Implement in `Body` component
3. Add tests for new functionality
4. Update README.md with new prop documentation

## Special Directories

**`dist/`:**
- Purpose: TypeScript compilation output
- Generated: Yes (via `yarn build`)
- Committed: No
- Consumers: npm package users

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (via `yarn install`)
- Committed: No

**`.github/workflows/`:**
- Purpose: CI/CD automation
- Generated: No
- Committed: Yes

**`docs/screenshots/`:**
- Purpose: README documentation images
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-01-17*
