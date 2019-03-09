//
//  RNSpotifySubscriptionCallback.h
//  RNSpotify
//
//  Created by Rough Draft on 2018-10-10.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef RNSpotifySubscriptionCallback_h
#define RNSpotifySubscriptionCallback_h

@interface RNSpotifySubscriptionCallback : NSObject

-(id)initWithCallbacks:(void(^)(void))subscriber unsubscriber:(void(^)(void))unsubscriber;
-(void)subscribe;
-(void)unSubscribe;

+(RNSpotifySubscriptionCallback*)subscriber:(void(^)(void))subscriber unsubscriber:(void(^)(void))unsubscriber;

+(RNSpotifySubscriptionCallback*)unsubscriber:(void(^)(void))unsubscriber subscriber:(void(^)(void))subscriber;

@end

#endif /* RNSpotifySubscriptionCallback_h */
