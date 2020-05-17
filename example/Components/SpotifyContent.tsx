import React, { useState, useCallback, useEffect, useContext } from "react";
import { ContentItem, remote } from "react-native-spotify-remote";
import { ActionSheet, View, Button, Text } from "native-base";
import { FlatList } from "react-native";
import SpotifyContentListItem from "./SpotifyContentListItem";
import AppContext from "../AppContext";

const SpotifyContent: React.SFC = () => {
  const { isConnected, onError } = useContext(AppContext)
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
    const cancelOption = { text: 'Cancel', action: () => { } };
    const actionOptions = [
      { text: 'Play Uri', action: () => remote.playUri(item.uri) },
      { text: 'Queue Uri', action: () => remote.queueUri(item.uri) },
      { text: 'Play Item', action: () => remote.playItem(item) },
    ]

    if (item.uri.includes("spotify:playlist:") || item.uri.includes("spotify:album:")) {
      actionOptions.push({
        text: 'Play 4th track in playlist',
        action: () => remote.playItemWithIndex(item, 3)
      });
    }

    ActionSheet.show({
      options: [
        ...actionOptions,
        cancelOption
      ],
      cancelButtonIndex: actionOptions.findIndex(({text})=>text===cancelOption.text),
      title: item.title
    }, async (index) => {
      try {
        const chosenOption = actionOptions[index];
        if(chosenOption != undefined){
          await chosenOption.action();
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


export default SpotifyContent;