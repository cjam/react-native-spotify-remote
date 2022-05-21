/**
 * An EventEmitter that supports events given by the interface in {T}
 * Where each Key represents the eventName and the type represents the payload
 * 
 * @export
 * @interface TypedEventEmitter
 * @template T
 */
export default interface TypedEventEmitter<T> {
    addListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
    removeListener<K extends keyof T>(event: K, listener?: (v: T[K]) => void): this;
    removeAllListeners<K extends keyof T>(event?: K): this;
    emit<K extends keyof T>(event: K, args: T[K]): boolean;
    listenerCount<K extends keyof T>(type: K): number;
    on<K extends keyof T>(name: K, listener: (v: T[K]) => void): this;
    off<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
}