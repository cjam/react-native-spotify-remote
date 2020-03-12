
package com.reactlibrary;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;

import com.spotify.protocol.client.CallResult;
import com.spotify.protocol.types.CrossfadeState;
import com.spotify.protocol.types.ListItem;
import com.spotify.protocol.types.ListItems;
import com.spotify.protocol.types.PlayerState;


public class RNSpotifyRemoteAppModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private ConnectionParams mConnectionParams;
    private RNSpotifyRemoteAuthModule authModule;
    private SpotifyAppRemote mSpotifyAppRemote;

    public RNSpotifyRemoteAppModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    public void connect(Promise _promise) {
        final Promise promise = _promise;
        authModule = reactContext.getNativeModule(RNSpotifyRemoteAuthModule.class);
        ConnectionParams connectionParams = authModule.mConnectionParams;
        SpotifyAppRemote.connect(this.getReactApplicationContext(), connectionParams,
                new Connector.ConnectionListener() {

                    public void onConnected(SpotifyAppRemote spotifyAppRemote) {
                        promise.resolve(true);
                        mSpotifyAppRemote = spotifyAppRemote;
                        connected();

                        sendEvent("remoteConnected", null);
                    }

                    public void onFailure(Throwable throwable) {
                        promise.reject(throwable);
                        sendEvent("remoteDisconnected", null);
                    }
                });

    }

    private void sendEvent(String eventMame, Object data) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventMame, data);
    }

    private void connected() {
        mSpotifyAppRemote.getPlayerApi()
                .subscribeToPlayerState()
                .setEventCallback(playerState -> {
                    ReadableMap map = (ReadableMap)playerState;
                    sendEvent("playerStateChanged", map);
                });
    }

    @ReactMethod
    public void isConnectedAsync(Promise promise) {
        if (mSpotifyAppRemote != null) {
            boolean isConnected = mSpotifyAppRemote.isConnected();
            promise.resolve(isConnected);
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void playUri(String uri) {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().play(uri);
        }
    }

    @ReactMethod
    public void playItem(ReadableMap map) {
        if (mSpotifyAppRemote != null) {
            ListItem item = (ListItem)map;
            mSpotifyAppRemote.getContentApi().playContentItem(item);
        }
    }

    @ReactMethod
    public void playItemWithIndex(ReadableMap map, int index) {
        if (mSpotifyAppRemote != null) {
            ListItem item = (ListItem)map;
            mSpotifyAppRemote.getPlayerApi().skipToIndex(item.uri, index);
        }
    }

    @ReactMethod
    public void queueUri(String uri) {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().queue(uri);
        }
    }

    @ReactMethod
    public void seek(float ms) {
        if (mSpotifyAppRemote != null) {
            long positionMs = (long)ms;
            mSpotifyAppRemote.getPlayerApi().seekTo(positionMs);
        }
    }

    @ReactMethod
    public void resume() {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().resume();
        }
    }

    @ReactMethod
    public void pause() {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().pause();
        }
    }

    @ReactMethod
    public void skipToNext() {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().skipNext();
        }
    }

    @ReactMethod
    public void skipToPrevious() {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().skipPrevious();
        }
    }

    @ReactMethod
    public void setShuffling(boolean isShuffling) {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().setShuffle(isShuffling);
        }
    }

    @ReactMethod
    public void setRepeatMode(int repeatMode) {
        if (mSpotifyAppRemote != null) {
            mSpotifyAppRemote.getPlayerApi().setRepeat(repeatMode);
        }
    }

    @ReactMethod
    public void getPlayerState(final Promise promise) {
        if (mSpotifyAppRemote != null) {
            CallResult<PlayerState> callResult = mSpotifyAppRemote.getPlayerApi().getPlayerState();
            CallResult.ResultCallback<PlayerState> tResultCallback = new CallResult.ResultCallback<PlayerState>() {
                @Override
                public void onResult(PlayerState playerState) {
                    ReadableMap map = (ReadableMap)playerState;
                    promise.resolve(map);
                }
            };
            callResult.setResultCallback(tResultCallback);
        }
    }

    @ReactMethod
    public void getRecommendedContentItems(String type, Promise _promise) {
        final Promise promise = _promise;
        if (mSpotifyAppRemote != null) {
            CallResult<ListItems> callResult = mSpotifyAppRemote.getContentApi().getRecommendedContentItems(type);
            CallResult.ResultCallback<ListItems> tResultCallback = new CallResult.ResultCallback<ListItems>() {
                @Override
                public void onResult(ListItems listItems) {
                    ReadableMap map = (ReadableMap)listItems;
                    promise.resolve(map);
                }
            };
            callResult.setResultCallback(tResultCallback);
        }
    }

    @ReactMethod
    public void getChildrenOfItem(ReadableMap map, int perpage, int offset,  Promise _promise) {
        final Promise promise = _promise;
        if (mSpotifyAppRemote != null) {
            ListItem listItem = (ListItem)map;
            CallResult<ListItems> callResult = mSpotifyAppRemote.getContentApi().getChildrenOfItem(listItem, perpage, offset);
            CallResult.ResultCallback<ListItems> tResultCallback = new CallResult.ResultCallback<ListItems>() {
                @Override
                public void onResult(ListItems listItems) {
                    ReadableMap map = (ReadableMap)listItems;
                    promise.resolve(map);
                }
            };
            callResult.setResultCallback(tResultCallback);
        }
    }

    @ReactMethod
    public void getCrossfadeState(Promise _promise) {
        final Promise promise = _promise;
        if (mSpotifyAppRemote != null) {
            CallResult<CrossfadeState> callResult = mSpotifyAppRemote.getPlayerApi().getCrossfadeState();
            CallResult.ResultCallback<CrossfadeState> tResultCallback = new CallResult.ResultCallback<CrossfadeState>() {
                @Override
                public void onResult(CrossfadeState crossfadeState) {
                    ReadableMap map = (ReadableMap)crossfadeState;
                    promise.resolve(map);
                }
            };
            callResult.setResultCallback(tResultCallback);
        }
    }

    @ReactMethod
    public void getRootContentItems() {
        // not implemented yet
    }

    @ReactMethod
    public void getContentItemForUri() {
        // not implemented yet
    }

    @Override
    public String getName() {
        return "RNSpotifyRemoteAppRemote";
    }
}