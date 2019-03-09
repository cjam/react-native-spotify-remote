
#import <Foundation/Foundation.h>
//#import <SpotifyAuthentication/SpotifyAuthentication.h>
//#import <SpotifyMetadata/SpotifyMetadata.h>
//#import <SpotifyAudioPlayback/SpotifyAudioPlayback.h>
#import <SpotifyiOS.h>
#import "RNSpotifyRemoteError.h"

@interface RNSpotifyConvert : NSObject

+(id)ID:(id)obj;
+(id)RNSpotifyError:(RNSpotifyRemoteError*)error;
+(id)NSError:(NSError*)error;
+(id)SPTAppRemotePlayerState:(NSObject<SPTAppRemotePlayerState>*) state;
+(id)SPTAppRemotePlaybackRestrictions:(NSObject<SPTAppRemotePlaybackRestrictions>*) restrictions;
+(id)SPTAppRemotePlaybackOptions:(NSObject<SPTAppRemotePlaybackOptions>*) options;
+(id)SPTAppRemoteTrack:(NSObject<SPTAppRemoteTrack> *) track;
+(id)SPTAppRemoteArtist:(NSObject<SPTAppRemoteArtist> *) artist;
+(id)SPTAppRemoteAlbum:(NSObject<SPTAppRemoteAlbum> *) album;
+(id)SPTAppRemoteContentItem:(NSObject<SPTAppRemoteContentItem> *) item;
+(id)SPTAppRemoteContentItems:(NSArray *) items;

@end
