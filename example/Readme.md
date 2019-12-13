# React Native Spotify Remote Example Project

This project was bootstrapped using the following command:

```sh
react-native init MyAwesomeProject --template typescript
```

Which came from https://facebook.github.io/react-native/blog/2018/05/07/using-typescript-with-react-native.


## Getting Started

### 0: Install Dependencies
Run `yarn install` in this directory.

### 1: ENV File

I've also added `react-native-dotenv` for easier configuration.  In order to configure this app you'll need to create a `.env` file in this root directory with the following:

```env
SPOTIFY_CLIENT_ID="client_id_from_spotify_dashboard"
SPOTIFY_REDIRECT_URL="redirect_uri_registered_in_spotify_dashboard"
SPOTIFY_TOKEN_REFRESH_URL="http://{MACHINE_IP_ADDRESS}:3001/refresh"
SPOTIFY_TOKEN_SWAP_URL="http://{MACHINE_IP_ADDRESS}:3001/swap"
```

> Note 1: The last two entries define the auth server endpoints.  You can run the [example auth server](../example-server/README.md) for this purpose.

> Note 2: The `SPOTIFY_REDIRECT_URI` needs to be both registered with your app on the Spotify Dashboard and also needs to be supported by your app.  Instructions for doing this can be found on the [Spotify iOS Quickstart](https://developer.spotify.com/documentation/ios/quick-start/#setup-the-ios-sdk) in the **► Configure Info.plist** section

### 2. Run Server
You will need to have the [Example Server](../example-server/README.md) running before your app starts up.

### 3:  Start XCode Build
Open up the `project.pbxproj` in XCode and build it for your phone (note you will need to have Spotify installed on your phone). 
> This should also start the react native packager as part of the build process if it isn't already running
