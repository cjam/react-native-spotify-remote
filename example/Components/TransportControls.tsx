import React, { useState, useContext, useCallback } from 'react';
import { View, Button, Text, Toast, Switch, Segment, Icon } from 'native-base';
import styles from '../styles';
import AppContext from '../AppContext';
import { RepeatMode } from 'react-native-spotify-remote';
import Slider from '@react-native-community/slider';
import { Duration } from 'luxon';

/**
 * Converts a duration (in ms) to a human readable string
 *
 * @export
 * @param {number} durationMs - Duration in Milliseconds
 * @returns
 */
export function displayDuration(durationMs: number) {
    const d = Duration.fromMillis(durationMs);
    return d.hours > 0 ?
      d.toFormat("h:mm:ss")
      : d.toFormat("m:ss");
  }


const TransportControls: React.SFC = () => {
    const {
        playerState: {
            isPaused = false,
            playbackOptions: {
                isShuffling = false,
                repeatMode = RepeatMode.Off
            } = {},
            playbackPosition = 0,
            playbackRestrictions:{
                canRepeatContext = true,
                canRepeatTrack = true,
                canSkipNext = true,
                canSkipPrevious = true,
                canToggleShuffle = true
            } = {},
            track: {
                duration = 0,
                name = "",
                artist: {
                    name: artistName = ""
                } = {}
            } = {}
        } = {},
        onError,
        remote
    } = useContext(AppContext);
    const buttons = [
        {
            content: <Icon name="md-skip-backward"/>,
            action: async () => await remote.skipToPrevious(),
        },
        {
            content: <Icon name="md-skip-forward"/>,
            action: async () => await remote.skipToNext(),
        }
    ];
    // Put play/pause into the middle of the array
    buttons.splice(buttons.length / 2, 0, isPaused ?
        {
            content: <Icon name="play"/>,
            action: async () => await remote.resume()
        }
        :
        {
            content: <Icon name="pause"/>,
            action: async () => await remote.pause()
        }
    );

    return (
        <View style={styles.transportContainer}>
            <View style={{ display: "flex", alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "500" }}>{name}</Text>
                {artistName !== "" && <Text style={{ fontSize: 17, fontWeight: "300" }}>{artistName}</Text>}
            </View>

            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.textDuration, styles.textCentered]}>{displayDuration(playbackPosition)}</Text>
                <Slider
                    minimumValue={0}
                    maximumValue={duration}
                    value={playbackPosition}
                    onSlidingComplete={(val) => {
                        remote.seek(Math.round(val));
                    }}
                    style={{ flex: 1 }}
                />
                <Text style={[styles.textDuration, styles.textCentered]}>{displayDuration(duration)}</Text>
            </View>

            <View>
                <Segment>
                    {buttons.map(({ content, action }, index) => (
                        <Button
                            key={`${index}`}
                            onPress={() => action().catch(onError)}
                            transparent
                            style={{
                                width: `${(100 / buttons.length)}%`,
                                height: 60,
                                backgroundColor: "#FFF",
                                borderLeftWidth: index === 0 ? 1 : 0,
                                display:'flex',
                                justifyContent:'center'
                            }}
                        >
                            {content}
                        </Button>
                    ))}
                </Segment>
                <View style={{
                    marginVertical: 30,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: "space-between",
                        height: 50
                    }}>
                        <Switch
                         disabled={!canToggleShuffle}
                         value={isShuffling} 
                         onValueChange={(val) => {
                            remote.setShuffling(val)
                        }}
                        />
                        <Text>Shuffle</Text>
                    </View>
                    <Button
                        disabled={!canRepeatContext && !canRepeatTrack}
                        onPress={() => {
                            const newMode = (repeatMode + 1) % 3;
                            remote.setRepeatMode(newMode);
                        }}
                        rounded
                    >
                        <Text style={{ width: 150, textAlign: "center" }}>
                            {repeatMode === RepeatMode.Off && "Repeat Off"}
                            {repeatMode === RepeatMode.Track && "Repeat One"}
                            {repeatMode === RepeatMode.Context && "Repeat Context"}
                        </Text>
                    </Button>
                </View>
            </View>

            <Button
                onPress={() => {
                    remote.getPlayerState().then((pstate) => {
                        Toast.show({
                            text: pstate.isPaused ? "Spotify Paused" : `Currently playing "${pstate.track.name}"`,
                            position: "top",
                            duration: 2000,
                            type: "warning",
                        });
                    });
                }}
                info style={{ alignItems: "center" }}>
                <Text style={[{ width: "100%" }, styles.textCentered]}>Refresh</Text>
            </Button>
        </View>
    )
}

export default TransportControls;