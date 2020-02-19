import React from "react";
import { ListItem, Left, View, Text, Body, Right } from "native-base";
import { ContentItem } from "react-native-spotify-remote";

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

  export default SpotifyContentListItem;