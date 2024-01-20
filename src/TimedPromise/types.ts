export type Task<T> = () => Promise<T>;

export interface ITimedPromise<T> {
  task: Task<T>;
  threshold: number;
}

interface TimedPromiseResult<T, R extends boolean> {
  result: T;
  rejected: R;
  remainingMS: number;
}

export type TimedPromiseResolution<T> = TimedPromiseResult<T, false>;
export type TimedPromiseRejection = TimedPromiseResult<unknown, true>;
