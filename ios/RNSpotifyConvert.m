
#import <React/RCTConvert.h>
#import "RNSpotifyConvert.h"
#import "NSArrayExtensions.h"

@implementation RNSpotifyConvert

+(id)ID:(id)obj
{
    if(obj == nil)
    {
        return [NSNull null];
    }
    return obj;
}

+(id)RNSpotifyError:(RNSpotifyRemoteError*)error
{
    if(error==nil)
    {
        return [NSNull null];
    }
    return error.reactObject;
}

+(id)NSError:(NSError*)error
{
    if(error==nil)
    {
        return [NSNull null];
    }
    return [self RNSpotifyError:[RNSpotifyRemoteError errorWithNSError:error]];
}

+(id)SPTAppRemoteCrossfadeState:(NSObject<SPTAppRemoteCrossfadeState> *)state{
    if(state == nil)
    {
        return [NSNull null];
    }
    return @{
        @"duration": [NSNumber numberWithInteger:state.duration],
        @"enabled": [NSNumber numberWithBool:state.enabled],
    };
}

+(id)SPTAppRemotePlayerState:(NSObject<SPTAppRemotePlayerState>*) state{
    if(state == nil)
    {
        return [NSNull null];
    }
    return @{
        @"track": [RNSpotifyConvert SPTAppRemoteTrack:state.track],
        @"playbackPosition": [NSNumber numberWithInteger:state.playbackPosition],
        @"playbackSpeed": [NSNumber numberWithFloat:state.playbackSpeed],
        @"paused": [NSNumber numberWithBool:state.isPaused],
        @"playbackRestrictions": [RNSpotifyConvert SPTAppRemotePlaybackRestrictions:state.playbackRestrictions],
        @"playbackOptions": [RNSpotifyConvert SPTAppRemotePlaybackOptions:state.playbackOptions]
    };
}

+(id)SPTAppRemotePlaybackRestrictions:(NSObject<SPTAppRemotePlaybackRestrictions>*) restrictions{
    if(restrictions == nil){
        return [NSNull null];
    }
    
    return @{
         @"canSkipNext": [NSNumber numberWithBool:restrictions.canSkipNext],
         @"canSkipPrevious": [NSNumber numberWithBool:restrictions.canSkipPrevious],
         @"canRepeatTrack": [NSNumber numberWithBool:restrictions.canRepeatTrack],
         @"canRepeatContext": [NSNumber numberWithBool:restrictions.canRepeatContext],
         @"canToggleShuffle": [NSNumber numberWithBool:restrictions.canToggleShuffle],
     };
}

+(id)SPTAppRemotePlaybackOptions:(NSObject<SPTAppRemotePlaybackOptions>*) options{
    if(options == nil){
        return [NSNull null];
    }
    return @{
      @"isShuffling": [NSNumber numberWithBool:options.isShuffling],
      @"repeatMode": [NSNumber numberWithUnsignedInteger:options.repeatMode],
    };
}


+(id)SPTAppRemoteTrack:(NSObject<SPTAppRemoteTrack>*) track{
    if(track == nil){
        return [NSNull null];
    }
    return @{
             @"name": track.name,
             @"uri":track.URI,
             @"duration":[NSNumber numberWithUnsignedInteger:track.duration],
             @"artist":[RNSpotifyConvert SPTAppRemoteArtist:track.artist],
             @"album":[RNSpotifyConvert SPTAppRemoteAlbum:track.album],
             @"saved":[NSNumber numberWithBool:track.saved],
             @"episode":[NSNumber numberWithBool:track.episode],
             @"podcast":[NSNumber numberWithBool:track.podcast],
    };
}

+(id)SPTAppRemoteArtist:(NSObject<SPTAppRemoteArtist>*) artist{
    if(artist == nil){
        return [NSNull null];
    }
    return @{
             @"name":artist.name,
             @"uri":artist.URI
    };
}

+(id)SPTAppRemoteAlbum:(NSObject<SPTAppRemoteAlbum>*) album{
    if(album == nil){
        return [NSNull null];
    }
    return @{
             @"name":album.name,
             @"uri":album.URI
    };
}


+(id)SPTAppRemoteContentItem:(NSObject<SPTAppRemoteContentItem> *) item{
    if(item == nil){
        return [NSNull null];
    }
    
    return @{
             @"title":item.title,
             @"subtitle":item.subtitle,
             @"id":item.identifier,
             @"uri":item.URI,
             @"availableOffline":[NSNumber numberWithBool:item.availableOffline],
             @"playable":[NSNumber numberWithBool:item.playable],
             @"container":[NSNumber numberWithBool:item.container],
             @"children":[RNSpotifyConvert SPTAppRemoteContentItems:item.children]
    };
}

+(id)SPTAppRemoteContentItems:(NSArray *) items{
    if(items == nil){
        return @[];
    }
    NSPredicate* conformsPredicate =[NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
        return [evaluatedObject conformsToProtocol:@protocol(SPTAppRemoteContentItem)];
    }];
    NSArray* json = [
        [items filteredArrayUsingPredicate: conformsPredicate]
         map:^id(id object) {
             return [RNSpotifyConvert SPTAppRemoteContentItem:object];
         }
    ];
    return json;
}


@end
