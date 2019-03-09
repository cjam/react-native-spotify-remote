"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiScope;
(function (ApiScope) {
    /**
     * Read access to user’s private playlists.
     */
    ApiScope[ApiScope["PlaylistReadPrivateScope"] = 1] = "PlaylistReadPrivateScope";
    /**
     * Include collaborative playlists when requesting a user’s playlists.
     */
    ApiScope[ApiScope["PlaylistReadCollaborativeScope"] = 2] = "PlaylistReadCollaborativeScope";
    /**
     * Write access to a user’s public playlists.
     */
    ApiScope[ApiScope["PlaylistModifyPublicScope"] = 4] = "PlaylistModifyPublicScope";
    /**
     * Write access to a user’s private playlists.
     */
    ApiScope[ApiScope["PlaylistModifyPrivateScope"] = 8] = "PlaylistModifyPrivateScope";
    /**
     * Read access to the list of artists and other users that the user follows.
     */
    ApiScope[ApiScope["UserFollowReadScope"] = 16] = "UserFollowReadScope";
    /**
     * Write/delete access to the list of artists and other users that the user follows.
     */
    ApiScope[ApiScope["UserFollowModifyScope"] = 32] = "UserFollowModifyScope";
    /**
     * Read access to a user’s “Your Music” library.
     */
    ApiScope[ApiScope["UserLibraryReadScope"] = 64] = "UserLibraryReadScope";
    /**
     * Write/delete access to a user’s “Your Music” library.
     */
    ApiScope[ApiScope["UserLibraryModifyScope"] = 128] = "UserLibraryModifyScope";
    /**
     * Read access to the user’s birthdate.
     */
    ApiScope[ApiScope["UserReadBirthDateScope"] = 256] = "UserReadBirthDateScope";
    /**
     * Read access to user’s email address.
     */
    ApiScope[ApiScope["UserReadEmailScope"] = 512] = "UserReadEmailScope";
    /**
     * Read access to user’s subscription details (type of user account).
     */
    ApiScope[ApiScope["UserReadPrivateScope"] = 1024] = "UserReadPrivateScope";
    /**
     * Read access to a user’s top artists and tracks.
     */
    ApiScope[ApiScope["UserTopReadScope"] = 2048] = "UserTopReadScope";
    /**
     * Upload user generated content images
     */
    ApiScope[ApiScope["UGCImageUploadScope"] = 4096] = "UGCImageUploadScope";
    /**
     * Control playback of a Spotify track.
     */
    ApiScope[ApiScope["StreamingScope"] = 8192] = "StreamingScope";
    /**
     * Use App Remote to control playback in the Spotify app
     */
    ApiScope[ApiScope["AppRemoteControlScope"] = 16384] = "AppRemoteControlScope";
    /**
     * Read access to a user’s player state.
     */
    ApiScope[ApiScope["UserReadPlaybackStateScope"] = 32768] = "UserReadPlaybackStateScope";
    /**
     * Write access to a user’s playback state
     */
    ApiScope[ApiScope["UserModifyPlaybackStateScope"] = 65536] = "UserModifyPlaybackStateScope";
    /**
     * Read access to a user’s currently playing track
     */
    ApiScope[ApiScope["UserReadCurrentlyPlayingScope"] = 131072] = "UserReadCurrentlyPlayingScope";
    /**
     * Read access to a user’s currently playing track
     */
    ApiScope[ApiScope["UserReadRecentlyPlayedScope"] = 262144] = "UserReadRecentlyPlayedScope";
})(ApiScope || (ApiScope = {}));
exports.default = ApiScope;
//# sourceMappingURL=ApiScope.js.map