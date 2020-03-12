
package com.reactlibrary;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.SpotifyAppRemote;


public class RNSpotifyRemoteAuthModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public ConnectionParams mConnectionParams;

  public RNSpotifyRemoteAuthModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
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
    promise.resolve(null);
  }

  @ReactMethod
  public void getSession(Promise promise) {
    promise.resolve(null);
  }

  @ReactMethod
  public void endSession(Promise promise) {
    promise.resolve(null);
  }

  @Override
  public String getName() {
    return "RNSpotifyRemoteAuth";
  }
}