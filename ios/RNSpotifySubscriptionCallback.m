//
//  RNSubscriptionCallback.m
//  RNSpotify
//
//  Created by Rough Draft on 2018-10-10.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "./RNSpotifySubscriptionCallback.h"

@interface RNSpotifySubscriptionCallback()
{
    BOOL _isSubscribed;
    void(^_subscriber)(void);
    void(^_unsubscriber)(void);
}

@end

@implementation RNSpotifySubscriptionCallback

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

+(RNSpotifySubscriptionCallback*)subscriber:(void(^)(void))subscriber unsubscriber:(void(^)(void))unsubscriber{
    return [[self alloc] initWithCallbacks:subscriber unsubscriber:unsubscriber];
}

+(RNSpotifySubscriptionCallback*)unsubscriber:(void(^)(void))unsubscriber subscriber:(void(^)(void))subscriber{
    return [[self alloc] initWithCallbacks:subscriber unsubscriber:unsubscriber];
}

@end
