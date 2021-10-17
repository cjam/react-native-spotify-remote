# Contributing

Contributions are welcome in any form. Fork the repo and issue a PR. It's a pretty lean team ([me](https://github.com/cjam)) at the moment so I'm focusing on code over documentation.

The following is a guide mostly for me so next time I come back to this project I know how to work with it.

### Development

Developing this library is most easily done with the [Example Project](./example). Since we need Spotify on the device to verify functionality, the recommended approach is to add UI to the main screen that exercises the API, making functionality easy to verify and debug.

In order for the example app to function correctly, there are a few things that need to be setup:

#### Install Dependencies

You must run `yarn` in:

- repo root
- `example/`
- `example-server/`

You must run `pod install` in `example/ios/`

#### Example Server Environment

- Need a `.env` file in the root of this folder with the following contents:

```env
SPOTIFY_CLIENT_ID="<Your_Client_App_ID>"
SPOTIFY_REDIRECT_URL="example://spotify-login-callback"
SPOTIFY_TOKEN_REFRESH_URL="http://<Your_Computer_IP_Address>/refresh"
SPOTIFY_TOKEN_SWAP_URL="http://<Your_Computer_IP_Address>:3001/swap"
```

#### Run Example

From repo root run `yarn example`

#### Updating `react-native-spotify-remote` in Example

Changes in the `react-native-spotify-remote` package (i.e. modifying the api or Typescript) should be automatically reloaded within the example app.

### Updating External Spotify SDK's

1. Update SDKS
   #### Update Both SDK's to latest
   ```sh
      git submodule update --remote --merge
   ```
   **OR**
   #### Update One SDK to specific commit
   ```sh
   cd ./ios/external/SpotifySDK/ && git checkout v<tagged_version>
   ```
2. Update badges in [Readme](./README)

   - Update the version in the Badge
   - Update the links to the correct commit

3. Commit changes

### Publishing

Unfortunately, this package doesn't yet have Continuous Deployment setup but it does have an automated release script.

To release a new version of the package:

- Make sure the _Unreleased_ section in [Changelog](./CHANGELOG) has been updated with changes
- Update any contributors (see below for adding contributors)
- Make sure all changes have been committed
- run `yarn release-it` and follow instructions

### Adding Contributors

This repo uses the [all contributors cli](https://allcontributors.org/docs/en/cli/usage) to maintain contributor lists in the readme.

- Finding missing ones can be done via

`yarn all-contributors check` (isn't super reliable)

- Add contributor
  `yarn all-contributors add`

- Generate Readme
  `yarn all-contributors generate`
