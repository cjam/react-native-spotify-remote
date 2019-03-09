"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_native_events_1 = __importDefault(require("react-native-events"));
// Remote module
var SpotifyRemote = react_native_1.NativeModules.RNSpotifyRemoteAppRemote;
react_native_events_1.default.register(SpotifyRemote);
react_native_events_1.default.conform(SpotifyRemote);
// Example of Javascript only api method
SpotifyRemote.setPlaying = function (playing) {
    // todo: Will want to likely check the state of playing somewhere?
    // Perhaps this can be done in native land so that we don't need to
    // worry about it here
    return playing ? SpotifyRemote.resume() : SpotifyRemote.pause();
};
// The events produced by the eventEmitter implementation around 
// when new event listeners are added and removed
var metaEvents = {
    newListener: 'newListener',
    removeListener: 'removeListener'
};
// Want to ignore the metaEvents when sending our subscription events
var ignoredEvents = Object.keys(metaEvents);
// The following allows us to lazily subscribe to events instead of having a single
// subscription all the time regardless which is less efficient
SpotifyRemote.on(metaEvents.newListener, function (type) {
    if (ignoredEvents.indexOf(type) === -1) {
        var listenerCount = SpotifyRemote.listenerCount(type);
        // If this is the first listener, send an eventSubscribed event
        if (listenerCount == 0) {
            react_native_events_1.default.emitNativeEvent(SpotifyRemote, "eventSubscribed", type);
        }
    }
}).on(metaEvents.removeListener, function (type) {
    if (ignoredEvents.indexOf(type) === -1) {
        var listenerCount = SpotifyRemote.listenerCount(type);
        if (listenerCount == 0) {
            react_native_events_1.default.emitNativeEvent(SpotifyRemote, "eventUnsubscribed", type);
        }
    }
});
exports.default = SpotifyRemote;
//# sourceMappingURL=SpotifyRemote.js.map