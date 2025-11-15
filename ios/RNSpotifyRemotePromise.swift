//
//  RNSpotifyRemotePromise.swift
//  RNSpotifyRemote
//
//  Swift migration of RNSpotifyRemotePromise
//

import Foundation

@objc class RNSpotifyRemotePromise<T: AnyObject>: NSObject {
    private let resolveBlock: ((T?) -> Void)?
    private let rejectBlock: ((RNSpotifyRemoteError) -> Void)?
    private var resolved = false

    init(resolve: ((T?) -> Void)?, reject: ((RNSpotifyRemoteError) -> Void)?) {
        self.resolveBlock = resolve
        self.rejectBlock = reject
        super.init()
    }

    @objc static func create(
        resolve: @escaping (Any?) -> Void,
        reject: @escaping (RNSpotifyRemoteError) -> Void
    ) -> RNSpotifyRemotePromise {
        return RNSpotifyRemotePromise(resolve: resolve, reject: reject)
    }

    @objc func resolve(_ result: T?) {
        guard !resolved else { return }
        resolved = true
        resolveBlock?(result)
    }

    @objc func reject(_ error: RNSpotifyRemoteError) {
        guard !resolved else { return }
        resolved = true
        rejectBlock?(error)
    }

    @objc static func resolveAll<T: AnyObject>(
        _ promises: [RNSpotifyRemotePromise<T>],
        result: T?
    ) {
        promises.forEach { $0.resolve(result) }
    }

    @objc static func rejectAll<T: AnyObject>(
        _ promises: [RNSpotifyRemotePromise<T>],
        error: RNSpotifyRemoteError
    ) {
        promises.forEach { $0.reject(error) }
    }
}
