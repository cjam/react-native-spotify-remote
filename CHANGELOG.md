# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2020-01-17
### Changed
- `getRecommendedContentItems` now takes `options` object instead of `ContentType`
- Example app to more fully exercise exposed functionality [#20](https://github.com/cjam/react-native-spotify-remote/issues/20)
### Fixed
- playerStateChanged event not triggered [#14](https://github.com/cjam/react-native-spotify-remote/issues/14)
### Added
- `playItem`
- `playItemWithIndex` for [#15](https://github.com/cjam/react-native-spotify-remote/issues/15)
- `getRootContentItems`
- `getContentItemForUri`
- `getCrossfadeState`
- `Track` Properties
    - `saved`
    - `episode`
    - `podcast`
- `ContentItem` Properties
    - `availableOffline`
    - `children`

## [0.0.8] - 2019-12-14
### Fixed 
- #12: 'React/RCTConvert.h' file not found
### Added
- Troubleshooting section to readme

## [0.0.7] - 2019-12-13
### Fixed
- Error in Cocoapod install docs

## [0.0.6] - 2019-12-13
### Added
- Cocoapod support
- RN >= 0.60 support

## [0.0.5] - 2019-03-16
### Fixed
- Usage in README as it did not work

## [0.0.4] - 2019-03-16
### Added
- Example Server
- Example Project

## [0.0.2] - 2019-03-13
### Added
- Surfacing errors on iOS Authentication flow
### Changed
- Updates to API Docs

## [0.0.1] - 2019-03-13
### Added
- iOS Auth Support
- iOS App Remote
- Minor API Documentation