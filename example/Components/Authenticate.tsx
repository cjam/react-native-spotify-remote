import React, { useState, useContext, useCallback } from 'react';
import { View, Button, Text, Toast, Switch } from 'native-base';
import styles from '../styles';
import AppContext from '../AppContext';

const Authenticate: React.SFC = () => {
    const { isConnected, token, onError, remote, authenticate } = useContext(AppContext)
    const [showDialog, setShowDialog] = useState(false);
    const [autoConnect, setAutoConnect] = useState(true);

    const handleConnect = useCallback((playURI?:string) => {
        authenticate({
            showDialog,
            playURI
        });
    }, [showDialog, token])
    return (
        <View style={{ height: 300, display: "flex", justifyContent: "space-evenly", flexDirection: "column" }}>
            <View>
                <Text style={{fontSize:28, textAlign:"center"}}>Connect To Spotify</Text>
            </View>
            <View style={{display:'flex',flexDirection:"row",justifyContent:'center'}}>
                <Text>Show Auth Dialog:</Text>
                <Switch value={showDialog} onValueChange={setShowDialog} />
            </View>
            <Button onPress={() => handleConnect()}>
                <Text>Authenticate Silently</Text>
            </Button>
            <Button onPress={() => handleConnect("spotify:track:5BYWuQEiyb6bxJGWIvsnpF")}>
                <Text>Auth and Play</Text>
            </Button>
            <Button onPress={() => handleConnect("")}>
                <Text>Auth and Resume Playback</Text>
            </Button>
        </View>
    )
}

export default Authenticate;