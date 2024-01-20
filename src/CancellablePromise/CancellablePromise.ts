import type { Cancellable } from "./types";

/**
 * Cancellable Promise
 *
 * A wrapper around an asynchronous task of your choosing
 * that provides `cancel` method for rejecting the promise
 * if it's no longer needed.
 *
 * ```typescript
 * const myAsyncWork = (signal: AbortSignal) => {
 *   return fetch("/some-data", { signal });
 * }
 *
 * const CP = new CancellablePromise(myAsyncWork);
 * void CP.run().then(() => {});
 *
 * // To cancel => CP.cancel();
 * ```
 */
export class CancellablePromise<T> {
  private token = new AbortController();
  private readonly task: Cancellable<T>;
  constructor(task: Cancellable<T>) {
    this.task = task;
  }

  /**
   * Run
   *
   * Runs your promise and returns the result
   */
  public run() {
    return new Promise<T>((resolve, reject) => {
      const onAbort = () => {
        reject("The promise was cancelled");
      };
      if (this.token.signal.aborted) {
        onAbort();
      }
      this.token.signal.addEventListener("abort", onAbort);
      void this.task(this.token.signal).then(resolve).catch(reject);
    });
  }

  /**
   * Cancel
   *
   * Cancels your promise and rejects it
   */
  public cancel() {
    return this.token.abort();
  }
}
