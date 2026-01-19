# Claude Code Instructions

## Changelog Management

**IMPORTANT**: Before pushing a new version, always update `CHANGELOG.md`:

1. **Check for unreleased changes**: Run `git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline` to see commits since the last tag (or all commits if no tags exist).

2. **Update the Unreleased section**: Add new entries under the appropriate categories:
   - **Added** - New features
   - **Changed** - Changes to existing functionality
   - **Deprecated** - Features that will be removed in future versions
   - **Removed** - Features that were removed
   - **Fixed** - Bug fixes
   - **Security** - Security-related changes

3. **When releasing a new version**:
   - Move items from `[Unreleased]` to a new version section
   - Use format: `## [X.Y.Z] - YYYY-MM-DD`
   - Update the comparison links at the bottom of the file
   - Keep entries human-readable and focused on the "why" not just the "what"

4. **Commit the changelog update** with the version bump.

### Example workflow before release:

```bash
# 1. Check unreleased changes
git log $(git describe --tags --abbrev=0 2>/dev/null || echo "")..HEAD --oneline

# 2. Update CHANGELOG.md (move Unreleased to new version)

# 3. Update version in package.json

# 4. Commit both changes
git add CHANGELOG.md package.json
git commit -m "chore: release vX.Y.Z"

# 5. Tag and push
git tag vX.Y.Z
git push && git push --tags
```

## Project Context

This is `simple-body-highlighter-react`, a React component library for visualizing body parts.
Previously named `react-native-body-highlighter`, v4.0.0 was a web-only rewrite. v1.0.0 establishes the new package identity.

### Key directories

- `src/` - Source code
- `demo/` - Interactive Vite demo application
- `.planning/` - Project planning documents
