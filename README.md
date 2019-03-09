
# Spotify for React Native

A react native module for the Spotify SDK

## Contributing / Opening Issues

If you would like to make a pull request, fork from and merge into the *dev* branch (or a feature branch) only.

Please do not open issues about getting the module to work unless you have tried using both the example app and the example token swap server. Please make sure you have tried running on the latest react-native version before submitting a bug.

## Install

To add the Spotify SDK to your project, cd into your project directory and run the following commands:
```bash
npm install --save rn-spotify-sdk
react-native link rn-spotify-sdk
react-native link react-native-events
```

Next, do the manual setup for each platform:

#### iOS
Manually add the frameworks from `node_modules/rn-spotify-sdk/ios/external/SpotifySDK` to *Linked Frameworks and Libraries* in your project settings. Then add `../node_modules/rn-spotify-sdk/ios/external/SpotifySDK` to *Framework Search Paths* in your project settings.

#### Android

Edit `android/build.gradle` and add `flatDir`

```
...
allprojects {
	repositories {
		mavenLocal()
		jcenter()
		maven {
			// All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
			url "$rootDir/../node_modules/react-native/android"
		}
		flatDir {
			dirs project(':rn-spotify-sdk').file('libs'), 'libs'
		}
	}
}
...
```

Edit `android/app/build.gradle` and add `packagingOptions`

```
...
buildTypes {
    release {
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
packagingOptions {
    pickFirst 'lib/armeabi-v7a/libgnustl_shared.so'
    pickFirst 'lib/x86/libgnustl_shared.so'
}
...
```

If you have issues linking the module, please check that gradle is updated to the latest version and that your project is synced.


## Additional notes

This module only works for Spotify Premium users.
