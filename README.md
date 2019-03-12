
# Spotify App Remote for React Native

A react native module for the Spotify Remote SDK.

>## ⚠️ Work In Progress ⚠️

>## Currently Only Implemented for iOS 

[Documentation](https://cjam.github.io/react-native-spotify-remote/index.html)

## Contributing / Opening Issues

If you would like to make a pull request, fork from and merge into the *dev* branch (or a feature branch) only.

Please do not open issues about getting the module to work unless you have tried using both the example app and the example token swap server. Please make sure you have tried running on the latest react-native version before submitting a bug.

## Install

To add the Spotify Remote SDK to your project, cd into your project directory and run the following commands:
```bash
npm install --save react-native-spotify-remote
react-native link react-native-spotify-remote
react-native link react-native-events
```

Next, do the manual setup for each platform:

#### iOS
Manually add the frameworks from `node_modules/react-native-spotify-remote/ios/external/SpotifySDK` to *Linked Frameworks and Libraries* in your project settings. Then add `../node_modules/react-native-spotify-remote/ios/external/SpotifySDK` to *Framework Search Paths* in your project settings.

<!-- 
#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNSpotifyRemotePackage;` to the imports at the top of the file
  - Add `new RNSpotifyRemotePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-spotify-remote'
  	project(':react-native-spotify-remote').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-spotify-remote/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-spotify-remote')
  	```

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
			dirs project(':react-native-spotify-remote').file('libs'), 'libs'
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

If you have issues linking the module, please check that gradle is updated to the latest version and that your project is synced. -->


## Additional notes

This module only works for Spotify Premium users.
