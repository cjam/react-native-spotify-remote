import { EmitterSubscription } from "react-native";

/**
 * An EventEmitter that supports events given by the interface in {T}
 * Where each Key represents the eventName and the type represents the payload
 * 
 * @export
 * @interface TypedEventEmitter
 * @template T
 */
export default interface TypedEventEmitter<T> {
    addListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): EmitterSubscription;
    /**
     * @deprecated Use `remove` on the EventSubscription from `addListener`.
     */
    removeListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): void;
    removeAllListeners<K extends keyof T>(event?: K): void;
    emit<K extends keyof T>(event: K, args: T[K]): void;
    eventNames(): Array<keyof T>;
    listenerCount<K extends keyof T>(type: K): number;
    /**
     * @deprecated Use `addListener` instead.
     */
    on<K extends keyof T>(name: K, listener: (v: T[K]) => void): EmitterSubscription;
    /**
     * @deprecated Use `remove` on the EventSubscription from `addListener`.
     */
    off<K extends keyof T>(event: K, listener: (v: T[K]) => void): void;
}