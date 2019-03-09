import { NativeModules } from 'react-native';
import RNEvents from 'react-native-events';
import TypedEventEmitter from './TypedEventEmitter';
import RepeatMode from './RepeatMode';
import PlayerState from './PlayerState';
import ContentType from './ContentType';
import ContentItem from './ContentItem';

/**
 * Events supported by the SpotifyRemoteApi
 *
 * @interface SpotifyRemoteEvents
 */
interface SpotifyRemoteEvents {
    "playerStateChanged": PlayerState;
    "remoteDisconnected": void;
    "remoteConnected": void;
}


/**
 * Interface describes Javascript only extensions to the native api
 *
 * @interface SpotifyRemoteApiExtensions
 */
interface SpotifyRemoteApiExtensions {
    /**
     * @deprecated Please use *resume* and *pause* instead
     * @param {boolean} playing
     * @returns {Promise<void>}
     * @memberof SpotifyJSApi
     */
    setPlaying(playing: boolean): Promise<void>;
}

/**
 * The Spotify Remote Api allows remote control of Spotify Application
 *
 * @export
 * @interface SpotifyRemoteApi
 */
export interface SpotifyRemoteApi extends TypedEventEmitter<SpotifyRemoteEvents>, SpotifyRemoteApiExtensions {
    /**
     * Asynchronous call to get whether or not the Spotify Remote is connected
     *
     * @returns {Promise<boolean>}
     * @memberof SpotifyNativeApi
     */
    isConnectedAsync(): Promise<boolean>;
    
    /**
     * Connect to Spotify Application via the access token
     *
     * @param {string} accessToken
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    connect(accessToken:string): Promise<void>;

    /**
     * Play a track, album, playlist or artist via spotifyUri
     * Example: spotify:track:<id>, spotify:album:<id>, spotify:playlist:<id>, spotify:artist:<id>
     * @param {string} spotifyUri
     * @returns {Promise<void>}
     * @memberof SpotifyNativeApi
     */
    playUri(spotifyUri: string): Promise<void>;

    /**
     * Queues the track given by spotifyUri in Spotify
     * example: spotify:track:<id>
     * @param {string} spotifyUri
     * @returns {Promise<void>}
     * @memberof SpotifyNativeApi
     */
    queueUri(spotifyUri: string): Promise<void>;

    seek(positionMs: number): Promise<void>;
    resume(): Promise<void>;
    pause(): Promise<void>;
    skipToNext(): Promise<void>;
    skipToPrevious(): Promise<void>;
    setShuffling(shuffling: boolean): Promise<void>;
    setRepeatMode(mode: RepeatMode): Promise<void>;
    getPlayerState(): Promise<PlayerState>;
    getRecommendedContentItems(type: ContentType): Promise<ContentItem[]>;
    getChildrenOfItem(item: Pick<ContentItem, 'uri' | 'id'>): Promise<ContentItem[]>;
}

// Remote module
const SpotifyRemote = NativeModules.RNSpotifyRemote as SpotifyRemoteApi;
RNEvents.register(SpotifyRemote);
RNEvents.conform(SpotifyRemote);

// Example of Javascript only api method
SpotifyRemote.setPlaying = (playing: boolean) => {
    // todo: Will want to likely check the state of playing somewhere?
    // Perhaps this can be done in native land so that we don't need to
    // worry about it here
    return playing ? SpotifyRemote.resume() : SpotifyRemote.pause();
}

// The events produced by the eventEmitter implementation around 
// when new event listeners are added and removed
const metaEvents = {
    newListener: 'newListener',
    removeListener: 'removeListener'
};

// Want to ignore the metaEvents when sending our subscription events
const ignoredEvents = Object.keys(metaEvents);


// The following allows us to lazily subscribe to events instead of having a single
// subscription all the time regardless which is less efficient
(SpotifyRemote as any).on(metaEvents.newListener, (type: string) => {
    if (ignoredEvents.indexOf(type) === -1) {
        const listenerCount = SpotifyRemote.listenerCount(type as any);
        // If this is the first listener, send an eventSubscribed event
        if (listenerCount == 0) {
            RNEvents.emitNativeEvent(SpotifyRemote, "eventSubscribed", type);
        }
    }
}).on(metaEvents.removeListener, (type: string) => {
    if (ignoredEvents.indexOf(type) === -1) {
        const listenerCount = SpotifyRemote.listenerCount(type as any);
        if (listenerCount == 0) {
            RNEvents.emitNativeEvent(SpotifyRemote, "eventUnsubscribed", type);
        }
    }
});

export default SpotifyRemote;
