export type Cancellable<T> = (signal: AbortSignal) => Promise<T>;
