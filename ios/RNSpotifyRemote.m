
#import "RNSpotifyRemote.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTConvert.h>
#import <SpotifyiOS.h>
#import "RNSpotifyConvert.h"
#import "RNSpotifyItem.h"
#import "RNSpotifyError.h"
#import "RNSpotifyCompletion.h"
#import "RNSpotifySubscriptionCallback.h"
#import "RNSpotifyAuth.h"
#define SPOTIFY_API_BASE_URL @"https://api.spotify.com/"
#define SPOTIFY_API_URL(endpoint) [NSURL URLWithString:NSString_concat(SPOTIFY_API_BASE_URL, endpoint)]

static NSString * const EventNamePlayerStateChanged = @"playerStateChanged";
static NSString * const EventNameRemoteDisconnected = @"remoteDisconnected";
static NSString * const EventNameRemoteConnected = @"remoteConnected";

// Static Singleton instance
static RNSpotifyRemote *sharedInstance = nil;

@interface RNSpotifyRemote() <SPTAppRemoteDelegate,SPTAppRemotePlayerStateDelegate>
{
    BOOL _isConnecting;
    NSString* _accessToken;

    NSMutableArray<RNSpotifyCompletion*>* _appRemoteCallbacks;
    NSMutableDictionary<NSString*,NSNumber*>* _eventSubscriptions;
    NSDictionary<NSString*,RNSpotifySubscriptionCallback*>* _eventSubscriptionCallbacks;
    
    SPTAppRemote *_appRemote;
}
- (void)initializeAppRemote:(NSString*)accessToken completionCallback:(RNSpotifyCompletion*)completion;
- (void)handleEventSubscriptions;
@end

@implementation RNSpotifyRemote

@synthesize bridge = _bridge;

#pragma mark Singleton Methods

-(id)init
{
    // This is to hopefully maintain the singleton pattern within our React App.
    // Since ReactNative is the one allocating and initializing our instance,
    // we need to store the instance within the sharedInstance otherwise we'll
    // end up with a different one when calling shared instance statically
    if(sharedInstance == nil){
        if(self = [super init]){
            NSLog(@"RNSpotify Initialized");
            _isConnecting=NO;
            _appRemoteCallbacks = [NSMutableArray array];
            
            _appRemote = nil;
            _eventSubscriptions = @{}.mutableCopy;
            _eventSubscriptionCallbacks = [self initializeEventSubscribers];
        }
        static dispatch_once_t once;
        dispatch_once(&once, ^{
            sharedInstance = self;
        });
    }
    return sharedInstance;
}

- (NSDictionary*)initializeEventSubscribers{
    return @{
      EventNamePlayerStateChanged: [RNSpotifySubscriptionCallback subscriber:^{
          if(self->_appRemote != nil && self->_appRemote.playerAPI != nil){
              self->_appRemote.playerAPI.delegate = self;
              RCTExecuteOnMainQueue(^{
                  [self->_appRemote.playerAPI subscribeToPlayerState:^(id  _Nullable result, NSError * _Nullable error) {
                      // todo: figure out what to do if there is an error
                      if(error != nil){
                          NSLog(@"Couldn't Subscribe from PlayerStateChanges");
                      }else{
                          NSLog(@"Subscribed to PlayerStateChanges");
                      }
                  }];
              });
          }
      } unsubscriber:^{
          if(self->_appRemote != nil && self->_appRemote.playerAPI != nil){
              RCTExecuteOnMainQueue(^{
                  [self->_appRemote.playerAPI unsubscribeToPlayerState:^(id  _Nullable result, NSError * _Nullable error) {
                      // todo: figure out what to do if there is an error
                      if(error != nil){
                          NSLog(@"Couldn't Unsubscribe from PlayerStateChanges");
                      }else{
                          NSLog(@"Unsubscribed to PlayerStateChanges");
                      }
                  }];
              });
          }
      }]
    };
}

- (void)initializeAppRemote:(NSString*)accessToken completionCallback:(RNSpotifyCompletion*)completion{
    _appRemote = [[SPTAppRemote alloc] initWithConfiguration:[[RNSpotifyAuth sharedInstance] configuration] logLevel:SPTAppRemoteLogLevelDebug];
    _appRemote.connectionParameters.accessToken = accessToken != nil ? accessToken : [[RNSpotifyAuth sharedInstance] accessToken];
    _appRemote.delegate = self;
    // Add our callback before we connect
    [_appRemoteCallbacks addObject:completion];
    RCTExecuteOnMainQueue(^{
        [self->_appRemote connect];
    });
//    [completion reject:[RNSpotifyError errorWithCodeObj:[RNSpotifyErrorCode NotImplemented]]];
}

+ (instancetype)sharedInstance {
    // Hopefully ReactNative can take care of allocating and initializing our instance
    // otherwise we'll need to check here
    return sharedInstance;
}

- (void)disconnect{
    if([ self isConnected] == YES){
        [_appRemote disconnect];
    }
}

#pragma mark - SPTAppRemotePlayerStateDelegate implementation

- (void)playerStateDidChange:(nonnull id<SPTAppRemotePlayerState>)playerState {
    [self sendEvent:EventNamePlayerStateChanged args:@[
        [RNSpotifyConvert SPTAppRemotePlayerState:playerState]
        ]
    ];
}

#pragma mark - SPTAppRemoteDelegate implementation

- (void)appRemote:(nonnull SPTAppRemote *)appRemote didDisconnectWithError:(nullable NSError *)error {
    [RNSpotifyCompletion rejectCompletions:_appRemoteCallbacks error:[RNSpotifyError errorWithNSError:error]];
    NSLog(@"App Remote disconnected");
    [self sendEvent:EventNameRemoteDisconnected args:@[]];
}

- (void)appRemote:(nonnull SPTAppRemote *)appRemote didFailConnectionAttemptWithError:(nullable NSError *)error {
    [RNSpotifyCompletion rejectCompletions:_appRemoteCallbacks error:[RNSpotifyError errorWithNSError:error]];
    NSLog(@"App Failed To Connect to Spotify");
}

- (void)appRemoteDidEstablishConnection:(nonnull SPTAppRemote *)connectedRemote {
    [RNSpotifyCompletion resolveCompletions:_appRemoteCallbacks result:_appRemote];
    NSLog(@"App Remote Connection Initiated");
    [self sendEvent:EventNameRemoteConnected args:@[]];
}

#pragma mark - Utilities

+(void (^)(id _Nullable, NSError * _Nullable))defaultSpotifyRemoteCallback:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject{
    return ^(id  _Nullable result, NSError * _Nullable error) {
        if(error != nil){
            [[RNSpotifyError errorWithNSError:error] reject:reject];
        }else{
            resolve([NSNull null]);
        }
    };
}

-(BOOL)isConnected{
    return (_appRemote != nil && _appRemote.isConnected) ? YES : NO;
}

#pragma mark - React Native functions

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(connect:(NSString*)accessToken resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RNSpotifyCompletion<NSNumber*>* completion = [RNSpotifyCompletion onResolve:resolve onReject:^(RNSpotifyError *error) {
        [error reject:reject];
    }];
    if(_isConnecting){
        [_appRemoteCallbacks addObject:completion];
    }else{
        if([self isConnected] == YES){
            resolve(@YES);
        }else{
            [self initializeAppRemote:accessToken completionCallback:completion];
        }
    }
}

RCT_EXPORT_METHOD(isConnectedAsync:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        if([self isConnected]){
            resolve(@YES);
        }else{
            resolve(@NO);
        }
    });
}



RCT_EXPORT_METHOD(playUri:(NSString*)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI play:uri callback:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}

RCT_EXPORT_METHOD(queueUri:(NSString*)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    if(![[uri lowercaseString] hasPrefix:@"spotify:track:"]){
        [[RNSpotifyError errorWithCodeObj:RNSpotifyErrorCode.InvalidParameter message:@"Can only queue Spotify track uri's (i.e. spotify:track:<id> )"] reject:reject];
        return;
    }
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI enqueueTrackUri:uri callback:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}

RCT_EXPORT_METHOD(resume:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI resume:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}

RCT_EXPORT_METHOD(pause:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI pause:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}

RCT_EXPORT_METHOD(skipToNext:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI skipToNext:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}

RCT_EXPORT_METHOD(skipToPrevious:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI skipToPrevious:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}

RCT_EXPORT_METHOD(seek:(NSInteger)position resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI seekToPosition:position callback:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}


RCT_EXPORT_METHOD(setShuffling:(BOOL)shuffling resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI setShuffle:shuffling callback:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}

RCT_EXPORT_METHOD(setRepeatMode: (NSInteger)repeatMode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI setRepeatMode:repeatMode callback:[RNSpotifyRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    });
}


RCT_EXPORT_METHOD(getPlayerState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        [self->_appRemote.playerAPI getPlayerState:^(id _Nullable result, NSError * _Nullable error) {
            if(error != nil){
                [[RNSpotifyError errorWithNSError:error] reject:reject];
            }else{
                if([result conformsToProtocol:@protocol(SPTAppRemotePlayerState)]){
                    resolve([RNSpotifyConvert SPTAppRemotePlayerState:result]);
                }else{
                    [[RNSpotifyError errorWithCodeObj:RNSpotifyErrorCode.BadResponse message:@"Couldn't parse returned player state"] reject:reject];
                }
            }
        }];
    });
}



RCT_EXPORT_METHOD(getRecommendedContentItems:(NSUInteger) typeVal resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    SPTAppRemoteContentType contentType = typeVal;
    RCTExecuteOnMainQueue(^{
        if(self->_appRemote != nil && self->_appRemote.contentAPI != nil){
            [self->_appRemote.contentAPI fetchRecommendedContentItemsForType:contentType
                callback:^(NSArray* _Nullable result, NSError * _Nullable error){
                   if(error != nil){
                       [[RNSpotifyError errorWithNSError:error] reject:reject];
                   }else{
                       resolve([RNSpotifyConvert SPTAppRemoteContentItems:result]);
                   }
               }
             ];
        }
    });
}

RCT_EXPORT_METHOD(getChildrenOfItem:(NSDictionary*)item resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RNSpotifyItem* spotifyItem = [RNSpotifyItem fromJSON:item];
    RCTExecuteOnMainQueue(^{
        if(self->_appRemote != nil && self->_appRemote.contentAPI != nil){
            [self->_appRemote.contentAPI fetchChildrenOfContentItem:spotifyItem
                callback:^(NSArray* _Nullable result, NSError * _Nullable error){
                    if(error != nil){
                        [[RNSpotifyError errorWithNSError:error] reject:reject];
                    }else{
                        resolve([RNSpotifyConvert SPTAppRemoteContentItems:result]);
                    }
                }
            ];
        }
    });
}


+(BOOL)requiresMainQueueSetup
{
   return NO;
}

-(void)handleEventSubscriptions{
    [_eventSubscriptions enumerateKeysAndObjectsUsingBlock:^(NSString * _Nonnull key, NSNumber * _Nonnull value, BOOL * _Nonnull stop) {
        RNSpotifySubscriptionCallback* callback = self->_eventSubscriptionCallbacks[key];
        BOOL shouldSubscribe = [value boolValue];
        
        // If a callback has been registered for this event then use it
        // Note: the callback structure makes sure to only subscribe/unsubscribe once
        if(callback != nil){
            if(shouldSubscribe == YES){
                [callback subscribe];
            }else if(shouldSubscribe == NO){
                [callback unSubscribe];
            }
        }
    }];
}

#pragma mark - RNEventConformer Implementation

RCT_EXPORT_METHOD(__registerAsJSEventEmitter:(int)moduleId)
{
    [RNEventEmitter registerEventEmitterModule:self withID:moduleId bridge:_bridge];
}

-(void)sendEvent:(NSString*)event args:(NSArray*)args
{
    [RNEventEmitter emitEvent:event withParams:args module:self bridge:_bridge];
}

-(void)onJSEvent:(NSString*)eventName params:(NSArray*)params{
    if([eventName isEqualToString:@"eventSubscribed"]){
        NSString * eventType = params[0];
        if(eventType != nil){
            [_eventSubscriptions setValue:@YES forKey:eventType];
        }
        [self handleEventSubscriptions];
    }else if([eventName isEqualToString:@"eventUnsubscribed"]){
        NSString * eventType = params[0];
        if(eventType != nil){
            [_eventSubscriptions setValue:@NO forKey:eventType];
        }
        [self handleEventSubscriptions];
    }
}

@end

