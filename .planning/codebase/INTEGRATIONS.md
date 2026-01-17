# External Integrations

**Analysis Date:** 2026-01-17

## APIs & External Services

**None.**

This is a standalone UI component library. It does not integrate with any external APIs, backend services, or third-party services.

## Data Storage

**Databases:**
- None - This is a pure UI component with no persistence

**File Storage:**
- None - No file I/O operations

**Caching:**
- None - Component renders from props only

## Authentication & Identity

**Auth Provider:**
- Not applicable - UI component library

## Monitoring & Observability

**Error Tracking:**
- None - No error reporting integration

**Logs:**
- None - No logging framework

## CI/CD & Deployment

**Hosting:**
- npm registry (https://registry.npmjs.org)
- Published as public package: `react-native-body-highlighter`

**CI Pipeline:**
- GitHub Actions
- Workflow: `.github/workflows/npm-publish.yml`
- Trigger: Git tags matching `v*` (e.g., `v3.1.4`)

**CI Pipeline Steps:**
1. Checkout repository
2. Setup Node.js 18
3. Cache Yarn dependencies
4. Install dependencies (`yarn install --frozen-lockfile`)
5. Run tests (`yarn test`)
6. Type check (`yarn typecheck`)
7. Build package (`yarn build`)
8. Publish to npm

## Environment Configuration

**Required env vars (CI only):**
- `NPM_AUTH_TOKEN` - GitHub secret for npm publish authentication

**Secrets location:**
- GitHub repository secrets (for CI)
- No runtime secrets required

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Third-Party Libraries

**Runtime Dependency:**

| Package | Purpose | Integration Type |
|---------|---------|------------------|
| `react-native-svg` | SVG rendering (Svg, G, Path components) | Direct import |

**Usage in code:**
```typescript
// components/SvgMaleWrapper.tsx, components/SvgFemaleWrapper.tsx
import Svg, { G, Path } from "react-native-svg";

// index.tsx
import { Path } from "react-native-svg";
```

**Peer Dependencies (Consumer Responsibility):**

| Package | Purpose |
|---------|---------|
| `react` | React component framework |
| `react-native` | Mobile platform APIs |

## Platform Compatibility

**React Native:**
- Compatible with React Native (tested with ^0.82.1)
- No native module linking required

**Expo:**
- Fully compatible (mentioned in README)
- Works with Expo's managed workflow

## Package Distribution

**npm Package:**
- Name: `react-native-body-highlighter`
- Registry: https://www.npmjs.com/package/react-native-body-highlighter
- Access: Public

**Installation:**
```bash
npm install react-native-body-highlighter
# or
yarn add react-native-body-highlighter
```

**Consumer also needs:**
```bash
npm install react-native-svg
# or
yarn add react-native-svg
```

---

*Integration audit: 2026-01-17*
