//
//  RNSpotifyRemoteSubscriptionCallback.swift
//  RNSpotifyRemote
//
//  Swift migration of RNSpotifyRemoteSubscriptionCallback
//

import Foundation

@objc class RNSpotifyRemoteSubscriptionCallback: NSObject {
    private let subscribeHandler: (@escaping () -> Void) -> Void
    private let unsubscribeHandler: (@escaping () -> Void) -> Void
    private var isSubscribed = false
    private var isPending = false

    init(subscribe: @escaping (@escaping () -> Void) -> Void,
         unsubscribe: @escaping (@escaping () -> Void) -> Void) {
        self.subscribeHandler = subscribe
        self.unsubscribeHandler = unsubscribe
        super.init()
    }

    @objc func subscribe() {
        guard !isSubscribed && !isPending else { return }
        isPending = true

        subscribeHandler { [weak self] in
            self?.isSubscribed = true
            self?.isPending = false
        }
    }

    @objc func unsubscribe() {
        guard isSubscribed && !isPending else { return }
        isPending = true

        unsubscribeHandler { [weak self] in
            self?.isSubscribed = false
            self?.isPending = false
        }
    }

    @objc func reset() {
        isSubscribed = false
        isPending = false
    }
}
