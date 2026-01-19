# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Runner:**
- Jest v29.7.0
- Config: `jest.config.js`

**Assertion Library:**
- Jest built-in assertions
- @testing-library/jest-dom v6.9.1 (extended matchers)

**Environment:**
- jsdom (jest-environment-jsdom v30.2.0)
- Babel transforms for TypeScript/React

**Run Commands:**
```bash
npm test              # Run all tests
npm test -- --watch  # Watch mode
npm test -- --coverage  # Coverage report
```

## Test File Organization

**Location:**
- Separate `__tests__/` directory at project root

**Naming:**
- `{ComponentName}.test.tsx` pattern
- Example: `Body.test.tsx`

**Structure:**
```
__tests__/
  Body.test.tsx       # Main component tests
```

## Test Structure

**Suite Organization:**
```typescript
describe('Body Component', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => { ... });
    it('renders male front view by default', () => { ... });
    // More rendering tests...
  });

  describe('Color Highlighting', () => {
    it('highlights body part with specified color', () => { ... });
    // More color tests...
  });

  describe('Click Handling', () => { ... });
  describe('Interactive States', () => { ... });
  describe('Hidden Parts', () => { ... });
  describe('Scaling', () => { ... });
  describe('Accessibility', () => { ... });
});
```

**Patterns:**
- Nested `describe` blocks for grouping related tests
- Each `it` block tests a single behavior
- Test names describe expected behavior, not implementation
- No setup/teardown needed (stateless component)

## Test Examples

**Basic Rendering Test:**
```typescript
it('renders without crashing', () => {
  render(<Body data={[]} />);
  expect(screen.getByRole('img')).toBeInTheDocument();
});

it('renders male front view by default', () => {
  render(<Body data={[]} />);
  expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'male-body-front');
});
```

**Props Testing:**
```typescript
it('highlights body part with specified color', () => {
  const data: BodyPartData[] = [{ slug: 'left-biceps', color: '#ff0000' }];
  render(<Body data={data} />);

  const paths = screen.getAllByTestId('left-biceps');
  expect(paths.length).toBeGreaterThan(0);
  paths.forEach(path => {
    expect(path).toHaveAttribute('fill', '#ff0000');
  });
});
```

**Event Handler Testing:**
```typescript
it('calls onClick with correct slug when body part clicked', () => {
  const handleClick = jest.fn();
  render(<Body data={[]} onClick={handleClick} />);

  const path = screen.getAllByTestId('left-biceps')[0];
  fireEvent.click(path);

  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick).toHaveBeenCalledWith('left-biceps', expect.any(Object));
});
```

**Accessibility Testing:**
```typescript
it('triggers onClick on Enter key', () => {
  const handleClick = jest.fn();
  render(<Body data={[{ slug: 'abs', color: '#ff0000' }]} onClick={handleClick} />);
  const part = screen.getAllByTestId('abs')[0];
  fireEvent.keyDown(part, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalledWith('abs', expect.any(Object));
});

it('excludes disabled parts from tab order', () => {
  render(<Body data={[{ slug: 'abs', color: '#ff0000' }]} disabledParts={['abs']} />);
  const parts = screen.getAllByTestId('abs');
  parts.forEach(part => {
    expect(part).toHaveAttribute('tabindex', '-1');
  });
});
```

## Mocking

**Framework:** Jest built-in mocking

**Patterns:**
```typescript
// Mock callback functions
const handleClick = jest.fn();
render(<Body data={[]} onClick={handleClick} />);

// Assert on mock calls
expect(handleClick).toHaveBeenCalledTimes(1);
expect(handleClick).toHaveBeenCalledWith('left-biceps', expect.any(Object));

// Access mock call arguments
const [slug, event] = handleClick.mock.calls[0];
expect(slug).toBe('left-biceps');
expect(event).toHaveProperty('type', 'click');
```

**What to Mock:**
- Callback props (onClick handlers)
- External services (none in this library)

**What NOT to Mock:**
- The component itself
- DOM rendering (use Testing Library)
- React hooks
- Internal component logic

## Fixtures and Factories

**Test Data:**
```typescript
// Inline test data with explicit types
const data: BodyPartData[] = [{ slug: 'left-biceps', color: '#ff0000' }];

// Multiple items for complex tests
const data: BodyPartData[] = [
  { slug: 'left-biceps', color: '#ff0000' },
  { slug: 'right-biceps', color: '#00ff00' },
];
```

**Location:**
- Test data defined inline in test files
- No separate fixtures directory

## Coverage

**Requirements:** None enforced (no coverage threshold configured)

**View Coverage:**
```bash
npm test -- --coverage
```

## Test Types

**Unit Tests:**
- Component rendering tests
- Props behavior tests
- Event handler tests
- Accessibility tests
- All tests use React Testing Library

**Integration Tests:**
- Not present (component is self-contained)

**E2E Tests:**
- Not configured in main library
- Demo app may have separate testing

## Common Patterns

**Query Patterns:**
```typescript
// Single element by role
screen.getByRole('img')

// Multiple elements by test ID
screen.getAllByTestId('left-biceps')

// Query for absence
screen.queryByTestId('left-biceps')  // returns null if not found
expect(screen.queryByTestId('left-biceps')).not.toBeInTheDocument();
```

**Async Testing:**
- Not used (component is synchronous)

**Error Testing:**
- Not applicable (component doesn't throw)

## Configuration Files

**jest.config.js:**
```javascript
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.tsx', '**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
export default config;
```

**jest.setup.js:**
```javascript
require('@testing-library/jest-dom');
```

**babel.config.js:**
```javascript
export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
```

## Test Categories in Current Suite

| Category | Tests | Description |
|----------|-------|-------------|
| Basic Rendering | 5 | Component renders with various props |
| Color Highlighting | 3 | Data prop applies correct fill colors |
| Click Handling | 2 | onClick callback receives correct args |
| Interactive States | 5 | Disabled parts behavior |
| Hidden Parts | 2 | hiddenParts prop removes elements |
| Scaling | 1 | scale prop affects SVG dimensions |
| Accessibility | 6 | ARIA attributes and keyboard support |

**Total: 24 tests, all passing**

---

*Testing analysis: 2026-01-19*
