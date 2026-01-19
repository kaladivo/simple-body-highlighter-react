# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Interactive demo application built with Vite

### Changed

- None

### Fixed

- None

## [4.0.0] - 2026-01-19

### Added

- New simplified component API with `Body` component
- Type-safe body part slugs with `BodyPartSlug` type
- Bilateral body part support (e.g., `biceps-left`, `biceps-right`)
- Type exports: `BodyPartSlug`, `BodyPartData`, `ModelProps`
- Modern build system using tsup
- Web Testing Library test suite
- Full TypeScript support with strict typing

### Changed

- **BREAKING**: Renamed package from `react-native-body-highlighter` to `react-body-highlighter`
- **BREAKING**: Now targets web browsers only (React DOM), no longer supports React Native
- **BREAKING**: Simplified API - replaced `data` prop with direct body part configuration
- Migrated SVG components to native browser elements (no react-native-svg dependency)
- Refactored body assets with bilateral slug split for precise part targeting
- Reorganized source structure under `src/` directory

### Removed

- **BREAKING**: React Native support - use v3.x for React Native projects
- **BREAKING**: `react-native-svg` peer dependency
- Legacy Ramda utility dependencies

### Fixed

- Corrected slug categorization for `upper-back` and `lower-back` body parts

## [3.x and earlier]

Prior versions were released under the `react-native-body-highlighter` package name
with React Native support. See the [git history](https://github.com/HichamELBSI/react-native-body-highlighter/commits/main)
for changes in those versions.

Notable features added in v3.x:

- Custom body part styling props
- Disable/hide body parts functionality
- `aria-disabled` accessibility property
- TypeScript support with hooks

[Unreleased]: https://github.com/HichamELBSI/react-native-body-highlighter/compare/v4.0.0...HEAD
[4.0.0]: https://github.com/HichamELBSI/react-native-body-highlighter/releases/tag/v4.0.0
