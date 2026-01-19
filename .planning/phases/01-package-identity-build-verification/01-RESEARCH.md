# Phase 1: Package Identity and Build Verification - Research

**Researched:** 2026-01-19
**Domain:** npm package renaming, tsup dual-format builds, React library publishing
**Confidence:** HIGH

## Summary

This phase involves renaming the package from `react-body-highlighter` to `simple-body-highlighter-react`, cleaning up remaining React Native artifacts, and verifying the build system continues to work correctly. The existing build infrastructure using tsup is already well-configured for ESM+CJS dual publishing, so the main work involves systematic string replacement and file cleanup.

The codebase is largely clean - the `src/` directory has zero react-native references. The main cleanup targets are the `rn-cli.config.js` file (a React Native CLI config), documentation files that still reference old package names, and the coverage folder (which should be gitignored but currently contains stale absolute paths).

**Primary recommendation:** Execute file updates in a specific order - package.json first (establishes new identity), then docs/references, then cleanup of React Native artifacts, then verify build and tests pass.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsup | ^8.4.0 | Build ESM + CJS bundles with TypeScript declarations | Already configured, fast esbuild-based bundler |
| typescript | ^5.6.3 | Type checking and declaration generation | Already configured with proper tsconfig |
| jest | ^29.7.0 | Test runner | Already configured with 24 passing tests |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | ^16.3.1 | React component testing | Already used in test suite |
| babel-jest | ^30.2.0 | TypeScript/JSX transformation for tests | Already configured |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| tsup | tsdown | Newer but tsup is working well, no reason to migrate |
| tsup | tshy | More opinionated, less control |
| tsup | vite library mode | More complex config for this use case |

**Installation:**
No new packages needed. Current setup is complete.

## Architecture Patterns

### Current Project Structure
```
/
├── src/                 # Source code (clean, no react-native refs)
│   ├── index.tsx        # Main entry, exports Body component
│   ├── types.ts         # TypeScript type definitions
│   ├── assets/          # SVG path data for body parts
│   └── components/      # SVG wrapper components
├── dist/                # Build output (gitignored)
├── __tests__/           # Jest test files
├── package.json         # Package manifest (needs name/version update)
├── tsup.config.ts       # Build configuration (working)
├── tsconfig.json        # TypeScript configuration (working)
├── README.md            # Documentation (needs package name updates)
├── CHANGELOG.md         # Change history (needs updates for v1.0.0)
├── BODY_PARTS.md        # Body part slug reference (needs package name update)
├── CLAUDE.md            # Claude instructions (needs package name update)
├── rn-cli.config.js     # React Native CLI config (DELETE)
└── coverage/            # Test coverage output (should be gitignored)
```

### Pattern: Package Rename Checklist
**What:** Systematic approach to renaming an npm package
**When to use:** Any package identity change
**Steps:**
1. Update `package.json` name field
2. Update `package.json` version field
3. Update `package-lock.json` (regenerate via `npm install`)
4. Update all documentation references
5. Update example code in docs
6. Update CHANGELOG with new name
7. Remove obsolete files (like `rn-cli.config.js`)
8. Verify build and tests pass

### Anti-Patterns to Avoid
- **Partial rename:** Leaving some references to old name causes confusion
- **Skipping package-lock.json:** Will cause inconsistency on next install
- **Not verifying build:** Name change could theoretically break imports (though unlikely here)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Finding all name references | Manual search | grep with patterns | Ensures nothing missed |
| Build verification | Manual file inspection | `npm run build` + check dist/ | tsup handles correctly |
| Test verification | Partial test run | `npm run test` full suite | 24 tests catch regressions |

**Key insight:** The existing tooling (tsup, jest) is already properly configured. Focus is on string replacement and file management, not tool configuration.

## Common Pitfalls

### Pitfall 1: Missing package-lock.json Update
**What goes wrong:** package-lock.json still contains old package name
**Why it happens:** Developers manually edit package.json but forget lock file
**How to avoid:** Run `npm install` after updating package.json to regenerate lock
**Warning signs:** `npm install` shows unexpected changes

### Pitfall 2: Coverage Folder with Absolute Paths
**What goes wrong:** coverage/ folder contains absolute paths to old directory name
**Why it happens:** Jest coverage caches absolute paths when run
**How to avoid:** Add `coverage/` to .gitignore (already done), delete folder before committing
**Warning signs:** grep finds matches in coverage/ files

### Pitfall 3: Demo App References
**What goes wrong:** demo/main.tsx still shows old package name in UI
**Why it happens:** Demo code often forgotten during rename
**How to avoid:** Search demo/ folder for package name references
**Warning signs:** Demo displays wrong package name

### Pitfall 4: GitHub Links in CHANGELOG
**What goes wrong:** CHANGELOG links point to old repository
**Why it happens:** Copy-paste from previous version
**How to avoid:** Update compare/release links to new repo URL
**Warning signs:** Clicking links goes to wrong repository

## Code Examples

Verified patterns from current codebase analysis:

### Current package.json exports Configuration (Working)
```json
// Source: /package.json - verified working
{
  "name": "react-body-highlighter",  // Change to: simple-body-highlighter-react
  "version": "4.0.0",                 // Change to: 1.0.0
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
  }
}
```

### Current tsup Configuration (Working)
```typescript
// Source: /tsup.config.ts - verified working
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
});
```

### Files Requiring Package Name Updates
```bash
# Files with "react-body-highlighter" references to update:
package.json          # name field
package-lock.json     # auto-generated, run npm install
README.md             # title, badges, install command, imports
BODY_PARTS.md         # import example
CHANGELOG.md          # package name references, GitHub links
CLAUDE.md             # project description
demo/main.tsx         # title display, code examples

# Files with "react-native" references (documentation context only):
README.md             # v4.0.0 breaking changes section (historical reference)
CHANGELOG.md          # v4.0.0 migration notes (historical reference)
```

### File to Delete
```
rn-cli.config.js      # React Native CLI config - no longer needed
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-native-body-highlighter | react-body-highlighter | v4.0.0 (2026-01-19) | Web-only, native SVG |
| react-body-highlighter | simple-body-highlighter-react | v1.0.0 (this phase) | Fresh npm identity |
| Intensity-based colors | Per-part explicit colors | v4.0.0 | Simpler API |

**Deprecated/outdated:**
- `rn-cli.config.js`: React Native CLI config, no longer needed for web-only package
- React Native references in comments: Should be updated to reference historical context only

## Verification Checklist

After all changes, verify:

1. **Build passes:** `npm run build` produces dist/ with:
   - `index.js` (ESM, ~142KB)
   - `index.cjs` (CJS, ~143KB)
   - `index.d.ts` (TypeScript declarations)
   - `index.d.cts` (CJS TypeScript declarations)
   - Source maps for both formats

2. **Tests pass:** `npm run test` shows:
   - 24 tests passing
   - 1 test suite
   - No failures

3. **Package identity correct:**
   - `cat package.json | grep '"name"'` shows `"simple-body-highlighter-react"`
   - `cat package.json | grep '"version"'` shows `"1.0.0"`

4. **No react-native in source:**
   - `grep -r "react-native" src/` returns no matches

5. **No rn-cli.config.js:**
   - `ls rn-cli.config.js` returns "No such file"

## Open Questions

Things that couldn't be fully resolved:

1. **GitHub repository rename**
   - What we know: Current repo is `react-native-body-highlighter`
   - What's unclear: Will the repo be renamed or will a new repo be created?
   - Recommendation: Phase 2 handles remote setup (GIT-01, GIT-02), defer decision to that phase

2. **CHANGELOG GitHub links**
   - What we know: Current links point to `HichamELBSI/react-native-body-highlighter`
   - What's unclear: What the new repository URL will be
   - Recommendation: Update to `kaladivo/simple-body-highlighter-react` when Phase 2 is planned

## Sources

### Primary (HIGH confidence)
- Local codebase analysis: package.json, tsup.config.ts, tsconfig.json
- Local build verification: `npm run build` output confirmed
- Local test verification: `npm run test` output confirmed (24 passing)
- grep analysis: All file references identified

### Secondary (MEDIUM confidence)
- [npm Package Name Guidelines](https://docs.npmjs.com/package-name-guidelines/) - naming conventions
- [tsup ESM/CJS dual publishing](https://johnnyreilly.com/dual-publishing-esm-cjs-modules-with-tsup-and-are-the-types-wrong) - configuration patterns
- [npm rename best practices](https://gist.github.com/nandorojo/1b969a0d88cf81ca8a2a334a5bd2ee4a) - rename workflow

### Tertiary (LOW confidence)
- None - all findings verified with local codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - existing tooling verified working
- Architecture: HIGH - current structure documented from codebase
- Pitfalls: HIGH - identified from actual grep results
- File changes: HIGH - complete list identified via grep

**Research date:** 2026-01-19
**Valid until:** 30 days (stable domain, no fast-moving dependencies)
