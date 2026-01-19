# Phase 2: Remote, Documentation, and CI/CD - Research

**Researched:** 2026-01-19
**Domain:** GitHub/npm publishing, documentation, CI/CD
**Confidence:** HIGH

## Summary

This phase covers establishing the new GitHub remote, updating README documentation, and setting up automated npm publishing via GitHub Actions. The npm ecosystem underwent significant security changes in late 2025 - classic tokens have been revoked, and trusted publishing (OIDC) is now the recommended approach for CI/CD workflows.

Two publishing approaches are viable: (1) Trusted Publishing (OIDC) which eliminates tokens entirely but requires npm >=11.5.1 or Node.js 24+, or (2) Granular Access Tokens which work with any Node.js version but have a 90-day maximum expiration for write tokens. Given the project uses Node 20 locally and trusted publishing is still relatively new, the granular token approach is more straightforward for initial setup, with an option to migrate to OIDC later.

The existing README is already well-structured and mostly complete. Minor updates are needed to add CI/CD documentation for the NPM_TOKEN secret setup.

**Primary recommendation:** Use granular access tokens with tag-triggered GitHub Actions workflow for npm publishing. The workflow should trigger on `v*` tag push patterns.

## Standard Stack

The established tools for this domain:

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| GitHub Actions | N/A | CI/CD platform | Native GitHub integration, free for public repos |
| actions/checkout | v6 | Clone repository | Official GitHub action |
| actions/setup-node | v6 | Setup Node.js environment | Official, supports registry-url config |
| npm publish | >=10.x | Package publishing | Standard npm CLI command |
| gh CLI | latest | Repository management | Official GitHub CLI |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| npm granular tokens | N/A | CI/CD authentication | Token-based publishing (recommended for Node <24) |
| npm trusted publishing | requires npm >=11.5.1 | OIDC authentication | Tokenless publishing (requires Node 24+) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tag-triggered workflow | Release-triggered workflow | `on: release` is more explicit but requires manual GitHub release creation |
| Granular tokens | Trusted publishing (OIDC) | OIDC eliminates tokens but requires npm 11.5.1+ / Node 24+ |
| Manual npm publish | semantic-release | Fully automated but adds complexity for simple projects |

## Architecture Patterns

### Recommended Workflow Structure
```
.github/
└── workflows/
    └── publish.yml       # Triggered on v* tag push
```

### Pattern 1: Tag-Triggered npm Publish (Recommended)
**What:** GitHub Actions workflow that publishes to npm when a version tag is pushed
**When to use:** Simple projects with manual version bumps

```yaml
# Source: GitHub Docs - Publishing Node.js packages
name: Publish to npm
on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Pattern 2: Trusted Publishing (OIDC) - Future Option
**What:** Tokenless publishing using OpenID Connect
**When to use:** When using Node.js 24+ or npm 11.5.1+

```yaml
# Source: npm Docs - Trusted publishing
name: Publish to npm (OIDC)
on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write  # Required for OIDC
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24.x'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish --provenance --access public
        # No NODE_AUTH_TOKEN needed!
```

### Anti-Patterns to Avoid
- **Storing tokens in workflow files:** Never hardcode tokens; always use GitHub Secrets
- **Using classic npm tokens:** Revoked as of December 2025; use granular tokens instead
- **Skipping `registry-url` in setup-node:** Causes authentication failures
- **Using `npm install` instead of `npm ci`:** `npm ci` is faster and more deterministic in CI

## Don't Hand-Roll

Problems that have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Repository creation | Manual GitHub web UI | `gh repo create --source=. --push` | Single command handles everything |
| Version bumping | Manual package.json edits | `npm version patch/minor/major` | Creates commit and tag automatically |
| Changelog generation | Manual tracking | Keep current format; update manually | Not worth automation for simple projects |
| Badge generation | Custom images | shields.io badges | Standard, auto-updating |

**Key insight:** The gh CLI can create a remote and push in one command, eliminating multi-step workflows.

## Common Pitfalls

### Pitfall 1: Missing registry-url in setup-node
**What goes wrong:** npm publish fails with authentication errors
**Why it happens:** setup-node doesn't configure registry by default
**How to avoid:** Always include `registry-url: 'https://registry.npmjs.org'`
**Warning signs:** `npm ERR! 401 Unauthorized` or `npm ERR! 403 Forbidden`

### Pitfall 2: Using Revoked Classic Tokens
**What goes wrong:** Publishing fails after December 2025
**Why it happens:** npm revoked all classic tokens for security
**How to avoid:** Create granular access tokens from npmjs.com
**Warning signs:** Token starts with `npm_` (classic) instead of granular format

### Pitfall 3: Trusted Publishing 404 Errors
**What goes wrong:** `npm ERR! 404 Not Found` during publish
**Why it happens:** npm version too old (needs >=11.5.1) or misconfigured trusted publisher
**How to avoid:** Use Node.js 24+ or add `npm install -g npm@latest` step
**Warning signs:** 404 errors when publishing, not when fetching

### Pitfall 4: Tag Pattern Not Matching
**What goes wrong:** Workflow doesn't trigger on tag push
**Why it happens:** Tag pattern mismatch or using wrong event type
**How to avoid:** Use `tags: ['v*']` pattern; test with `git push --tags`
**Warning signs:** No workflow run appears in Actions tab after pushing tag

### Pitfall 5: First-Time Package Name Conflicts
**What goes wrong:** Cannot publish due to similar package name
**Why it happens:** npm's typosquatting protection blocks similar names
**How to avoid:** Check npmjs.com before choosing name; use scoped packages if needed
**Warning signs:** `npm ERR! 403` mentioning package name conflict

### Pitfall 6: Forgetting --access public for New Package
**What goes wrong:** Package publishes as private (npm errors out for free accounts)
**Why it happens:** npm defaults to restricted for new packages
**How to avoid:** Use `npm publish --access public` or set in publishConfig
**Warning signs:** `npm ERR! 402 Payment Required`

## Code Examples

### gh CLI: Create Remote and Push
```bash
# Source: GitHub CLI Manual - gh repo create
# From project root with existing git history:
gh repo create kaladivo/simple-body-highlighter-react --public --source=. --remote=origin --push
```

### npm: Create Granular Access Token (Manual Steps)
```
1. Go to https://npmjs.com/settings/~/tokens
2. Click "Generate New Token" -> "Granular Access Token"
3. Set name: "github-actions-publish"
4. Set expiration: 90 days (maximum for write tokens)
5. Select permissions: "Read and write"
6. Select packages: "Only select packages" -> "simple-body-highlighter-react"
7. Click "Generate Token"
8. Copy token (shown only once)
```

### GitHub: Add Repository Secret
```
1. Go to https://github.com/kaladivo/simple-body-highlighter-react/settings/secrets/actions
2. Click "New repository secret"
3. Name: NPM_TOKEN
4. Value: (paste token from npm)
5. Click "Add secret"
```

### Complete publish.yml Workflow
```yaml
# Source: GitHub Docs + community best practices
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Release Workflow (Tag + Publish)
```bash
# Update version and create tag
npm version patch  # or minor/major
# This creates commit "v1.0.1" and tag "v1.0.1"

# Push commit and tag
git push && git push --tags
# This triggers the publish workflow
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Classic npm tokens | Granular access tokens | Nov 2025 | Old tokens revoked; must create new granular tokens |
| Unlimited token expiry | 90-day max for write tokens | Oct 2025 | Must rotate tokens every 90 days OR use OIDC |
| Token-based auth | Trusted publishing (OIDC) | July 2025 GA | Tokenless publishing now possible with Node 24+ |
| actions/setup-node@v4 | actions/setup-node@v6 | Jan 2025 | Updated to Node 24 runtime; auto-caching for npm |
| actions/checkout@v4 | actions/checkout@v6 | Jan 2025 | Improved tag handling |

**Deprecated/outdated:**
- **npm classic tokens:** Revoked December 2025; must use granular tokens
- **npm automation tokens:** Replaced by granular tokens with "bypass 2FA" option
- **always-auth in setup-node:** Removed in v6; no longer needed

## Open Questions

Things that couldn't be fully resolved:

1. **Token Rotation Strategy**
   - What we know: Write tokens expire in max 90 days
   - What's unclear: Best practice for reminder/rotation workflow
   - Recommendation: Set calendar reminder; consider OIDC migration when upgrading to Node 24

2. **Provenance Statements**
   - What we know: `--provenance` flag adds supply chain attestations
   - What's unclear: Whether it works with granular tokens (vs only OIDC)
   - Recommendation: Try adding `--provenance` flag; remove if it fails

## Sources

### Primary (HIGH confidence)
- [GitHub Docs - Publishing Node.js packages](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages) - Official workflow examples
- [GitHub CLI Manual - gh repo create](https://cli.github.com/manual/gh_repo_create) - Repository creation flags
- [actions/setup-node releases](https://github.com/actions/setup-node/releases) - Current v6.2.0 (Jan 2025)
- [actions/checkout releases](https://github.com/actions/checkout/releases) - Current v6.0.2 (Jan 2025)

### Secondary (MEDIUM confidence)
- [npm Docs - Trusted publishing](https://docs.npmjs.com/trusted-publishers/) - OIDC setup (page CSS issues, verified via multiple sources)
- [GitHub Changelog - npm classic tokens revoked](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/) - Token deprecation timeline
- [GitHub Changelog - npm trusted publishing GA](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/) - OIDC availability
- [HTTP Toolkit Blog - Automatic npm publish](https://httptoolkit.com/blog/automatic-npm-publish-gha/) - Granular token workflow

### Tertiary (LOW confidence)
- [Medium - npm Trusted Publishers 404 Fix](https://medium.com/@kenricktan11/npm-trusted-publishers-the-weird-404-error-and-the-node-js-24-fix-a9f1d717a5dd) - OIDC troubleshooting

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official GitHub documentation
- Architecture: HIGH - Standard community patterns, verified examples
- Pitfalls: HIGH - Multiple sources confirm common issues
- Token migration: MEDIUM - Recent changes, some conflicting info

**Research date:** 2026-01-19
**Valid until:** 2026-02-19 (30 days - npm token policies may evolve)
