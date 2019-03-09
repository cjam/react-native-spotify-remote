import Artist from './Artist';
import Album from './Album';

export default interface Track{
    name:string;
    uri:string;
    duration:number;
    artist:Artist;
    album:Album;
    
    // Android
    // ImageUri
    // artists

    // IOS
    // ImageProtocol: https://spotify.github.io/ios-sdk/html/Protocols/SPTAppRemoteImageAPI.html
    // saved: boolean
}