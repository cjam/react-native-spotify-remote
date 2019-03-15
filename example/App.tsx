/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 * 
 * @format
 */

import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { auth, remote, ApiConfig, ApiScope } from 'react-native-spotify-remote';

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URL,
  SPOTIFY_TOKEN_REFRESH_URL,
  SPOTIFY_TOKEN_SWAP_URL
} from 'react-native-dotenv';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



interface AppProps {
}


const App: React.FunctionComponent<AppProps> = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>();

  // Setup our connect async function so that it can be called
  // from useEffect (i.e. onComponentMount)
  const connect = async () => {
    const config: ApiConfig = {
      clientID: SPOTIFY_CLIENT_ID,
      redirectURL: SPOTIFY_REDIRECT_URL,
      tokenRefreshURL: SPOTIFY_TOKEN_REFRESH_URL,
      tokenSwapURL: SPOTIFY_TOKEN_SWAP_URL,
      scope: ApiScope.AppRemoteControlScope // Can add more scopes here as flags i.e. Scope1 | Scope2 
    }

    // Store handlers in variables so that we can remove them
    const onConnected = () => {
      setIsConnected(true);
    }
    const onDisconnected = () => {
      setIsConnected(false);
    }
    // Add event listeners for connection / disconnection
    remote.on("remoteConnected", onConnected)
      .on("remoteDisconnected", onDisconnected);

    try {
      const token = await auth.initialize(config);
      await remote.connect(token);
    } catch (err) {
      setError(err.message);
    }    

    // Return our subscription cleanup function
    return () => {
      remote.off("remoteConnected", onConnected)
        .off("remoteDisconnected", onDisconnected);
    }
  }

  useEffect(() => {
    connect();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native!</Text>
      <Text style={styles.instructions}>{instructions}</Text>
      <Text style={styles.instructions}>{SPOTIFY_REDIRECT_URL}</Text>
      {isConnected === true ?
        <Text style={styles.connected}>Connected to Spotify!</Text>
        : <Text>Not Connected to Spotify!</Text>

      }
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  error:{
    color:"#AA0000",
    borderColor:"#AA0000",
    borderWidth:2,
    fontSize:18,
    padding:10,
    margin:10,
    marginTop:20
  },
  connected: {
    color: "#00AA00"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});