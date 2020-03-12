"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ApiScope_1 = require("./ApiScope");
exports.ApiScope = ApiScope_1.default;
var RepeatMode_1 = require("./RepeatMode");
exports.RepeatMode = RepeatMode_1.default;
// Modules
var SpotifyAuth_1 = __importDefault(require("./SpotifyAuth"));
var SpotifyRemote_1 = __importDefault(require("./SpotifyRemote"));
/**
 * Singleton Instance of [[SpotifyAuth]]
 * ```typescript
 * import {auth} from 'react-native-spotify-remote'
 * ```
*/
exports.auth = SpotifyAuth_1.default;
/**
 * Singleton Instance of [[SpotifyRemoteApi]]
 * ```typescript
 * import {remote} from 'react-native-spotify-remote'
 * ```
*/
exports.remote = SpotifyRemote_1.default;
//# sourceMappingURL=index.js.map