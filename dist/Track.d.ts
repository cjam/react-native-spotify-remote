import Artist from './Artist';
import Album from './Album';
export default interface Track {
    name: string;
    uri: string;
    duration: number;
    artist: Artist;
    album: Album;
    saved: boolean;
    episode: boolean;
    podcast: boolean;
}
