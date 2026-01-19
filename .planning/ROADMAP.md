# Roadmap: simple-body-highlighter-react v1.0.0

**Milestone:** v1.0.0 Publish to npm
**Phases:** 2
**Depth:** Quick
**Created:** 2026-01-19

---

## Overview

Rename package from react-body-highlighter to simple-body-highlighter-react, clean up react-native remnants, and publish to npm with automated GitHub Actions workflow. Two phases: first handles package identity and build verification, second handles remote setup and publish automation.

---

## Phase 1: Package Identity and Build Verification

**Goal:** Package is renamed, cleaned of react-native artifacts, and builds correctly

**Dependencies:** None (first phase)

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Rename package, update references, cleanup, verify build

**Requirements:**
- REN-01: Update package.json name to `simple-body-highlighter-react`
- REN-02: Update package.json version to `1.0.0`
- REN-03: Update all internal references to old package name
- CLN-01: Remove any react-native specific files
- CLN-02: Remove react-native references from code/comments
- CLN-03: Verify no react-native dependencies remain in package.json
- BLD-01: Confirm build outputs ESM + CJS correctly
- BLD-02: Verify TypeScript declarations generate
- BLD-03: Ensure all tests pass

**Success Criteria:**
1. `npm run build` completes without errors and produces dist/ with ESM and CJS bundles
2. `npm run test` passes all 24 tests with no failures
3. package.json shows name as `simple-body-highlighter-react` and version as `1.0.0`
4. `grep -r "react-native" src/` returns no matches (zero react-native references in source)

---

## Phase 2: Remote, Documentation, and CI/CD

**Goal:** Package is on new GitHub remote with docs and automated npm publishing

**Dependencies:** Phase 1 (package must be renamed and building before publishing)

**Plans:** 2 plans

Plans:
- [ ] 02-01-PLAN.md — Update GitHub Actions workflow and add CI/CD docs to README
- [ ] 02-02-PLAN.md — Create GitHub remote, push codebase, verify publish pipeline

**Requirements:**
- GIT-01: Add new remote for kaladivo/simple-body-highlighter-react
- GIT-02: Push codebase to new remote
- DOC-04: README with installation instructions
- DOC-05: README with basic usage examples
- DOC-06: README with props documentation
- DOC-07: README with body parts reference link
- CI-01: GitHub Actions workflow file (.github/workflows/publish.yml)
- CI-02: Trigger workflow on git tag push (v*)
- CI-03: Configure npm publish step
- CI-04: Document NPM_TOKEN secret setup in README

**Success Criteria:**
1. `git remote -v` shows origin pointing to kaladivo/simple-body-highlighter-react
2. README.md contains `npm install simple-body-highlighter-react` installation command
3. README.md contains working code example showing `<Body data={[...]} onClick={...} />` usage
4. `.github/workflows/publish.yml` exists and triggers on `v*` tag push
5. Pushing a `v1.0.0` tag triggers the publish workflow (verifiable in GitHub Actions)

---

## Progress

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 1 | Package Identity and Build Verification | 9 | Complete |
| 2 | Remote, Documentation, and CI/CD | 10 | Planned |

**Total:** 19 requirements mapped, 9 complete

---

## Coverage Validation

```
Phase 1 (9 requirements):
  REN-01, REN-02, REN-03
  CLN-01, CLN-02, CLN-03
  BLD-01, BLD-02, BLD-03

Phase 2 (10 requirements):
  GIT-01, GIT-02
  DOC-04, DOC-05, DOC-06, DOC-07
  CI-01, CI-02, CI-03, CI-04

Mapped: 19/19
Orphaned: 0
```

---
*Roadmap created: 2026-01-19*
*Last updated: 2026-01-19 - Phase 2 planned*
