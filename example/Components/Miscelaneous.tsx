import React, { useState, useCallback, useContext } from "react";
import { ContentItem } from "react-native-spotify-remote";
import { Alert, ScrollView } from "react-native";
import { View, Button, Text } from "native-base";
import EnvVars from "./EnvVars";
import AppContext from "../AppContext";

const Miscelaneous: React.SFC = () => {
    const { onError, auth, remote, endSession } = useContext(AppContext);
    const [item, setItem] = useState<ContentItem>();

    const getContentItemForUri = useCallback(async () => {
        const retrievedItem = await remote.getContentItemForUri("spotify:playlist:37i9dQZF1DWXLeA8Omikj7");
        setItem(retrievedItem);
    }, []);

    const playItem = useCallback(async () => {
        if (item != undefined) {
            await remote.playItem(item);
        }
    }, [item])

    const playTrackInItem = useCallback(async (index: number) => {
        if (item != undefined) {
            await remote.playItemWithIndex(item, index);
        }
    }, [item]);

    const queueManyTracks = useCallback(async () => {
        const tracks = [
            "spotify:track:2dlEdDEmuQsrcXaAL3Znzi",
            "spotify:track:7Cuk8jsPPoNYQWXK9XRFvG",
            "spotify:track:0ofHAoxe9vBkTCp2UQIavz",
            "spotify:track:7ejK5qMqXciqGgMIqj0rFr",
            "spotify:track:5LYJ631w9ps5h9tdvac7yP",
            "spotify:track:5dRQUolXAVX3BbCiIxmSsf",
            "spotify:track:76798uYU1DhBRVWxSo1bhY",
            "spotify:track:7Ar4G7Ci11gpt6sfH9Cgz5",
            "spotify:track:5IMtdHjJ1OtkxbGe4zfUxQ"
        ];

        // Need to queue each track serially
        for (const track of tracks) {
            await remote.queueUri(track);
        }
        Alert.alert(`Queued ${tracks.length} tracks`);
    }, []);

    const getCrossfadeState = useCallback(async () => {
        try {
            const cfstate = await remote.getCrossfadeState();
            Alert.alert("Crossfade State", `
        Enabled: ${cfstate.enabled ? "Yes" : "No"}
        Duration: ${cfstate.duration} ms
        `
            )
        } catch (err) {
            onError(err);
        }
    }, []);

    return (
        <ScrollView >
            <View style={{ padding: 30 }}>
                {item == undefined ?
                    (
                        <Button onPress={() => getContentItemForUri()}>
                            <Text>Get Content Item For Uri</Text>
                        </Button>
                    )
                    :
                    (
                        <View style={{ display: 'flex', flexDirection: 'column', height: 220, justifyContent: 'space-around', borderColor: "gray", borderWidth: 1, padding: 5 }}>
                            <Text>title: {item.title}</Text>
                            <Text>subtitle: {item.subtitle}</Text>
                            <Text>uri: {item.uri}</Text>
                            <Text>id: {item.id}</Text>
                            <Button disabled={item == undefined} onPress={() => playItem()}>
                                <Text>Play {item.title}</Text>
                            </Button>
                            <Button disabled={item == undefined} onPress={() => playTrackInItem(5)}>
                                <Text>Play {item.title} (skip to 6th song) </Text>
                            </Button>
                        </View>
                    )
                }
                <Button style={{ marginVertical: 30 }} onPress={() => getCrossfadeState()}>
                    <Text>Get Crossfade State</Text>
                </Button>
                <Button style={{ marginBottom: 30 }} onPress={() => queueManyTracks()}>
                    <Text>Queue Many Tracks</Text>
                </Button>
                <Button danger style={{ marginBottom: 30 }} onPress={() => endSession()}>
                    <Text>End Session</Text>
                </Button>
                <EnvVars />
            </View>
        </ScrollView >
    )
}

export default Miscelaneous;