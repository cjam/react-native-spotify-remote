
#import "RNSpotifyAuth.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTConvert.h>
#import <SpotifyiOS.h>
#import "RNSpotifyConvert.h"
#import "RNSpotifyItem.h"
#import "RNSpotifyError.h"
#import "RNSpotifyCompletion.h"
#import "RNSpotifySubscriptionCallback.h"
#define SPOTIFY_API_BASE_URL @"https://api.spotify.com/"
#define SPOTIFY_API_URL(endpoint) [NSURL URLWithString:NSString_concat(SPOTIFY_API_BASE_URL, endpoint)]

// Static Singleton instance
static RNSpotifyAuth *sharedInstance = nil;

@interface RNSpotifyAuth() <SPTSessionManagerDelegate>
{
    BOOL _initialized;
    BOOL _isInitializing;
    BOOL _isRemoteConnected;
    NSDictionary* _options;
    
    NSMutableArray<RNSpotifyCompletion*>* _sessionManagerCallbacks;
    NSMutableArray<RNSpotifyCompletion*>* _appRemoteCallbacks;
    NSMutableDictionary<NSString*,NSNumber*>* _eventSubscriptions;
    NSDictionary<NSString*,RNSpotifySubscriptionCallback*>* _eventSubscriptionCallbacks;
    
    SPTConfiguration* _apiConfiguration;
    SPTSessionManager* _sessionManager;
}
- (void)initializeSessionManager:(NSDictionary*)options completionCallback:(RNSpotifyCompletion*)completion;
@end

@implementation RNSpotifyAuth

-(NSString*) accessToken{
    return _sessionManager.session.accessToken;
}

-(SPTConfiguration*) configuration{
    return _apiConfiguration;
}

#pragma mark Singleton Methods

+ (instancetype)sharedInstance {
    // Hopefully ReactNative can take care of allocating and initializing our instance
    // otherwise we'll need to check here
    return sharedInstance;
}

-(id)init
{
    // This is to hopefully maintain the singleton pattern within our React App.
    // Since ReactNative is the one allocating and initializing our instance,
    // we need to store the instance within the sharedInstance otherwise we'll
    // end up with a different one when calling shared instance statically
    if(sharedInstance == nil){
        if(self = [super init])
        {
            _initialized = NO;
            _isInitializing = NO;
            _isRemoteConnected = NO;
            _sessionManagerCallbacks = [NSMutableArray array];
            _apiConfiguration = nil;
            _sessionManager = nil;
        }
        static dispatch_once_t once;
        dispatch_once(&once, ^{
            sharedInstance = self;
        });
    }else{
        NSLog(@"Returning shared instance");
    }
    return sharedInstance;
}

#pragma mark URL handling

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)URL options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    // Not sure what we do if session manager is nil, perhaps store the parameters for when
    // we initialize?
    BOOL returnVal = NO;
    if(_sessionManager != nil){
        NSLog(@"Setting application openURL and options on session manager");
        returnVal = [_sessionManager application:application openURL:URL options:options];
        NSDictionary *params = [[SPTAppRemote alloc] authorizationParametersFromURL:URL];
        NSString *errorDescription = params[SPTAppRemoteErrorDescriptionKey];
        // If there was an error we should reject our SpotifyCompletion
        if(errorDescription){
//            [self rejectCompletions:_sessionManagerCallbacks error:[RNSpotifyError errorWithNSError:[SPTError errorWithCode:SPTAuthorizationFailedErrorCode description: errorDescription]]];
            returnVal = NO;
        }
    }
    if(returnVal){
//        [self resolveCompletions:_sessionManagerCallbacks result:nil];
    }
    return returnVal;
}


#pragma mark - SPTSessionManagerDelegate

- (void)sessionManager:(SPTSessionManager *)manager didInitiateSession:(SPTSession *)session
{
    [RNSpotifyCompletion resolveCompletions:_sessionManagerCallbacks result:session];
    NSLog(@"Session Initiated");
}

- (void)sessionManager:(SPTSessionManager *)manager didFailWithError:(NSError *)error
{
    [RNSpotifyCompletion rejectCompletions:_sessionManagerCallbacks error:[RNSpotifyError errorWithNSError:error]];
    NSLog(@"Session Manager Failed");
}

- (void)sessionManager:(SPTSessionManager *)manager didRenewSession:(SPTSession *)session
{
    [RNSpotifyCompletion resolveCompletions:_sessionManagerCallbacks result:session];
    NSLog(@"Session Renewed");
}

#pragma mark - React Native functions

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize:(NSDictionary*)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    // Wrap our promise callbacks in a completion
    RNSpotifyCompletion<NSString*>* completion = [RNSpotifyCompletion<NSString*> onResolve:^(NSString *result) {
        resolve(result);
    } onReject:^(RNSpotifyError *error) {
        [error reject:reject];
    }];
    
    if(_isInitializing){
        [_sessionManagerCallbacks addObject:completion];
        return;
    }
    
    if(_initialized && [_sessionManager session]!= nil && [_sessionManager session].isExpired == NO)
    {
        [completion resolve:[_sessionManager session].accessToken];
        return;
    }
    _isInitializing = YES;

    // ensure options is not null or missing fields
    if(options == nil)
    {
        [completion reject: [RNSpotifyError nullParameterErrorForName:@"options"]];
        return;
    }
    else if(options[@"clientID"] == nil)
    {
        [completion reject: [RNSpotifyError nullParameterErrorForName:@"clientID"]];
        return;
    }else if(options[@"redirectURL"] == nil)
    {
         [completion reject: [RNSpotifyError nullParameterErrorForName:@"redirectURL"]];
        return;
    }

    // store the options
    _options = options;
    [self initializeSessionManager:options completionCallback:
     [
      RNSpotifyCompletion
      onResolve:^(SPTSession* session) {
          self->_isInitializing = NO;
          self->_initialized = YES;
          [completion resolve:session.accessToken];
      }
      onReject:^(RNSpotifyError *error) {
          self->_isInitializing=NO;
          [completion reject:error];
      }
    ]
   ];
}

- (void)initializeSessionManager:(NSDictionary*)options completionCallback:(RNSpotifyCompletion*)completion{
    // Create our configuration object
    _apiConfiguration = [SPTConfiguration configurationWithClientID:options[@"clientID"] redirectURL:[NSURL URLWithString:options[@"redirectURL"]]];
    // Add swap and refresh urls to config if present
    if(options[@"tokenSwapURL"] != nil){
        _apiConfiguration.tokenSwapURL = [NSURL URLWithString: options[@"tokenSwapURL"]];
    }
    
    if(options[@"tokenRefreshURL"] != nil){
        _apiConfiguration.tokenRefreshURL = [NSURL URLWithString: options[@"tokenRefreshURL"]];
    }
    
    // Default Scope
    SPTScope scope = SPTAppRemoteControlScope | SPTUserFollowReadScope;
    if(options[@"scope"] != nil){
        scope = [RCTConvert NSUInteger:options[@"scope"]];
    }
    
    // Allocate our _sessionManager using our configuration
    _sessionManager = [SPTSessionManager sessionManagerWithConfiguration:_apiConfiguration delegate:self];
    
    // Add our completion callback
    [_sessionManagerCallbacks addObject:completion];
    
    // For debugging..
//    _sessionManager.alwaysShowAuthorizationDialog = YES;
    
    // Initialize the auth flow
    if (@available(iOS 11, *)) {
        RCTExecuteOnMainQueue(^{
            // Use this on iOS 11 and above to take advantage of SFAuthenticationSession
            [ self->_sessionManager
                 initiateSessionWithScope:scope
                 options:SPTDefaultAuthorizationOption
            ];
        });
    } else {
        RCTExecuteOnMainQueue(^{
            // Use this on iOS versions < 11 to use SFSafariViewController
            [ self->_sessionManager
                initiateSessionWithScope:scope
                options:SPTDefaultAuthorizationOption
                presentingViewController:[UIApplication sharedApplication].keyWindow.rootViewController
            ];
        });
    }
}

+ (BOOL)requiresMainQueueSetup{
    return NO;
}

@end

