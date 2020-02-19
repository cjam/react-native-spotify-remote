import { NativeModules } from 'react-native';
import SpotifyApiConfig from './ApiConfig';
import SpotifySession from './SpotifySession';

/**
 * Spotify Authorization Module
 * 
 * *Used for managing Spotify Session*
 * 
 * ```typescript
 * import { auth as SpotifyAuth, remote as SpotifyRemote, ApiScope, ApiConfig } from 'react-native-spotify-remote';
 * const spotifyConfig: ApiConfig = {
 *     clientID: "SPOTIFY_CLIENT_ID",
 *     redirectURL: "SPOTIFY_REDIRECT_URL",
 *     tokenRefreshURL: "SPOTIFY_TOKEN_REFRESH_URL",
 *     tokenSwapURL: "SPOTIFY_TOKEN_SWAP_URL",
 *     scope: ApiScope.AppRemoteControlScope | ApiScope.UserFollowReadScope
 * }
 * async function playEpicSong(){
 *     try{
 *         const token = await SpotifyAuth.initialize(spotifyConfig);
 *         await SpotifyRemote.connect(token);
 *         SpotifyRemote.playUri("spotify:track:6IA8E2Q5ttcpbuahIejO74#0:38");
 *     }catch(err){
 *         console.error("Couldn't authorize with or connect to Spotify",err);
 *     }   
 * }
 * ```
 */
export interface SpotifyAuth {

    /**
     * Initializes a Session with Spotify and returns an accessToken
     * that can be used for interacting with other services
     *
     * @param {SpotifyApiConfig} config
     * @returns {Promise<string>} accessToken
     */
    initialize(config: SpotifyApiConfig): Promise<string>;

    /**
     * Ends the current Session and cleans up any resources
     *
     * @returns {Promise<void>}
     * @memberof SpotifyAuth
     */
    endSession(): Promise<void>;

    /**
     * Returns the current session or `undefined` if a session hasn't been started
     *
     * @returns {Promise<SpotifySession>}
     * @memberof SpotifyAuth
     */
    getSession(): Promise<SpotifySession | undefined>;
}

const SpotifyAuth = NativeModules.RNSpotifyRemoteAuth as SpotifyAuth;
export default SpotifyAuth;