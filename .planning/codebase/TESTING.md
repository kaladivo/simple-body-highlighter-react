# Testing Patterns

**Analysis Date:** 2026-01-17

## Test Framework

**Runner:**
- Jest 29.7.0
- Config: `jest.config.js`
- Preset: `react-native`

**Assertion Library:**
- Jest built-in assertions
- `@testing-library/jest-native` 5.4.3 for React Native matchers

**Run Commands:**
```bash
yarn test              # Run all tests
npm test               # Alternative with npm
npx jest               # Direct Jest execution
```

**Note:** Tests require `node_modules` to be installed. The `react-native` preset may require additional setup.

## Test File Organization

**Location:**
- Separate `__tests__/` directory at project root

**Naming:**
- `test.tsx` for main test file
- No `.spec.ts` files found

**Structure:**
```
react-native-body-highlighter/
├── __tests__/
│   └── test.tsx          # Main test file for Body component
├── index.tsx             # Component under test
└── jest.config.js        # Jest configuration
```

## Test Structure

**Suite Organization:**
```typescript
describe("Body Component", () => {
  const mockData = [
    { slug: "chest", intensity: 1 },
    { slug: "biceps", intensity: 2 },
  ];

  it("should render the body component", () => {
    const { toJSON } = render(<Body data={mockData} />);
    expect(toJSON()).toBeTruthy();
  });

  describe("Per-Part Style Props", () => {
    it("should apply per-part fill style", () => {
      // ...
    });
  });
});
```

**Patterns:**
- Top-level `describe` for component name
- Nested `describe` blocks for feature groups
- Shared test data defined at suite level (`mockData`)
- Test names use "should" prefix convention

## Test Categories

**Current test coverage by feature:**

1. **Basic Rendering** - 1 test
   - Verifies component renders without crashing

2. **Per-Part Style Props** - 4 tests
   - `should apply per-part fill style`
   - `should apply per-part stroke style`
   - `should prioritize per-part styles.fill over color prop`
   - `should prioritize per-part styles.fill over intensity-based color`

3. **Global Default Style Props** - 3 tests
   - `should apply defaultFill when no per-part style is provided`
   - `should apply defaultStroke and defaultStrokeWidth globally`
   - `should use default values when no style props provided`

4. **Backward Compatibility** - 3 tests
   - `should still support color prop without styles`
   - `should still support intensity-based colors`
   - `should work with existing props without breaking`

5. **Mixed Usage** - 1 test
   - `should handle mixed styling approaches`

## Mocking

**Framework:** Jest built-in mocking

**Patterns:**
- No explicit mocks in current test file
- react-native-svg is transformed via Jest config:
  ```javascript
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|react-native-svg)',
  ],
  ```

**What to Mock:**
- External native modules if needed
- SVG components handled by transform patterns

**What NOT to Mock:**
- Component internals
- Props and data structures

## Fixtures and Factories

**Test Data:**
```typescript
// Simple mock data
const mockData = [
  { slug: "chest", intensity: 1 },
  { slug: "biceps", intensity: 2 },
];

// Data with custom styles
const dataWithStyles = [
  {
    slug: "chest",
    styles: {
      fill: "#ff0000",
      stroke: "#000000",
      strokeWidth: 2,
    },
  },
];

// Mixed styling approaches
const mixedData = [
  { slug: "chest", styles: { fill: "#ff0000", stroke: "#000000" } },
  { slug: "biceps", color: "#00ff00" },
  { slug: "deltoids", intensity: 2 },
];
```

**Location:**
- Test data defined inline within test files
- No separate fixtures directory

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
npx jest --coverage
```

**Note:** Coverage collection not pre-configured in `jest.config.js`.

## Test Types

**Unit Tests:**
- Component rendering tests using `@testing-library/react-native`
- Props application verification
- Style priority logic testing

**Integration Tests:**
- Not present

**E2E Tests:**
- Not present

## Common Patterns

**Rendering:**
```typescript
import { render } from "@testing-library/react-native";

const { toJSON } = render(<Body data={mockData} />);
expect(toJSON()).toBeTruthy();
```

**Querying Elements by Props:**
```typescript
const { UNSAFE_getAllByProps } = render(<Body data={dataWithStyles} />);
const paths = UNSAFE_getAllByProps({ id: "chest" });
expect(paths.length).toBeGreaterThan(0);
```

**Asserting Styles on Multiple Elements:**
```typescript
paths.forEach(path => {
  expect(path.props.fill).toBe("#ff0000");
  expect(path.props.stroke).toBe("#000000");
  expect(path.props.strokeWidth).toBe(2);
});
```

**Testing with Component Props:**
```typescript
const { toJSON } = render(
  <Body
    data={mockData}
    colors={["#74b9ff", "#0984e3"]}
    scale={1.5}
    side="front"
    gender="male"
    border="#dfdfdf"
  />
);
expect(toJSON()).toBeTruthy();
```

## Jest Configuration

**Full Config (`jest.config.js`):**
```javascript
module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|react-native-svg)',
  ],
};
```

**Key Settings:**
- Uses `react-native` preset for proper JSX/native module handling
- Transforms react-native and react-native-svg modules (not ignored)

## Test Utilities

**Testing Library React Native:**
- `render()` - Renders component for testing
- `toJSON()` - Serializes component tree
- `UNSAFE_getAllByProps()` - Queries elements by props (used for SVG Path elements)

## Gaps and Recommendations

**Not Tested:**
- `onBodyPartPress` callback invocation
- `disabledParts` prop behavior
- `hiddenParts` prop behavior
- Different `gender` prop values (`female` rendering)
- Different `side` prop values (`back` rendering)
- Edge cases (empty data, invalid slugs)
- Utility functions (`differenceWith`)

**Test File Location:**
- Tests in `__tests__/` directory (excluded from TypeScript compilation via `tsconfig.json`)

---

*Testing analysis: 2026-01-17*
