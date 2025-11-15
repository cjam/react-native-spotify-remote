//
//  RNSpotifyRemoteConvert.swift
//  RNSpotifyRemote
//
//  Swift migration of RNSpotifyRemoteConvert
//

import Foundation

@objc class RNSpotifyRemoteConvert: NSObject {

    // Date formatter for ISO dates
    private static let isoDateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
        formatter.calendar = Calendar(identifier: .gregorian)
        return formatter
    }()

    @objc static func convertDate(_ date: Date?) -> String? {
        guard let date = date else { return nil }
        return isoDateFormatter.string(from: date)
    }

    @objc static func convertCrossfadeState(_ state: SPTAppRemoteCrossfadeState?) -> [String: Any]? {
        guard let state = state else { return nil }
        return [
            "duration": state.duration,
            "enabled": state.isEnabled
        ]
    }

    @objc static func convertPlayerState(_ state: SPTAppRemotePlayerState?) -> [String: Any]? {
        guard let state = state else { return nil }

        return [
            "state": [
                "track": convertTrack(state.track) ?? NSNull(),
                "playbackPosition": state.playbackPosition,
                "playbackSpeed": state.playbackSpeed,
                "isPaused": state.isPaused,
                "playbackRestrictions": convertPlaybackRestrictions(state.playbackRestrictions) ?? NSNull(),
                "playbackOptions": convertPlaybackOptions(state.playbackOptions) ?? NSNull()
            ],
            "context": [
                "title": state.contextTitle ?? "",
                "uri": state.contextURI
            ]
        ]
    }

    @objc static func convertPlaybackRestrictions(_ restrictions: SPTAppRemotePlaybackRestrictions?) -> [String: Any]? {
        guard let restrictions = restrictions else { return nil }
        return [
            "canSkipNext": restrictions.canSkipNext,
            "canSkipPrevious": restrictions.canSkipPrevious,
            "canRepeatTrack": restrictions.canRepeatTrack,
            "canRepeatContext": restrictions.canRepeatContext,
            "canToggleShuffle": restrictions.canToggleShuffle,
            "canSeek": restrictions.canSeek
        ]
    }

    @objc static func convertPlaybackOptions(_ options: SPTAppRemotePlaybackOptions?) -> [String: Any]? {
        guard let options = options else { return nil }
        return [
            "isShuffling": options.isShuffling,
            "repeatMode": options.repeatMode.rawValue
        ]
    }

    @objc static func convertTrack(_ track: SPTAppRemoteTrack?) -> [String: Any]? {
        guard let track = track else { return nil }
        return [
            "name": track.name,
            "uri": track.uri,
            "duration": track.duration,
            "artist": convertArtist(track.artist) ?? NSNull(),
            "album": convertAlbum(track.album) ?? NSNull(),
            "saved": track.isSaved,
            "episode": track.isEpisode,
            "podcast": track.isPodcast
        ]
    }

    @objc static func convertArtist(_ artist: SPTAppRemoteArtist?) -> [String: Any]? {
        guard let artist = artist else { return nil }
        return [
            "name": artist.name ?? "",
            "uri": artist.uri ?? ""
        ]
    }

    @objc static func convertAlbum(_ album: SPTAppRemoteAlbum?) -> [String: Any]? {
        guard let album = album else { return nil }
        return [
            "name": album.name ?? "",
            "uri": album.uri ?? ""
        ]
    }

    @objc static func convertContentItem(_ item: SPTAppRemoteContentItem?) -> [String: Any]? {
        guard let item = item else { return nil }
        return [
            "title": item.title,
            "subtitle": item.subtitle ?? "",
            "id": item.identifier,
            "uri": item.uri,
            "availableOffline": item.isAvailableOffline,
            "playable": item.isPlayable,
            "container": item.isContainer,
            "children": convertContentItems(item.children)
        ]
    }

    @objc static func convertContentItems(_ items: [Any]?) -> [[String: Any]] {
        guard let items = items else { return [] }
        return items.compactMap { item in
            guard let contentItem = item as? SPTAppRemoteContentItem else { return nil }
            return convertContentItem(contentItem)
        }
    }

    @objc static func convertSession(_ session: SPTSession?) -> [String: Any]? {
        guard let session = session,
              let accessToken = session.accessToken,
              let refreshToken = session.refreshToken else {
            return nil
        }

        return [
            "accessToken": accessToken,
            "refreshToken": refreshToken,
            "scope": session.scope.rawValue,
            "expired": session.isExpired,
            "expirationDate": convertDate(session.expirationDate) ?? NSNull()
        ]
    }
}
