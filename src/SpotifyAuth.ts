import { NativeModules } from 'react-native';
import SpotifyApiConfig from './ApiConfig';

/**
 * Spotify Authorization Module
 * 
 * *Used for managing Spotify Session*
 * 
 * ```typescript
 * import { auth as SpotifyAuth, remote as SpotifyRemote, ApiScope, ApiConfig, PlayerState, SpotifyRemoteApi } from 'react-native-spotify-remote';
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
}

const SpotifyAuth = NativeModules.RNSpotifyRemoteAuth as SpotifyAuth;
export default SpotifyAuth;