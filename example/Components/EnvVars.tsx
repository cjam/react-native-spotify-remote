import React, { useState } from 'react';
import { View, Button, Text } from 'native-base';
import { SPOTIFY_REDIRECT_URL, SPOTIFY_TOKEN_REFRESH_URL, SPOTIFY_TOKEN_SWAP_URL } from 'react-native-dotenv';
import styles from '../styles';

export default function EnvVars () {
    const [show, setShow] = useState(false);
    return (
      <View>
        <Button onPress={() => setShow(!show)}>
          <Text>Environment Variables</Text>
        </Button>
        {show && (
          <View>
            <Text style={styles.welcome}>App .env Variables</Text>
            <Text style={styles.instructions}>Auth Redirect Url: {SPOTIFY_REDIRECT_URL}</Text>
            <Text style={styles.instructions}>Token Refresh URL: {SPOTIFY_TOKEN_REFRESH_URL}</Text>
            <Text style={styles.instructions}>Token Swap Url: {SPOTIFY_TOKEN_SWAP_URL}</Text>
          </View>
        )}
      </View>
    )
}
