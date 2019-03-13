import TypedEventEmitter from './TypedEventEmitter';
import RepeatMode from './RepeatMode';
import PlayerState from './PlayerState';
import ContentType from './ContentType';
import ContentItem from './ContentItem';
/**
 * Events supported by the [[SpotifyRemoteApi]]
 *
 * @interface SpotifyRemoteEvents
 */
interface SpotifyRemoteEvents {
    /**
     * Fired when the state of the Spotify Player changes
     *
     * @type {PlayerState}
     * @memberof SpotifyRemoteEvents
     */
    "playerStateChanged": PlayerState;
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
/**
 * @ignore
 */
declare const SpotifyRemote: SpotifyRemoteApi;
/**
 * @ignore
 */
export default SpotifyRemote;
