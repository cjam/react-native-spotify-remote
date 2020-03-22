# Contributing

Contributions are welcome in any form.  Fork the repo and issue a PR.  It's a pretty lean team ([me](https://github.com/cjam)) at the moment so I'm focusing on code over documentation.


The following is a guide mostly for me so next time I come back to this project I know how to work with it.

### Development

Developing this library is most easily done with the [Example Project](./example).  Since we need Spotify on the device to verify functionality, the recommended approach is to add UI to the main screen that exercises the API, making functionality easy to verify and debug.

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

If you're doing work on the `react-native-spotify-remote` package (i.e. modifying the api or Typescript), you'll need to update the package that is installed in the example app before using your changes.  

From `example/` run `yarn update-package`

This will build the package and reinstall it in the example app.

> NOTE: When doing this, it's very likely that you will need to restart the `example` packager/server.

### Updating Spotify iOS SDK

```sh
cd ./ios/external/SpotifySDK/ && git checkout v<tagged_version>
```
Then commit the change to the `SpotifySDK` folder.

### Publishing
Unfortunately, this package doesn't yet have Continuous Deployment setup:

To release a new version of the package:

- Bump version number in [package.json](./package.json) using [Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)
- Verify package contents `npm publish --dry-run`
- Commit all changes (i.e. new docs etc)
- Update [`Change Log`](./CHANGELOG.md) with release version and date
- Merge in changes
- Tag master with `v<version_number>` 
- `git checkout v<version_number>`
- run `npm publish`



