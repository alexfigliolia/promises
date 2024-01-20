import type { Task, TimedPromiseResolution } from "./types";

/**
 * Timed Promise
 *
 * A Promise wrapper that will execute your task against
 * a threshold number of milliseconds. When your promise
 * resolves or rejects, you'll receive the result/error
 * as well as any remaining milliseconds of your threshold.
 *
 * A common use-case for timed promises are scheduling
 * asynchronous work against UI transitions that may require
 * a certain duration to complete. Using `TimedPromise` you
 * can run your asynchronous work while scheduling any
 * remaining UI transitions against the remaining threshold
 *
 *
 * ```typescript
 * const TP = new TimedPromise(async () => {}, 1000);
 * const { result, remainingMS } = await TP.run();
 *
 * setTimeout(() => removeLoadingState(), remainingMS);
 * ```
 */
export class TimedPromise<T> {
  readonly threshold: number;
  private readonly task: Task<T>;
  constructor(task: Task<T>, threshold: number) {
    this.task = task;
    this.threshold = threshold;
  }

  /**
   * Run
   *
   * Executes your promise and resolves/rejects with the following:
   *
   * ```typescript
   * const result = {
   *   result: "Your promise result",
   *   rejected: false, // or true,
   *   remainingMS: 10
   * }
   * ```
   */
  public async run() {
    const then = performance.now();
    return new Promise<TimedPromiseResolution<T>>((resolve, reject) => {
      void this.task()
        .then((result) => {
          resolve({
            result,
            rejected: false,
            remainingMS: this.diff(then),
          });
        })
        .catch((error) => {
          reject({
            result: error,
            rejected: true,
            remainingMS: this.diff(then),
          });
        });
    });
  }

  private diff(then: number) {
    const diff = performance.now() - then;
    if (diff > this.threshold) {
      return 0;
    }
    return this.threshold - diff;
  }
}
