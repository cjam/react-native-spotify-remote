
package com.reactlibrary;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.sdk.android.auth.AuthorizationClient;
import com.spotify.sdk.android.auth.AuthorizationRequest;
import com.spotify.sdk.android.auth.AuthorizationResponse;


@ReactModule(name = "RNSpotifyRemoteAuth")
public class RNSpotifyRemoteAuthModule extends ReactContextBaseJavaModule implements ActivityEventListener {

  private static final int REQUEST_CODE = 1337;
  private final ReactApplicationContext reactContext;
  private Promise authPromise;
  private String mAccessToken;

  public ConnectionParams mConnectionParams;

  public RNSpotifyRemoteAuthModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(this);
    this.reactContext = reactContext;
  }

  @ReactMethod
  public void login(ReadableMap config, Promise promise) {
    String clientId = config.getString("clientID");
    String redirectUri = config.getString("redirectURL");
    authPromise = promise;
    AuthorizationRequest.Builder builder =
            new AuthorizationRequest.Builder(clientId, AuthorizationResponse.Type.TOKEN, redirectUri);

    builder.setScopes(new String[]{"streaming"});
    AuthorizationRequest request = builder.build();

    AuthorizationClient.openLoginActivity(getCurrentActivity(), REQUEST_CODE, request);
  }

  @ReactMethod
  public void initialize(ReadableMap config, Promise promise) {
    String clientId = config.getString("clientID");
    String redirectUri = config.getString("redirectURL");
    boolean showDialog = config.getBoolean("showDialog");

      mConnectionParams =
              new ConnectionParams.Builder(clientId)
                      .setRedirectUri(redirectUri)
                      .showAuthView(showDialog)
                      .build();
      promise.resolve("token");
  }

  @Override
  public void onNewIntent(Intent intent) {
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (requestCode == REQUEST_CODE) {
      AuthorizationResponse response = AuthorizationClient.getResponse(resultCode, data);

      switch (response.getType()) {
        // Response was successful and contains auth token
        case TOKEN:
          if (authPromise != null) {
            String token = response.getAccessToken();
            mAccessToken = token;
            authPromise.resolve(token);
          }
          break;

        // Auth flow returned an error
        case ERROR:
          if (authPromise != null) {
            String code = response.getCode();
            String error = response.getError();
            authPromise.reject(code, error);
          }
          break;

        // Most likely auth flow was cancelled
        default:
          if (authPromise != null) {
            String code = "500";
            String error = "Cancelled";
            authPromise.reject(code, error);
          }
      }
    }
  }

  @ReactMethod
  public void getSession(Promise promise) {
    WritableMap map = Arguments.createMap();
    map.putString("accessToken", mAccessToken);
    promise.resolve(map);
  }

  @ReactMethod
  public void endSession() {
  }

  @Override
  public String getName() {
    return "RNSpotifyRemoteAuth";
  }
}
