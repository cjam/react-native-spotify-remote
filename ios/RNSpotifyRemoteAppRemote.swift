//
//  RNSpotifyRemoteAppRemote.swift
//  RNSpotifyRemote
//
//  Swift migration of RNSpotifyRemoteAppRemote
//

import Foundation
import AVFoundation

@objc(RNSpotifyRemoteAppRemote)
class RNSpotifyRemoteAppRemote: RCTEventEmitter, SPTAppRemoteDelegate, SPTAppRemotePlayerStateDelegate {

    // MARK: - Constants

    private static let eventNamePlayerStateChanged = "playerStateChanged"
    private static let eventNamePlayerContextChanged = "playerContextChanged"
    private static let eventNameRemoteDisconnected = "remoteDisconnected"
    private static let eventNameRemoteConnected = "remoteConnected"

    // MARK: - Singleton

    @objc static let shared = RNSpotifyRemoteAppRemote()

    private var isConnecting = false
    private var accessToken: String?
    private var appRemoteCallbacks: [RNSpotifyRemotePromise<SPTAppRemote>] = []
    private var eventSubscriptions: [String: Bool] = [:]
    private var eventSubscriptionCallbacks: [String: RNSpotifyRemoteSubscriptionCallback] = [:]
    private var appRemote: SPTAppRemote?

    override private init() {
        super.init()
        eventSubscriptionCallbacks = initializeEventSubscribers()
    }

    // MARK: - React Native Setup

    override static func moduleName() -> String! {
        return "RNSpotifyRemoteAppRemote"
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        return [
            "remoteContentTypes": SPTAppRemoteContentTypeDefault
        ]
    }

    override func supportedEvents() -> [String]! {
        return [
            Self.eventNamePlayerStateChanged,
            Self.eventNamePlayerContextChanged,
            Self.eventNameRemoteDisconnected,
            Self.eventNameRemoteConnected
        ]
    }

    // MARK: - Event Subscription Setup

    private func initializeEventSubscribers() -> [String: RNSpotifyRemoteSubscriptionCallback] {
        return [
            Self.eventNamePlayerStateChanged: RNSpotifyRemoteSubscriptionCallback(
                subscribe: { [weak self] onSuccess in
                    guard let self = self,
                          let appRemote = self.appRemote,
                          let playerAPI = appRemote.playerAPI else { return }

                    playerAPI.delegate = self
                    DispatchQueue.main.async {
                        playerAPI.subscribe(toPlayerState: { result, error in
                            if let error = error {
                                #if DEBUG
                                print("Couldn't Subscribe to PlayerStateChanges: \(error)")
                                #endif
                            } else {
                                #if DEBUG
                                print("Subscribed to PlayerStateChanges")
                                #endif
                                onSuccess()
                            }
                        })
                    }
                },
                unsubscribe: { [weak self] onSuccess in
                    guard let self = self,
                          let appRemote = self.appRemote,
                          let playerAPI = appRemote.playerAPI else { return }

                    DispatchQueue.main.async {
                        playerAPI.unsubscribe(toPlayerState: { result, error in
                            if let error = error {
                                #if DEBUG
                                print("Couldn't Unsubscribe from PlayerStateChanges: \(error)")
                                #endif
                            } else {
                                #if DEBUG
                                print("Unsubscribed to PlayerStateChanges")
                                #endif
                                onSuccess()
                            }
                        })
                    }
                }
            )
        ]
    }

    // MARK: - App Remote Initialization

    private func initializeAppRemote(accessToken: String?,
                                     completion: RNSpotifyRemotePromise<SPTAppRemote>) {
        #if DEBUG
        let logLevel: SPTAppRemoteLogLevel = .debug
        #else
        let logLevel: SPTAppRemoteLogLevel = .none
        #endif

        guard let config = RNSpotifyRemoteAuth.shared.configuration else { return }

        appRemote = SPTAppRemote(configuration: config, logLevel: logLevel)
        appRemote?.connectionParameters.accessToken = accessToken ?? RNSpotifyRemoteAuth.shared.accessToken
        appRemote?.delegate = self

        appRemoteCallbacks.append(completion)

        DispatchQueue.main.async { [weak self] in
            self?.appRemote?.connect()
        }
    }

    @objc func disconnect() {
        if isConnected {
            appRemote?.disconnect()
        }
    }

    // MARK: - SPTAppRemotePlayerStateDelegate

    func playerStateDidChange(_ playerState: SPTAppRemotePlayerState) {
        if let state = RNSpotifyRemoteConvert.convertPlayerState(playerState) {
            if let stateDict = state["state"] as? [String: Any] {
                sendEvent(withName: Self.eventNamePlayerStateChanged, body: [stateDict])
            }
            if let contextDict = state["context"] as? [String: Any] {
                sendEvent(withName: Self.eventNamePlayerContextChanged, body: [contextDict])
            }
        }
    }

    // MARK: - SPTAppRemoteDelegate

    func appRemote(_ appRemote: SPTAppRemote, didDisconnectWithError error: Error?) {
        let rnError = error != nil ? RNSpotifyRemoteError.error(nsError: error! as NSError) : .appRemoteDisconnected
        RNSpotifyRemotePromise<SPTAppRemote>.rejectAll(appRemoteCallbacks, error: rnError)
        resetEventSubscriptions()
        sendEvent(withName: Self.eventNameRemoteDisconnected, body: [])
    }

    func appRemote(_ appRemote: SPTAppRemote, didFailConnectionAttemptWithError error: Error?) {
        if !RNSpotifyRemoteAuth.shared.isSpotifyInstalled {
            RNSpotifyRemotePromise<SPTAppRemote>.rejectAll(
                appRemoteCallbacks,
                error: .spotifyNotInstalled
            )
        } else if let error = error {
            let rnError = RNSpotifyRemoteError.error(nsError: error as NSError)
            RNSpotifyRemotePromise<SPTAppRemote>.rejectAll(appRemoteCallbacks, error: rnError)
        }
    }

    func appRemoteDidEstablishConnection(_ appRemote: SPTAppRemote) {
        RNSpotifyRemotePromise<SPTAppRemote>.resolveAll(appRemoteCallbacks, result: appRemote)
        handleEventSubscriptions()
        sendEvent(withName: Self.eventNameRemoteConnected, body: [])
    }

    // MARK: - Utilities

    private var isConnected: Bool {
        return appRemote?.isConnected ?? false
    }

    private static func defaultCallback(resolve: @escaping RCTPromiseResolveBlock,
                                       reject: @escaping RCTPromiseRejectBlock) -> SPTAppRemoteCallback {
        return { result, error in
            if let error = error {
                RNSpotifyRemoteError.error(nsError: error as NSError).reject(reject)
            } else {
                resolve(NSNull())
            }
        }
    }

    private func getPlayerStateInternal(resolve: @escaping (SPTAppRemotePlayerState) -> Void,
                                       reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.getPlayerState { [weak self] result, error in
                    if let error = error {
                        RNSpotifyRemoteError.error(nsError: error as NSError).reject(reject)
                    } else if let state = result as? SPTAppRemotePlayerState {
                        if let converted = RNSpotifyRemoteConvert.convertPlayerState(state) {
                            if let stateDict = converted["state"] as? [String: Any] {
                                self?.sendEvent(withName: Self.eventNamePlayerStateChanged, body: [stateDict])
                            }
                            if let contextDict = converted["context"] as? [String: Any] {
                                self?.sendEvent(withName: Self.eventNamePlayerContextChanged, body: [contextDict])
                            }
                        }
                        resolve(state)
                    } else {
                        RNSpotifyRemoteError.unknownResponse.reject(reject)
                    }
                }
            },
            reject: reject
        )
    }

    private func usePlayerAPI(execute: @escaping (SPTAppRemotePlayerAPI) -> Void,
                             reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async { [weak self] in
            guard let playerAPI = self?.appRemote?.playerAPI else {
                RNSpotifyRemoteError.playerNotReady.reject(reject)
                return
            }
            execute(playerAPI)
        }
    }

    private func useContentAPI(execute: @escaping (SPTAppRemoteContentAPI) -> Void,
                              reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async { [weak self] in
            guard let contentAPI = self?.appRemote?.contentAPI else {
                RNSpotifyRemoteError.appRemoteDisconnected.reject(reject)
                return
            }
            execute(contentAPI)
        }
    }

    private func handleEventSubscriptions() {
        eventSubscriptions.forEach { key, shouldSubscribe in
            if let callback = eventSubscriptionCallbacks[key] {
                if shouldSubscribe {
                    callback.subscribe()
                } else {
                    callback.unsubscribe()
                }
            }
        }
    }

    private func resetEventSubscriptions() {
        eventSubscriptionCallbacks.values.forEach { $0.reset() }
    }

    // MARK: - React Native Methods

    @objc func disconnect(_ resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
        disconnect()
        resolve(true)
    }

    @objc func connect(_ accessToken: String,
                      resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
        let completion = RNSpotifyRemotePromise<SPTAppRemote>(
            resolve: { _ in resolve(true) },
            reject: { error in error.reject(reject) }
        )

        if isConnecting {
            appRemoteCallbacks.append(completion)
        } else if isConnected {
            resolve(true)
        } else {
            initializeAppRemote(accessToken: accessToken, completion: completion)
        }
    }

    @objc func isConnectedAsync(_ resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async { [weak self] in
            resolve(self?.isConnected ?? false)
        }
    }

    // MARK: - Playback API

    @objc func playUri(_ uri: String,
                      resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.play(uri, callback: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func playItem(_ item: [String: Any],
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        let spotifyItem = RNSpotifyItem.from(json: item)
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.play(spotifyItem, callback: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func playItemWithIndex(_ item: [String: Any],
                                 skipToTrackIndex: Int,
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        let spotifyItem = RNSpotifyItem.from(json: item)
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.play(spotifyItem,
                             skipToTrackIndex: skipToTrackIndex,
                             callback: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func queueUri(_ uri: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        guard uri.lowercased().hasPrefix("spotify:track:") else {
            RNSpotifyRemoteError.error(
                code: RNSpotifyRemoteErrorCode.InvalidParameter,
                message: "Can only queue Spotify track uri's (i.e. spotify:track:<id> )"
            ).reject(reject)
            return
        }

        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.enqueueTrackUri(uri, callback: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func resume(_ resolve: @escaping RCTPromiseResolveBlock,
                     reject: @escaping RCTPromiseRejectBlock) {
        getPlayerStateInternal(
            resolve: { [weak self] state in
                if state.isPaused {
                    self?.appRemote?.playerAPI?.resume(Self.defaultCallback(resolve: resolve, reject: reject))
                } else {
                    resolve(NSNull())
                }
            },
            reject: reject
        )
    }

    @objc func pause(_ resolve: @escaping RCTPromiseResolveBlock,
                    reject: @escaping RCTPromiseRejectBlock) {
        getPlayerStateInternal(
            resolve: { [weak self] state in
                if !state.isPaused {
                    self?.appRemote?.playerAPI?.pause(Self.defaultCallback(resolve: resolve, reject: reject))
                } else {
                    resolve(NSNull())
                }
            },
            reject: reject
        )
    }

    @objc func skipToNext(_ resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.skip(toNext: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func skipToPrevious(_ resolve: @escaping RCTPromiseResolveBlock,
                              reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.skip(toPrevious: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func seek(_ position: Int,
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.seek(toPosition: position, callback: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func setShuffling(_ shuffling: Bool,
                           resolve: @escaping RCTPromiseResolveBlock,
                           reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.setShuffle(shuffling, callback: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func setRepeatMode(_ repeatMode: Int,
                            resolve: @escaping RCTPromiseResolveBlock,
                            reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                let mode = SPTAppRemotePlaybackOptionsRepeatMode(rawValue: repeatMode) ?? .off
                playerAPI.setRepeatMode(mode, callback: Self.defaultCallback(resolve: resolve, reject: reject))
            },
            reject: reject
        )
    }

    @objc func getPlayerState(_ resolve: @escaping RCTPromiseResolveBlock,
                              reject: @escaping RCTPromiseRejectBlock) {
        getPlayerStateInternal(
            resolve: { state in
                if let converted = RNSpotifyRemoteConvert.convertPlayerState(state),
                   let stateDict = converted["state"] {
                    resolve(stateDict)
                }
            },
            reject: reject
        )
    }

    @objc func getCrossfadeState(_ resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        usePlayerAPI(
            execute: { playerAPI in
                playerAPI.getCrossfadeState { result, error in
                    if let error = error {
                        RNSpotifyRemoteError.error(nsError: error as NSError).reject(reject)
                    } else if let crossfadeState = result as? SPTAppRemoteCrossfadeState {
                        resolve(RNSpotifyRemoteConvert.convertCrossfadeState(crossfadeState))
                    } else {
                        RNSpotifyRemoteError.error(
                            code: RNSpotifyRemoteErrorCode.BadResponse,
                            message: "Couldn't parse returned crossfade state"
                        ).reject(reject)
                    }
                }
            },
            reject: reject
        )
    }

    // MARK: - Content API

    @objc func getRootContentItems(_ contentType: String?,
                                   resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
        let type = contentType ?? SPTAppRemoteContentTypeDefault

        useContentAPI(
            execute: { contentAPI in
                contentAPI.fetchRootContentItems(forType: type) { result, error in
                    if let error = error {
                        RNSpotifyRemoteError.error(nsError: error as NSError).reject(reject)
                    } else if let items = result {
                        resolve(RNSpotifyRemoteConvert.convertContentItems(items))
                    }
                }
            },
            reject: reject
        )
    }

    @objc func getRecommendedContentItems(_ options: [String: Any]?,
                                         resolve: @escaping RCTPromiseResolveBlock,
                                         reject: @escaping RCTPromiseRejectBlock) {
        let opts = options ?? [:]
        let contentType = opts["type"] as? String ?? SPTAppRemoteContentTypeDefault
        let flatten = opts["flatten"] as? Bool ?? true

        useContentAPI(
            execute: { contentAPI in
                contentAPI.fetchRecommendedContentItems(
                    forType: contentType,
                    flattenContainers: flatten
                ) { result, error in
                    if let error = error {
                        RNSpotifyRemoteError.error(nsError: error as NSError).reject(reject)
                    } else if let items = result {
                        resolve(RNSpotifyRemoteConvert.convertContentItems(items))
                    }
                }
            },
            reject: reject
        )
    }

    @objc func getChildrenOfItem(_ item: [String: Any],
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        let spotifyItem = RNSpotifyItem.from(json: item)

        useContentAPI(
            execute: { contentAPI in
                contentAPI.fetchChildren(of: spotifyItem) { result, error in
                    if let error = error {
                        RNSpotifyRemoteError.error(nsError: error as NSError).reject(reject)
                    } else if let items = result {
                        resolve(RNSpotifyRemoteConvert.convertContentItems(items))
                    }
                }
            },
            reject: reject
        )
    }

    @objc func getContentItemForUri(_ uri: String,
                                    resolve: @escaping RCTPromiseResolveBlock,
                                    reject: @escaping RCTPromiseRejectBlock) {
        useContentAPI(
            execute: { contentAPI in
                contentAPI.fetchContentItem(forURI: uri) { result, error in
                    if let error = error {
                        RNSpotifyRemoteError.error(nsError: error as NSError).reject(reject)
                    } else if let item = result {
                        resolve(RNSpotifyRemoteConvert.convertContentItem(item))
                    }
                }
            },
            reject: reject
        )
    }

    // MARK: - Event Observation

    @objc func eventStartObserving(_ eventType: String) {
        eventSubscriptions[eventType] = true
        handleEventSubscriptions()
    }

    @objc func eventStopObserving(_ eventType: String) {
        eventSubscriptions[eventType] = false
        handleEventSubscriptions()
    }
}
