import React, { useState, useContext, useCallback } from 'react';
import { View, Button, Text, Toast } from 'native-base';
import styles from '../styles';
import AppContext from '../AppContext';
import { Alert } from 'react-native';

const ConnectButton: React.SFC = () => {
    const { isConnected, endSession, token, onError, remote } = useContext(AppContext)

    const handleClick = useCallback(() => {
        if (!isConnected && token != undefined) {
            remote.connect(token).catch((e) => {
                // Usually if we can't connect, its because
                // spotify has been backgrounded and we need to 
                // reauth to bring it back
                endSession();
            });
        } else {
            remote.isConnectedAsync().then((connected) => {
                Toast.show({
                    text: connected ? "Connected!" : "Not Connected",
                    type: connected ? "success" : "danger",
                    position: "top"
                });
            }).catch(onError)
        }
    }, [isConnected, token])

    const handleLongPress = useCallback(()=>{
        Alert.alert(
            "Disonnect from Spotify?",
            "Are you sure you want to disconnect?",
            [
                {
                    style:"cancel",
                    text:"Cancel",
                },
                {
                    style:"destructive",
                    text:"Disconnect",
                    onPress:()=>{
                        remote.disconnect().then(()=>{
                            Toast.show({
                                text:"Disconnected!",
                                type:"warning",
                                position:"top"
                            })
                        })
                    }
                }
            ],
        ) 
    },[]);

    return (
        <Button
            onPress={handleClick}
            onLongPress={handleLongPress}
            danger={!isConnected}
            success={isConnected}
            full={true}
        >
            <Text>{isConnected ? "Connected" : "Disconnected"}</Text>
        </Button>
    )
}

export default ConnectButton;