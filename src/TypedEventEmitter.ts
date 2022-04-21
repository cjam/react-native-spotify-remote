import { EmitterSubscription } from "react-native";

/**
 * An EventEmitter that supports events given by the interface in {T}
 * Where each Key represents the eventName and the type represents the payload
 * This interface is based on the implementation here: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-native/index.d.ts#L178
 * 
 * @export
 * @interface TypedEventEmitter
 * @template T
 */
export default interface TypedEventEmitter<T> {
    addListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): EmitterSubscription;
    removeAllListeners<K extends keyof T>(event?: K): void;
    emit<K extends keyof T>(event: K, args: T[K]): void;

    /**
     * @deprecated Use `remove` on the EventSubscription from `addListener`.
     */
    removeListener(eventType: string, listener: (...args: any[]) => any): void;
}