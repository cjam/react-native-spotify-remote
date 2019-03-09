export default interface ContentItem{
    /**
     * The primary title of the item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    title:string;
    /**
     * The secondary title of the item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    subtitle:string;
    /**
     * The unique identifier of the item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    id:string;
    /**
     * The playback URI of this item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    uri:string;
    
    /**
     * Returns YES if the item is directly playable, otherwise NO.
     *
     * @type {boolean}
     * @memberof SpotifyContentItem
     */
    playable:boolean;

    /**
     * Returns YES if the item is expected to contain children, otherwise NO.
     *
     * @type {boolean}
     * @memberof SpotifyContentItem
     */
    container:boolean;
}