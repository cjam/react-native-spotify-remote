declare enum ApiScope {
    /**
     * Read access to user’s private playlists.
     */
    PlaylistReadPrivateScope = 1,
    /**
     * Include collaborative playlists when requesting a user’s playlists.
     */
    PlaylistReadCollaborativeScope = 2,
    /**
     * Write access to a user’s public playlists.
     */
    PlaylistModifyPublicScope = 4,
    /**
     * Write access to a user’s private playlists.
     */
    PlaylistModifyPrivateScope = 8,
    /**
     * Read access to the list of artists and other users that the user follows.
     */
    UserFollowReadScope = 16,
    /**
     * Write/delete access to the list of artists and other users that the user follows.
     */
    UserFollowModifyScope = 32,
    /**
     * Read access to a user’s “Your Music” library.
     */
    UserLibraryReadScope = 64,
    /**
     * Write/delete access to a user’s “Your Music” library.
     */
    UserLibraryModifyScope = 128,
    /**
     * Read access to the user’s birthdate.
     */
    UserReadBirthDateScope = 256,
    /**
     * Read access to user’s email address.
     */
    UserReadEmailScope = 512,
    /**
     * Read access to user’s subscription details (type of user account).
     */
    UserReadPrivateScope = 1024,
    /**
     * Read access to a user’s top artists and tracks.
     */
    UserTopReadScope = 2048,
    /**
     * Upload user generated content images
     */
    UGCImageUploadScope = 4096,
    /**
     * Control playback of a Spotify track.
     */
    StreamingScope = 8192,
    /**
     * Use App Remote to control playback in the Spotify app
     */
    AppRemoteControlScope = 16384,
    /**
     * Read access to a user’s player state.
     */
    UserReadPlaybackStateScope = 32768,
    /**
     * Write access to a user’s playback state
     */
    UserModifyPlaybackStateScope = 65536,
    /**
     * Read access to a user’s currently playing track
     */
    UserReadCurrentlyPlayingScope = 131072,
    /**
     * Read access to a user’s currently playing track
     */
    UserReadRecentlyPlayedScope = 262144
}
export default ApiScope;
