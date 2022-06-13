import { EmitterSubscription, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import ContentItem from './ContentItem';
import ContentType from './ContentType';
import CrossfadeState from './CrossfadeState';
import GetChildrenItemsOptions, { DEFAULT_GET_CHILDREN_OPTIONS } from './GetChildrenItemsOptions';
import PlayerContext from './PlayerContext';
import PlayerState from './PlayerState';
import RecommendedContentOptions from './RecommendedContentOptions';
import RepeatMode from './RepeatMode';
import TypedEventEmitter from './TypedEventEmitter';

/**
 * Events supported by the [[SpotifyRemoteApi]]
 *
 * @interface SpotifyRemoteEvents
 */
export interface SpotifyRemoteEvents {

    /**
     * Fired when the state of the Spotify Player changes
     *
     * @type {PlayerState}
     * @memberof SpotifyRemoteEvents
     */
    "playerStateChanged": PlayerState;

    /**
     * Fires when the context of the Spotify Player changes
     * 
     * @type {PlayerContext}
     * @memberof SpotifyRemoteEvents
     */
    "playerContextChanged": PlayerContext;


    /**
     * Fired when the Spotify Remote is disconnected from the Spotify App
     *
     * @type {void}
     * @memberof SpotifyRemoteEvents
     */
    "remoteDisconnected": void;


    /**
     * Fired when the Spotify Remote Connection is established with the Spotify App
     *
     * @type {void}
     * @memberof SpotifyRemoteEvents
     */
    "remoteConnected": void;
}


/**
 * Interface describes Javascript only extensions to the native api
 * @ignore
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
 * See the example shown for [[SpotifyAuth]]
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
    connect(accessToken: string): Promise<void>;

    /**
     * Disconnects the App Remote 
     *
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    disconnect(): Promise<void>;

    /**
     * Play a track, album, playlist or artist via spotifyUri
     * Example: spotify:track:<id>, spotify:album:<id>, spotify:playlist:<id>, spotify:artist:<id>
     * @param {string} spotifyUri
     * @returns {Promise<void>}
     * @memberof SpotifyNativeApi
     */
    playUri(spotifyUri: string): Promise<void>;

    /**
     * Plays a content item
     *
     * @param {ContentItem} item
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    playItem(item: ContentItem): Promise<void>;

    /**
     * Plays an item (like a playlist), skipping to a particular track inside
     *
     * @param {ContentItem} item - item to play (usually a playlist)
     * @param {number} skipToTrackIndex - track in playlist to skip to
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    playItemWithIndex(item: ContentItem, skipToTrackIndex: number): Promise<void>;

    /**
     * Queues the track given by spotifyUri in Spotify
     * example: spotify:track:<id>
     * @param {string} spotifyUri
     * @returns {Promise<void>}
     * @memberof SpotifyNativeApi
     */
    queueUri(spotifyUri: string): Promise<void>;

    /**
     * Seeks to a position within a song
     *
     * @param {number} positionMs - Position in milliseconds
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    seek(positionMs: number): Promise<void>;

    /**
     * Resumes playing
     *
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    resume(): Promise<void>;

    /**
     * Pauses Playback
     *
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    pause(): Promise<void>;

    /**
     * Skips to next item in context
     *
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    skipToNext(): Promise<void>;

    /**
     * Skips to previous item in context
     *
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    skipToPrevious(): Promise<void>;

    /**
     * Sets shuffling
     *
     * @param {boolean} shuffling
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    setShuffling(shuffling: boolean): Promise<void>;

    /**
     * Sets repeat mode of player
     *
     * @param {RepeatMode} mode
     * @returns {Promise<void>}
     * @memberof SpotifyRemoteApi
     */
    setRepeatMode(mode: RepeatMode): Promise<void>;

    /**
     * Gets the current state of the player
     *
     * @returns {Promise<PlayerState>}
     * @memberof SpotifyRemoteApi
     */
    getPlayerState(): Promise<PlayerState>;

    /**
     * Retrieves the root content items for a given type. (iOS only)
     *
     * @param {ContentType} [type]
     * @returns {Promise<ContentItem[]>}
     * @memberof SpotifyRemoteApi
     */
    getRootContentItems(type?: ContentType): Promise<ContentItem[]>;

    /**
     * Gets the recommended content items for type
     *
     * @param {RecommendedContentOptions} options
     * @returns {Promise<ContentItem[]>}
     * @memberof SpotifyRemoteApi
     */
    getRecommendedContentItems(options: RecommendedContentOptions): Promise<ContentItem[]>;

    /**
     * Gets the children of a given item
     *
     * @param {(Pick<ContentItem, 'uri' | 'id'>)} item
     * @param {GetChildrenItemsOptions} [options]
     * @returns {Promise<ContentItem[]>}
     * @memberof SpotifyRemoteApi
     */
    getChildrenOfItem(item: Pick<ContentItem, 'uri' | 'id'>, options?: GetChildrenItemsOptions): Promise<ContentItem[]>;


    /**
     * Gets a ContentItem from a uri (iOS only)
     *
     * @param {string} uri
     * @returns {Promise<ContentItem>}
     * @memberof SpotifyRemoteApi
     */
    getContentItemForUri(uri: string): Promise<ContentItem | undefined>;

    /**
     * Retrieves the current crossfade state of the player.
     *
     * @returns {Promise<CrossfadeState>}
     * @memberof SpotifyRemoteApi
     */
    getCrossfadeState(): Promise<CrossfadeState>;
}

const nativeModule = NativeModules.RNSpotifyRemoteAppRemote;

const nativeEventEmitter = new NativeEventEmitter(nativeModule);
const eventListeners: Record<
    keyof SpotifyRemoteEvents,
    Set<EmitterSubscription>
> = {
    playerContextChanged: new Set(),
    playerStateChanged: new Set(),
    remoteConnected: new Set(),
    remoteDisconnected: new Set(),
};

const SpotifyRemote: SpotifyRemoteApi = {
    // Native APIs
    connect: nativeModule.connect.bind(nativeModule),
    disconnect: nativeModule.disconnect.bind(nativeModule),
    getChildrenOfItem: nativeModule.getChildrenOfItem.bind(nativeModule),
    getContentItemForUri: nativeModule.getContentItemForUri.bind(nativeModule),
    getCrossfadeState: nativeModule.getCrossfadeState.bind(nativeModule),
    getPlayerState: nativeModule.getPlayerState.bind(nativeModule),
    getRecommendedContentItems:
        nativeModule.getRecommendedContentItems.bind(nativeModule),
    getRootContentItems: nativeModule.getRootContentItems.bind(nativeModule),
    isConnectedAsync: nativeModule.isConnectedAsync.bind(nativeModule),
    pause: nativeModule.pause.bind(nativeModule),
    playItem: nativeModule.playItem.bind(nativeModule),
    playItemWithIndex: nativeModule.playItemWithIndex.bind(nativeModule),
    playUri: nativeModule.playUri.bind(nativeModule),
    queueUri: nativeModule.queueUri.bind(nativeModule),
    resume: nativeModule.resume.bind(nativeModule),
    seek: nativeModule.seek.bind(nativeModule),
    setRepeatMode: nativeModule.setRepeatMode.bind(nativeModule),
    setShuffling: nativeModule.setShuffling.bind(nativeModule),
    skipToNext: nativeModule.skipToNext.bind(nativeModule),
    skipToPrevious: nativeModule.skipToPrevious.bind(nativeModule),
    setPlaying(playing: boolean) {
        // todo: Will want to likely check the state of playing somewhere?
        // Perhaps this can be done in native land so that we don't need to
        // worry about it here
        return playing ? this.resume() : this.pause();
    },
    // Listeners
    addListener(eventType, listener) {
        const sub = nativeEventEmitter.addListener(eventType, listener);
        if (this.listenerCount(eventType) === 0) {
            nativeModule.eventStartObserving(eventType);
        }
        eventListeners[eventType].add(sub);
        const _remove = sub.remove;
        // rewrite sub.remove so we can add stopObserving API
        sub.remove = () => {
            _remove.call(sub);
            eventListeners[eventType].delete(sub);
            if (this.listenerCount(eventType) === 0) {
                nativeModule.eventStopObserving(eventType);
            }
        };
        return sub;
    },
    removeListener(eventType, listener) {
        eventListeners[eventType].forEach((eventListener) => {
            if (eventListener.listener === listener) eventListener.remove();
        });
    },
    removeAllListeners(eventType) {
        const eventsToRemove = eventType ? [eventType] : this.eventNames();
        for (const eventToRemove of eventsToRemove) {
            eventListeners[eventToRemove].forEach((eventListener) => {
                eventListener.remove();
            });
        }
    },
    emit(eventType, ...args) {
        return nativeEventEmitter.emit(eventType, ...args);
    },
    listenerCount(eventType) {
        return eventListeners[eventType].size;
    },
    on(...args) {
        return this.addListener(...args);
    },
    off(...args) {
        return this.removeListener(...args);
    },
    eventNames() {
        return [
            'playerContextChanged',
            'playerStateChanged',
            'remoteConnected',
            'remoteDisconnected',
        ];
    },
};



// Augment the android module to warn on unimplemented methods
if (Platform.OS === "android") {

    SpotifyRemote.getContentItemForUri = async (uri: string) => {
        console.warn("getContentItemForUri is not implemented in Spotify's Android SDK");
        return undefined;
    }

    SpotifyRemote.getRootContentItems = async (type: ContentType) => {
        console.warn("getRootContentItems is not implemented in Spotify's Android SDK");
        return [];
    }


    const androidGetItemOfChildren = SpotifyRemote.getChildrenOfItem;
    SpotifyRemote.getChildrenOfItem = async (item: ContentItem, options) => {
        return androidGetItemOfChildren(item, {
            ...DEFAULT_GET_CHILDREN_OPTIONS,
            ...options
        });
    }

}

// Augment the iOS module to handle differences
if (Platform.OS === "ios") {
    const iosGetChildrenOfItem = SpotifyRemote.getChildrenOfItem;
    SpotifyRemote.getChildrenOfItem = async (item: ContentItem, options) => {
        return iosGetChildrenOfItem(item);
    }
}

export default SpotifyRemote;
