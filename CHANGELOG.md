# Changelog

All notable changes to this project are documented here. Versions follow
[semantic versioning](https://semver.org/).

## [Unreleased]

### Changed

- Renamed to **Firepanel** ahead of the Chrome Web Store release.
- The extension's version now comes from `package.json` alone; the manifest is
  generated at build time so the two can no longer disagree.

### Added

- Keyboard navigation in the filter results: `↑` / `↓` to move, `Enter` to open.
- Unit tests for theme resolution, query-URL building and document parsing.
- Continuous integration: typecheck, tests and a build on every push; releases
  are built from the tag rather than from a laptop.

### Fixed

- Filtering no longer keeps polling while the tab is in the background.
- A repeated failure inside the injection loop now stops the loop instead of
  retrying forever.

## [1.7.0] - 2026-09-18

### Added

- The document field filter matches leaf values as well as keys, and reports the
  two counts separately.

## [1.6.2] - 2026-08-31

### Fixed

- Theme resolution could recurse between its two entry points when nothing in
  the page was painted, which stopped the extension loading at all.

## [1.6.0] - 2026-08-31

### Added

- Light theme support: colours are read from what the console actually paints,
  and a theme toggle repaints without a reload.

## [1.5.0] - 2026-08-27

### Added

- Prefix search across a whole collection, by building the console's own
  query-builder URL.
- Actions open in a new tab; matched text is highlighted in results.

## [1.0.0] - 2026-08-27

### Added

- A filter box on every list panel: collections, documents and subcollections.
- A key filter for the fields of an open document.
- **Copy JSON**, which expands every collapsed map and array before copying.
