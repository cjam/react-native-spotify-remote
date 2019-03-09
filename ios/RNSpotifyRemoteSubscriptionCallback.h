//
//  RNSpotifySubscriptionCallback.h
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-10.
//  Copyright © 2018. All rights reserved.
//

#ifndef RNSpotifySubscriptionCallback_h
#define RNSpotifySubscriptionCallback_h

@interface RNSpotifyRemoteSubscriptionCallback : NSObject

-(id)initWithCallbacks:(void(^)(void))subscriber unsubscriber:(void(^)(void))unsubscriber;
-(void)subscribe;
-(void)unSubscribe;

+(RNSpotifyRemoteSubscriptionCallback*)subscriber:(void(^)(void))subscriber unsubscriber:(void(^)(void))unsubscriber;

+(RNSpotifyRemoteSubscriptionCallback*)unsubscriber:(void(^)(void))unsubscriber subscriber:(void(^)(void))subscriber;

@end

#endif /* RNSpotifySubscriptionCallback_h */
