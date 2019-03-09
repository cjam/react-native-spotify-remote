enum ApiScope {
    
    /**
     * Read access to user’s private playlists.
     */
    PlaylistReadPrivateScope = 1 << 0,
    /**
     * Include collaborative playlists when requesting a user’s playlists.
     */
    PlaylistReadCollaborativeScope = 1 << 1,
    /**
     * Write access to a user’s public playlists.
     */
    PlaylistModifyPublicScope = 1 << 2,
    /**
     * Write access to a user’s private playlists.
     */
    PlaylistModifyPrivateScope = 1 << 3,
    /**
     * Read access to the list of artists and other users that the user follows.
     */
    UserFollowReadScope = 1 << 4,
    /**
     * Write/delete access to the list of artists and other users that the user follows.
     */
    UserFollowModifyScope = 1 << 5,
    /**
     * Read access to a user’s “Your Music” library.
     */
    UserLibraryReadScope = 1 << 6,
    /**
     * Write/delete access to a user’s “Your Music” library.
     */
    UserLibraryModifyScope = 1 << 7,
    /**
     * Read access to the user’s birthdate.
     */
    UserReadBirthDateScope = 1 << 8,
    /**
     * Read access to user’s email address.
     */
    UserReadEmailScope = 1 << 9,
    /**
     * Read access to user’s subscription details (type of user account).
     */
    UserReadPrivateScope = 1 << 10,
    /**
     * Read access to a user’s top artists and tracks.
     */
    UserTopReadScope = 1 << 11,
    /**
     * Upload user generated content images
     */
    UGCImageUploadScope = 1 << 12,
    /**
     * Control playback of a Spotify track.
     */
    StreamingScope = 1 << 13,
    /**
     * Use App Remote to control playback in the Spotify app
     */
    AppRemoteControlScope = 1 << 14,
    /**
     * Read access to a user’s player state.
     */
    UserReadPlaybackStateScope = 1 << 15,
    /**
     * Write access to a user’s playback state
     */
    UserModifyPlaybackStateScope = 1 << 16,
    /**
     * Read access to a user’s currently playing track
     */
    UserReadCurrentlyPlayingScope = 1 << 17,
    /**
     * Read access to a user’s currently playing track
     */
    UserReadRecentlyPlayedScope = 1 << 18,
}

export default ApiScope;