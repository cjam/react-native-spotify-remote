import ApiScope from './ApiScope';

export default interface SpotifyApiConfig {

    /**
     * Client Id of application registered with Spotify Api
     * see https://developer.spotify.com/dashboard/applications
     *
     * @type {string}
     * @memberof SpotifyApiConfig
     */
    clientID:string;

    /**
     * The redirect url back to your application (i.e. myapp://spotify-login-callback )
     *
     * @type {string}
     * @memberof SpotifyApiConfig
     */
    redirectURL:string;

    /**
     * Endpoint on your server to do token swap
     *
     * @type {string}
     * @memberof SpotifyApiConfig
     */
    tokenSwapURL?:string;

    /**
     * Endpoint on your server to refesh token
     *
     * @type {string}
     * @memberof SpotifyApiConfig
     */
    tokenRefreshURL?:string;

    /**
     * URI of Spotify item to play upon authorization. `""` will 
     * attempt to resume playback from where it was
     * @type {string}
     * @memberof SpotifyApiConfig
     */
    playURI?:string;

    /**
     * Requested API Scopes, need to have AppRemoteControlScope 
     * to control playback of app
     * @type {ApiScope}
     * @memberof SpotifyApiConfig
     */
    scope?:ApiScope;

    /**
     * Whether or not the auth dialog should be shown.
     * Useful for debugging.
     *
     * @type {boolean}
     * @memberof SpotifyApiConfig
     */
    showDialog?:boolean;
}