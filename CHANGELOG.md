# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

## [0.3.2] - 2020-05-17
### Fixed
- added some defaults for ApiConfig

### Added
- More documentation around setting up android project

## [0.3.1] - 2020-05-17 (pre-release)
### Fixed
- added some additional exports to `index.ts` to support missing typings

## [0.3.0] - 2020-05-16 (pre-release)
### Changed
 - `ApiConfig.scope` to `ApiConfig.scopes` which is now of type `ApiScope[]` and also aligns to the web api scopes
 - `ApiScope` enum values are now same as web api instead of bit flags
 - `PlayerState.paused` -> `PlayerState.isPaused` to align with Spotify's iOS/Android sdk's

### Added
 - Android Support! Big thanks to @YozhikM for the initial work on this
 - `PlaybackRestrictions.canSeek`
 - `SpotifyRemote.getChildrenOfItem` now has optional `options:GetChildrenItemsOptions` for android paging
 - `SpotifyAuth.authorize` to replace `SpotifyAuth.initialize` which will now return a session object instead of just a token

### Deprecated
- `SpotifyAuth.initialize` in favor of `SpotifyAuth.authorize`


## [0.2.2] - 2020-03-22
### Changed
- Removed logging on release builds [Issue #31](https://github.com/cjam/react-native-spotify-remote/issues/31)

## [0.2.1] - 2020-03-22
### Fixed
- Playing Playlist Item would throw exception on PlayerState update [Issue #35](https://github.com/cjam/react-native-spotify-remote/issues/35)
- Safer use of the remote apis [Issue #32](https://github.com/cjam/react-native-spotify-remote/issues/32)

## [0.2.0] - 2020-02-19
### Changed
- Spotify SDK from 1.2.0 to 1.2.2
- Example App to use an App Context so that components could be factored to separate files
### Added
- `ApiConfig` (Used to authenticate and initialize session with `SpotifyAuth`)
    - `PlayURI` - URI to play when authorizing ([Issue #29](https://github.com/cjam/react-native-spotify-remote/issues/29))
    - `showDialog` - Whether or not to show the auth dialog
- `SpotifyAuth`
    - `endSession()` - Ends current session
    - `getSession()` - Gets the current session object
- `SpotifySession` - Session Object Definition
- `SpotifyRemote`
    - `disconnect()` - Disconnects the Remote from Spotify
- [Feature Matrix](./README.md#Features) to Readme (Docs)
- Example of queuing many tracks
- Requirement of XCode 11

## [0.1.1] - 2020-01-21
### Fixed
- Missing SpotifyiOS headers / Framework [Issue #25](https://github.com/cjam/react-native-spotify-remote/issues/25)

## [0.1.0] - 2020-01-17
### Changed
- `getRecommendedContentItems` now takes `options` object instead of `ContentType`
- Example app to more fully exercise exposed functionality [Issue #20](https://github.com/cjam/react-native-spotify-remote/issues/20)
### Fixed
- playerStateChanged event not triggered [Issue #14](https://github.com/cjam/react-native-spotify-remote/issues/14)
### Added
- `playItem`
- `playItemWithIndex` for [Issue #15](https://github.com/cjam/react-native-spotify-remote/issues/15)
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