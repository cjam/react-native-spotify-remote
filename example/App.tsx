import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform, StyleSheet, View, FlatList, SafeAreaView, Alert } from 'react-native';
import { Button, Text, ListItem, Segment, Icon, Switch, Toast, Root, Tabs, Tab, Content, Left, Right, Body, ActionSheet } from 'native-base';
import { auth, remote, ApiConfig, ApiScope, SpotifyRemoteApi, PlayerState, RepeatMode, ContentItem } from 'react-native-spotify-remote';
import Slider from '@react-native-community/slider';
import { Duration } from 'luxon';

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URL,
  SPOTIFY_TOKEN_REFRESH_URL,
  SPOTIFY_TOKEN_SWAP_URL
} from 'react-native-dotenv';
import SpotifyRemote from 'react-native-spotify-remote/dist/SpotifyRemote';


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

const EnvVars: React.SFC = (props) => {
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

const ConnectButton: React.SFC<{ isConnected?: boolean, token?: string }> = ({
  isConnected = false,
  token
}) => {

  const handleClick = useCallback(() => {
    if (!isConnected && token != undefined) {
      remote.connect(token);
    } else {
      remote.isConnectedAsync().then((connected) => {
        Toast.show({
          text: connected ? "Connected!" : "Not Connected",
          type: connected ? "success" : "danger",
          position: "top"
        });
      })
    }
  }, [isConnected, token])

  return (
    <Button
      onPress={handleClick}
      danger={!isConnected}
      success={isConnected}
      full={true}
    >
      <Text>{isConnected ? "Connected" : "Disconnected"}</Text>
    </Button>
  )
}

const SpotifyContentListItem: React.SFC<{ onPress?: (item: ContentItem) => void, onLongPress?: (item: ContentItem) => void, item: ContentItem }> = ({
  item,
  onPress,
  onLongPress
}) => {
  const {
    title,
    subtitle,
    id,
    playable,
    uri,
    container,
    availableOffline,
    children: itemChildren = []
  } = item;

  return (
    <ListItem onPress={() => onPress && onPress(item)} onLongPress={() => onLongPress && onLongPress(item)}>
      <Left>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", justifyContent: 'space-between', maxWidth: 150 }}>
          <Text>{title}</Text>
          <Text style={{ width: "100%", marginTop: 5, fontSize: 12, color: "gray" }}>{subtitle}</Text>
        </View>
      </Left>
      <Body>
        <Text>{availableOffline && "Offline"}</Text>
      </Body>
      <Right>
        <Text>{itemChildren.length}</Text>
      </Right>
    </ListItem>
  )
}

const SpotifyContent: React.SFC<{ isConnected: boolean, onError: (err: Error) => void }> = ({ isConnected, onError }) => {
  const [parentItems, setParentItems] = useState<ContentItem[]>([]);
  const [recommended, setRecommended] = useState<boolean>(true);

  // The current parent is the last parent if there are any
  const currentItem = parentItems[parentItems.length - 1];

  const back = useCallback(() => {
    if (parentItems.length === 1) {
      return;
    } else {
      const newParents = [...parentItems];
      newParents.pop();
      setParentItems(newParents);
    }
  }, [parentItems]);

  const pushParent = useCallback(async (nextParent: ContentItem) => {
    try {
      if (nextParent.container && nextParent.children == undefined || nextParent.children.length === 0) {
        const loadedChildren = await remote.getChildrenOfItem(nextParent);
        const newParent = {
          ...nextParent,
          children: loadedChildren
        }
        setParentItems([...parentItems, newParent]);
      } else {
        setParentItems([...parentItems, nextParent]);
      }
    } catch (err) {
      onError(err);
    }
  }, [parentItems])

  const fetchItems = async () => {
    try {
      let retrieved: ContentItem[] = [];
      if (recommended) {
        retrieved = await remote.getRecommendedContentItems({ type: "default", flatten: false });
      } else {
        retrieved = await remote.getRootContentItems("default");
      }

      const rootItem: ContentItem = {
        title: "",
        availableOffline: false,
        container: true,
        id: "",
        playable: false,
        subtitle: "",
        uri: "",
        children: retrieved
      }
      setParentItems([rootItem]);
    } catch (err) {
      onError(err);
    }
  };

  const showItemActions = useCallback((item: ContentItem) => {
    ActionSheet.show({
      options: [
        { text: 'Play' },
        { text: 'Queue' },
        { text: 'Cancel' }
      ],
      cancelButtonIndex: 2,
      title: item.title
    }, async (index) => {
      try {
        switch (index) {
          case 0:
            await remote.playUri(item.uri);
            break;
          case 1:
            await remote.queueUri(item.uri);
            break;
          default:
            break;
        }
      } catch (err) {
        onError(err);
      }

    })
  }, []);

  const selectContentItem = useCallback(async (item: ContentItem) => {
    if (item.container || !item.uri.toLowerCase().includes(":track:")) {
      await pushParent(item);
    } else if (item.playable) {
      await showItemActions(item);
    }
  }, [pushParent])

  useEffect(() => {
    if (isConnected) {
      fetchItems();
    }
  }, [isConnected, recommended]);

  return (
    <View>
      {currentItem && (
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <View style={{ borderBottomColor: "gray", borderBottomWidth: 1, height: "9%" }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Button
                disabled={parentItems.length === 1}
                bordered
                small
                style={{ margin: 5 }}
                onPress={() => back()}
              >
                <Text>Back</Text>
              </Button>
              <Text style={{ flex: 1, fontSize: 20 }}>{currentItem.title}</Text>
            </View>
          </View>
          <View style={{ height: "84%" }}>
            <FlatList
              data={currentItem.children}
              renderItem={({ item }) => <SpotifyContentListItem
                onPress={selectContentItem}
                onLongPress={(it) => {
                  if (it.playable) {
                    showItemActions(it);
                  }
                }}
                item={item}
              />}
            />
          </View>
          <View style={{ display: 'flex', height: "7%", flexDirection: 'row', alignContent: "stretch" }}>
            <Button dark style={{ flex: 1, height: "100%" }} full bordered={!recommended} onPress={() => setRecommended(true)}>
              <Text>Recommended</Text>
            </Button>
            <Button dark style={{ flex: 1, height: "100%" }} full bordered={recommended} onPress={() => setRecommended(false)}>
              <Text>Root</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}

const TransportControls: React.SFC<{ playerState?: PlayerState, onError: (err: Error) => void }> = ({
  playerState: {
    paused = false,
    playbackOptions: {
      isShuffling = false,
      repeatMode = RepeatMode.Off
    } = {},
    playbackPosition = 0,
    track: {
      duration = 0,
      name = "",
      artist: {
        name: artistName = ""
      } = {}
    } = {}
  } = {},
  onError
}) => {
  const buttons = [
    {
      name: '⏮',
      action: async () => await remote.skipToPrevious(),
    },
    {
      name: '⏭',
      action: async () => await remote.skipToNext(),
    }
  ];
  // Put play/pause into the middle of the array
  buttons.splice(buttons.length / 2, 0, paused ?
    {
      name: "▶️",
      action: async () => await remote.resume()
    }
    :
    {
      name: "⏸",
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
          {buttons.map(({ name, action }, index) => (
            <Button
              key={`${index}`}
              onPress={() => action().catch(onError)}
              transparent
              style={{
                width: `${(100 / buttons.length)}%`,
                height: 60,
                backgroundColor: "#FFF",
                borderLeftWidth: index === 0 ? 1 : 0,
              }}
            >
              <Text style={{ fontSize: 40, textAlign: "center", width: "100%" }}>{name}</Text>
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
            <Switch value={isShuffling} onValueChange={(val) => {
              remote.setShuffling(val)
            }}
            />
            <Text>Shuffle</Text>
          </View>
          <Button
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
              text: pstate.paused ? "Spotify Paused" : `Currently playing "${pstate.track.name}"`,
              position: "top",
              duration: 2000,
              type: "success"
            });
          });
        }}
        info style={{ alignItems: "center" }}>
        <Text style={[{ width: "100%" }, styles.textCentered]}>Refresh</Text>
      </Button>
    </View>
  )
}

const Miscelaneous: React.SFC<{ onError: (err: Error) => void }> = ({ onError }) => {
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
    for(const track of tracks){
      await remote.queueUri(track);
    }
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
  }, [])

  return (
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
            <Text>{item.title}</Text>
            <Text>{item.subtitle}</Text>
            <Text>{item.uri}</Text>
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
      <EnvVars />
    </View >
  )
}

interface AppProps {
}


const App: React.FunctionComponent<AppProps> = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>();
  const [error, setError] = useState<string>();
  const [token, setToken] = useState<string>();

  const handleError = useCallback((err: Error) => {
    setError(err.message)
  }, []);

  // Setup our connect async function so that it can be called
  // from useEffect (i.e. onComponentMount)
  const connect = () => {
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

    const onPlayerStateChanged = (state: PlayerState) => {
      setPlayerState(state);
    }

    SpotifyRemote.isConnectedAsync().then(currentlyConnected => {
      setIsConnected(currentlyConnected);
    });


    // Add event listeners for connection / disconnection
    remote.on("remoteConnected", onConnected)
      .on("remoteDisconnected", onDisconnected)
      .on("playerStateChanged", onPlayerStateChanged);


    auth.initialize(config).then(newToken => {
      return remote.connect(newToken).then(() =>
        setToken(newToken)
      );
    }).catch(handleError);

    // Return our subscription cleanup function
    return () => {
      remote.off("remoteConnected", onConnected)
        .off("remoteDisconnected", onDisconnected)
        .off("playerStateChanged", onPlayerStateChanged);
    }
  }

  useEffect(() => {
    return connect();
  }, []);

  useEffect(() => {
    if (isConnected) {
      remote.getPlayerState().then(pstate => {
        setPlayerState(pstate);
      }).catch(handleError);
    }
  }, [isConnected]);

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <Root>
        <View style={styles.container}>
          <ConnectButton isConnected={isConnected} token={token} />
          <Tabs initialPage={1}>
            <Tab heading="Now Playing" tabStyle={{ padding: 10 }}>
              <TransportControls onError={handleError} playerState={playerState} />
            </Tab>
            <Tab heading="Songs">
              <SpotifyContent
                isConnected={isConnected}
                onError={handleError}
              />
            </Tab>
            <Tab heading="Misc">
              <Miscelaneous onError={handleError} />
            </Tab>
          </Tabs>
          {error && (
            <Text onPress={() => setError(undefined)} style={styles.error}>{error}</Text>
          )}
        </View>
      </Root>
    </SafeAreaView>
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
    height: "100%",
    width: "100%",
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
  transportContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    height: "100%",
    width: "100%",
    backgroundColor: "#EEE",
    borderColor: "#DDD",
    borderWidth: 1,
    paddingVertical: 5
  },
  textDuration: {
    width: 40,
  },
  textCentered: {
    textAlign: "center"
  },
  debugBorder: {
    borderWidth: 1,
    borderColor: 'red'
  }
});