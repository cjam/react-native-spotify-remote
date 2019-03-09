//
//  RNSubscriptionCallback.m
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-10.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "./RNSpotifyRemoteSubscriptionCallback.h"

@interface RNSpotifyRemoteSubscriptionCallback()
{
    BOOL _isSubscribed;
    void(^_subscriber)(void);
    void(^_unsubscriber)(void);
}

@end

@implementation RNSpotifyRemoteSubscriptionCallback

- (id)initWithCallbacks:(void (^)(void))subscriber unsubscriber:(void (^)(void))unsubscriber{
    if(self = [super init])
    {
        _isSubscribed = NO;
        _subscriber = subscriber;
        _unsubscriber = unsubscriber;
    }
    return self;
}

-(void)subscribe{
    if(_isSubscribed == NO){
        _subscriber();
        _isSubscribed = YES;
    }
}

-(void)unSubscribe{
    if(_isSubscribed == YES){
        _unsubscriber();
        _isSubscribed = NO;
    }
}

+(RNSpotifyRemoteSubscriptionCallback*)subscriber:(void(^)(void))subscriber unsubscriber:(void(^)(void))unsubscriber{
    return [[self alloc] initWithCallbacks:subscriber unsubscriber:unsubscriber];
}

+(RNSpotifyRemoteSubscriptionCallback*)unsubscriber:(void(^)(void))unsubscriber subscriber:(void(^)(void))subscriber{
    return [[self alloc] initWithCallbacks:subscriber unsubscriber:unsubscriber];
}

@end
