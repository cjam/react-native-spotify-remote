import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, FlatList, Alert } from 'react-native';
import { Button, Text } from 'native-base';
import { auth, remote, ApiConfig, ApiScope, SpotifyRemoteApi } from 'react-native-spotify-remote';

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


const SpotifyStatus = (props: { isConnected: boolean }) => {
  const { isConnected } = props;
  return isConnected ? (
    <Text style={styles.connected}>Connected to Spotify!</Text>
  )
    : (
      <Text style={styles.disconnected}>Not Connected to Spotify!</Text>
    )
}

const SpotifyControls = (props: { isConnected: boolean,onError:(err:Error)=>void }) => {
  const { isConnected, onError } = props;

  const actions = [
    {
      name:"Play Track",
      action: async()=>{
        await remote.playUri("spotify:track:5ckVDfifdJnKEabvjojde4");
      }
    },
    {
      name: "Play Epic Track",
      action: async () =>{
         await remote.playUri("spotify:track:6IA8E2Q5ttcpbuahIejO74");
         await remote.seek(58000);
      }
    },
    {
      name: "Pause",
      action: async () => await remote.pause()
    }
  ]

  return (
    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', width: "100%", margin: 10, padding: 10 }}>
      {actions.map(({ name, action }) => (
        <Button 
        disabled={!isConnected} 
        key={name} 
        full primary 
        style={{ margin: 2, height: 70, opacity: isConnected ? 1.0 : 0.3, backgroundColor: isConnected ? undefined : 'gray' }}
        onPress={async ()=>{
          try{
            await action();
          }catch(err){
            onError && onError(err);
          }
        }}
        >
          <Text>{name}</Text>
        </Button>
      ))}
    </View>
  );
}


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
      <Text style={styles.welcome}>Welcome to RN Spotify SDK Example!</Text>
      <Text style={styles.instructions}>{instructions}</Text>
      <Text style={styles.instructions}>Auth Redirect Url: {SPOTIFY_REDIRECT_URL}</Text>
      <Text style={styles.instructions}>Token Refresh URL: {SPOTIFY_TOKEN_REFRESH_URL}</Text>
      <Text style={styles.instructions}>Token Swap Url: {SPOTIFY_TOKEN_SWAP_URL}</Text>
      <SpotifyStatus isConnected={isConnected} />
      <SpotifyControls isConnected={isConnected} onError={(err)=>setError(err.message)} />
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  actionButton: {
    borderColor: "#0000BB",
    borderWidth: 2,
  },
  error: {
    color: "#AA0000",
    borderColor: "#AA0000",
    borderWidth: 2,
    fontSize: 18,
    padding: 10,
    margin: 10,
    marginTop: 20
  },
  connected: {
    color: "#00AA00",
    fontSize: 16,
  },
  disconnected: {
    color: "#880000",
    fontSize: 16
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