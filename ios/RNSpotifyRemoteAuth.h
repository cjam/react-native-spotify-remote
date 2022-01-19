#import <UIKit/UIKit.h>
#import <SpotifyiOS/SpotifyiOS.h>
#import <React/RCTBridgeModule.h>
#import "RNSpotifyRemotePromise.h"

@interface RNSpotifyRemoteAuth : NSObject<RCTBridgeModule>

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)URL options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

+(instancetype)sharedInstance;

-(void)authorize:(NSDictionary*)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)endSession:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getSession:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(BOOL)isSpotifyInstalled;

-(SPTConfiguration*) configuration;
-(NSString*) accessToken;
@end
