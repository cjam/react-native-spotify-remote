//
//  RNSpotifyItem.swift
//  RNSpotifyRemote
//
//  Swift migration of RNSpotifyItem
//

import Foundation

@objc class RNSpotifyItem: NSObject, SPTAppRemoteContentItem {
    private let itemTitle: String
    private let itemSubtitle: String
    private let itemIdentifier: String
    private let itemURI: String
    private let itemAvailableOffline: Bool
    private let itemPlayable: Bool
    private let itemContainer: Bool
    private let itemChildren: [Any]

    init(title: String,
         subtitle: String,
         identifier: String,
         uri: String,
         availableOffline: Bool,
         playable: Bool,
         container: Bool,
         children: [Any]) {
        self.itemTitle = title
        self.itemSubtitle = subtitle
        self.itemIdentifier = identifier
        self.itemURI = uri
        self.itemAvailableOffline = availableOffline
        self.itemPlayable = playable
        self.itemContainer = container
        self.itemChildren = children
        super.init()
    }

    @objc static func from(json: [String: Any]) -> RNSpotifyItem {
        let title = json["title"] as? String ?? ""
        let subtitle = json["subtitle"] as? String ?? ""
        let identifier = json["id"] as? String ?? ""
        let uri = json["uri"] as? String ?? ""
        let availableOffline = json["availableOffline"] as? Bool ?? false
        let playable = json["playable"] as? Bool ?? false
        let container = json["container"] as? Bool ?? false
        let children = json["children"] as? [Any] ?? []

        return RNSpotifyItem(
            title: title,
            subtitle: subtitle,
            identifier: identifier,
            uri: uri,
            availableOffline: availableOffline,
            playable: playable,
            container: container,
            children: children
        )
    }

    // SPTAppRemoteContentItem protocol conformance
    @objc var title: String {
        return itemTitle
    }

    @objc var subtitle: String {
        return itemSubtitle
    }

    @objc var identifier: String {
        return itemIdentifier
    }

    @objc var uri: String {
        return itemURI
    }

    @objc var isAvailableOffline: Bool {
        return itemAvailableOffline
    }

    @objc var isPlayable: Bool {
        return itemPlayable
    }

    @objc var isContainer: Bool {
        return itemContainer
    }

    @objc var children: [Any] {
        return itemChildren
    }
}
