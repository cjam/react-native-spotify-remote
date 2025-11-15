//
//  RNSpotifyRemoteError.swift
//  RNSpotifyRemote
//
//  Swift migration of RNSpotifyRemoteError
//

import Foundation

@objc class RNSpotifyRemoteErrorCode: NSObject {
    @objc static let CouldNotFindSpotifyApp = "CouldNotFindSpotifyApp"
    @objc static let SpotifyNotInstalled = "SpotifyNotInstalled"
    @objc static let LoggedOut = "LoggedOut"
    @objc static let AppRemoteDisconnected = "AppRemoteDisconnected"
    @objc static let PlayerNotReady = "PlayerNotReady"
    @objc static let NullParameter = "NullParameter"
    @objc static let InvalidParameter = "InvalidParameter"
    @objc static let SessionClosed = "SessionClosed"
    @objc static let UnknownResponse = "UnknownResponse"
    @objc static let BadResponse = "BadResponse"
    @objc static let BadRequest = "BadRequest"
    @objc static let ConflictingCallbacks = "ConflictingCallbacks"
    @objc static let NotImplemented = "NotImplemented"
    @objc static let NotLoggedIn = "NotLoggedIn"
}

@objc class RNSpotifyRemoteError: NSObject {
    let code: String
    let message: String

    init(code: String, message: String) {
        self.code = code
        self.message = message
        super.init()
    }

    @objc var reactObject: [String: Any] {
        return [
            "code": code,
            "message": message
        ]
    }

    @objc func reject(_ reject: RCTPromiseRejectBlock) {
        reject(code, message, nil)
    }

    // Factory methods
    @objc static func error(code: String, message: String) -> RNSpotifyRemoteError {
        return RNSpotifyRemoteError(code: code, message: message)
    }

    @objc static func error(nsError: NSError) -> RNSpotifyRemoteError {
        let code = nsError.domain
        let message = nsError.localizedDescription
        return RNSpotifyRemoteError(code: code, message: message)
    }

    @objc static func nullParameterError(name: String) -> RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.NullParameter,
            message: "Missing required parameter '\(name)'"
        )
    }

    // Predefined errors
    @objc static var couldNotFindSpotifyApp: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.CouldNotFindSpotifyApp,
            message: "Could not find Spotify app"
        )
    }

    @objc static var spotifyNotInstalled: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.SpotifyNotInstalled,
            message: "Spotify is not installed on this device"
        )
    }

    @objc static var loggedOut: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.LoggedOut,
            message: "User is logged out"
        )
    }

    @objc static var appRemoteDisconnected: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.AppRemoteDisconnected,
            message: "App remote is disconnected"
        )
    }

    @objc static var playerNotReady: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.PlayerNotReady,
            message: "Player is not ready"
        )
    }

    @objc static var sessionClosed: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.SessionClosed,
            message: "Session has been closed"
        )
    }

    @objc static var unknownResponse: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.UnknownResponse,
            message: "Received unknown response from Spotify"
        )
    }

    @objc static var notImplemented: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.NotImplemented,
            message: "Feature not implemented"
        )
    }

    @objc static var notLoggedIn: RNSpotifyRemoteError {
        return RNSpotifyRemoteError(
            code: RNSpotifyRemoteErrorCode.NotLoggedIn,
            message: "User is not logged in"
        )
    }
}
