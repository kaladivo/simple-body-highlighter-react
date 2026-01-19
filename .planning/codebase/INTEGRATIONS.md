# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**None:**
- This is a standalone React component library
- No external API calls or SDK integrations
- All body part SVG data is bundled inline

## Data Storage

**Databases:**
- None - Pure UI component, no data persistence

**File Storage:**
- None - No file operations

**Caching:**
- None - React component state only

## Authentication & Identity

**Auth Provider:**
- None - No authentication required
- Component receives data via props

## Monitoring & Observability

**Error Tracking:**
- None built-in

**Logs:**
- None - Pure presentational component

## CI/CD & Deployment

**Hosting:**
- npm Registry (public package)
- Published as `react-body-highlighter`

**CI Pipeline (`.github/workflows/npm-publish.yml`):**
- Trigger: Push of version tags (`v*`)
- Runner: ubuntu-latest
- Node version: 18
- Steps:
  1. Install dependencies (yarn)
  2. Run tests (`yarn test`)
  3. Type check (`yarn typecheck`)
  4. Build (`yarn build`)
  5. Publish to npm

**Required Secrets:**
- `NPM_AUTH_TOKEN` - npm publish authentication

## Environment Configuration

**Required env vars:**
- None for library usage
- `NPM_AUTH_TOKEN` for CI publishing only

**Secrets location:**
- GitHub repository secrets (for CI)
- No `.env` files in project

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Package Distribution

**npm Package:**
- Name: `react-body-highlighter`
- Version: 4.0.0
- Access: Public
- Registry: https://registry.npmjs.org

**Published Files:**
- `dist/` - Bundled library (ESM, CJS, types)
- `README.md` - Documentation
- `LICENSE` - MIT license

**Package Size:**
- ESM: ~145KB (includes all SVG path data)
- CJS: ~147KB
- Total with sourcemaps: ~620KB

## Third-Party Dependencies at Runtime

**None:**
- Zero runtime dependencies
- Only peer dependencies: React, React DOM
- All SVG assets bundled inline as TypeScript constants

---

*Integration audit: 2026-01-19*
