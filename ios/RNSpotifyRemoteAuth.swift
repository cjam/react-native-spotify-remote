//
//  RNSpotifyRemoteAuth.swift
//  RNSpotifyRemote
//
//  Swift migration of RNSpotifyRemoteAuth
//

import Foundation
import AVFoundation

@objc(RNSpotifyRemoteAuth)
class RNSpotifyRemoteAuth: NSObject, RCTBridgeModule, SPTSessionManagerDelegate {

    static func moduleName() -> String! {
        return "RNSpotifyRemoteAuth"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    // MARK: - Singleton

    @objc static let shared = RNSpotifyRemoteAuth()

    private var initialized = false
    private var isInitializing = false
    private var options: [String: Any]?
    private var sessionManagerCallbacks: [RNSpotifyRemotePromise<SPTSession>] = []
    private var apiConfiguration: SPTConfiguration?
    private var sessionManager: SPTSessionManager?

    @objc var accessToken: String? {
        return sessionManager?.session?.accessToken
    }

    @objc var configuration: SPTConfiguration? {
        return apiConfiguration
    }

    @objc var isSpotifyInstalled: Bool {
        return sessionManager?.spotifyAppInstalled ?? false
    }

    private override init() {
        super.init()
    }

    // MARK: - URL Handling

    @objc func application(_ application: UIApplication,
                          open url: URL,
                          options: [UIApplication.OpenURLOptionsKey: Any]) -> Bool {
        guard let sessionManager = sessionManager else {
            return false
        }

        #if DEBUG
        print("Setting application openURL and options on session manager")
        #endif

        var returnValue = false

        if let components = URLComponents(url: url, resolvingAgainstBaseURL: true) {
            let errorDescription = components.queryItems?.first { $0.name == SPTAppRemoteErrorDescriptionKey }
            let errorType = components.queryItems?.first { $0.name == "error" }

            if let errorDesc = errorDescription {
                let error = RNSpotifyRemoteError.error(
                    code: errorType?.value ?? "unknown",
                    message: errorDesc.value ?? "Unknown error"
                )
                RNSpotifyRemotePromise<SPTSession>.rejectAll(sessionManagerCallbacks, error: error)
                returnValue = false
            }
        }

        returnValue = sessionManager.application(application, open: url, options: options)
        return returnValue
    }

    // MARK: - SPTSessionManagerDelegate

    func sessionManager(manager: SPTSessionManager, didInitiate session: SPTSession) {
        RNSpotifyRemotePromise<SPTSession>.resolveAll(sessionManagerCallbacks, result: session)
        #if DEBUG
        print("Session Initiated")
        #endif
    }

    func sessionManager(manager: SPTSessionManager, didFailWith error: Error) {
        let rnError = RNSpotifyRemoteError.error(nsError: error as NSError)
        RNSpotifyRemotePromise<SPTSession>.rejectAll(sessionManagerCallbacks, error: rnError)
        #if DEBUG
        print("Session Manager Failed")
        #endif
    }

    func sessionManager(manager: SPTSessionManager, didRenew session: SPTSession) {
        RNSpotifyRemotePromise<SPTSession>.resolveAll(sessionManagerCallbacks, result: session)
        #if DEBUG
        print("Session Renewed")
        #endif
    }

    // MARK: - React Native Methods

    @objc func endSession(_ resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
        if isInitializing {
            RNSpotifyRemotePromise<SPTSession>.rejectAll(
                sessionManagerCallbacks,
                error: .sessionClosed
            )
        }

        isInitializing = false
        initialized = false
        sessionManagerCallbacks.removeAll()
        sessionManager = nil
        resolve(NSNull())
    }

    @objc func getSession(_ resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
        if isInitializing {
            let promise = RNSpotifyRemotePromise<SPTSession>(
                resolve: { session in
                    resolve(RNSpotifyRemoteConvert.convertSession(session))
                },
                reject: { error in
                    error.reject(reject)
                }
            )
            sessionManagerCallbacks.append(promise)
        }

        if initialized, let session = sessionManager?.session {
            resolve(RNSpotifyRemoteConvert.convertSession(session))
        } else {
            resolve(NSNull())
        }
    }

    @objc func authorize(_ options: [String: Any],
                        resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping RCTPromiseRejectBlock) {
        let completion = RNSpotifyRemotePromise<SPTSession>(
            resolve: { session in
                resolve(RNSpotifyRemoteConvert.convertSession(session))
            },
            reject: { error in
                error.reject(reject)
            }
        )

        if isInitializing {
            sessionManagerCallbacks.append(completion)
            return
        }

        if initialized,
           let session = sessionManager?.session,
           !session.isExpired {
            completion.resolve(session)
            return
        }

        isInitializing = true

        // Validate options
        guard let clientID = options["clientID"] as? String else {
            completion.reject(.nullParameterError(name: "clientID"))
            return
        }

        guard let redirectURL = options["redirectURL"] as? String else {
            completion.reject(.nullParameterError(name: "redirectURL"))
            return
        }

        self.options = options

        initializeSessionManager(
            options: options,
            completion: RNSpotifyRemotePromise<SPTSession>(
                resolve: { [weak self] session in
                    self?.isInitializing = false
                    self?.initialized = true
                    completion.resolve(session)
                },
                reject: { [weak self] error in
                    self?.isInitializing = false
                    completion.reject(error)
                }
            )
        )
    }

    private func initializeSessionManager(options: [String: Any],
                                          completion: RNSpotifyRemotePromise<SPTSession>) {
        guard let clientID = options["clientID"] as? String,
              let redirectURLString = options["redirectURL"] as? String,
              let redirectURL = URL(string: redirectURLString) else {
            return
        }

        // Create configuration
        apiConfiguration = SPTConfiguration(clientID: clientID, redirectURL: redirectURL)

        // Add swap and refresh URLs if present
        if let tokenSwapURLString = options["tokenSwapURL"] as? String,
           let tokenSwapURL = URL(string: tokenSwapURLString) {
            apiConfiguration?.tokenSwapURL = tokenSwapURL
        }

        if let tokenRefreshURLString = options["tokenRefreshURL"] as? String,
           let tokenRefreshURL = URL(string: tokenRefreshURLString) {
            apiConfiguration?.tokenRefreshURL = tokenRefreshURL
        }

        if let playURI = options["playURI"] as? String {
            apiConfiguration?.playURI = playURI
        }

        // Set scope
        var scope: SPTScope = [.appRemoteControl, .userReadPrivate]
        if let scopeValue = options["scopes"] as? UInt {
            scope = SPTScope(rawValue: scopeValue)
        }

        // Create session manager
        guard let config = apiConfiguration else { return }
        sessionManager = SPTSessionManager(configuration: config, delegate: self)

        // Add callback
        sessionManagerCallbacks.append(completion)

        // Show dialog option
        if let showDialog = options["showDialog"] as? Bool {
            sessionManager?.alwaysShowAuthorizationDialog = showDialog
        }

        // Initialize auth flow
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let sessionManager = self.sessionManager else { return }

            if #available(iOS 11, *) {
                sessionManager.initiateSession(with: scope, options: .default)
            } else {
                if let rootViewController = UIApplication.shared.keyWindow?.rootViewController {
                    sessionManager.initiateSession(
                        with: scope,
                        options: .default,
                        presenting: rootViewController
                    )
                }
            }
        }
    }
}
