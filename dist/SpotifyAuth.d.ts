import SpotifyApiConfig from './ApiConfig';
/**
 * Spotify Native Authorization Module
 *
 * *Used for managing Spotify Session*
 */
export interface SpotifyNativeAuth {
    /**
     * Initializes a Session with Spotify and returns an accessToken
     * that can be used for interacting with other services
     *
     * @param {SpotifyApiConfig} config
     * @returns {Promise<string>} accessToken
     */
    initialize(config: SpotifyApiConfig): Promise<string>;
}
declare const SpotifyNativeAuth: SpotifyNativeAuth;
export default SpotifyNativeAuth;
