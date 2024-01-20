# Promises
A small wrapper library around the native Promise API that provides two core utilities - `Cancellable` Promises and `Timed` Promises.

A Cancellable Promise is simply a Promise with a `cancel` method attached to it. Using it you can stop promises mid-flight and even cancel in progress network requests.

A Timed Promise is niche utility that allows a promises pending duration to be measured against a provided threshold. If the promise resolves or rejects, it'll do so yielding the result as well as the remaining milliseconds of the threshold.

### Installation
```bash
npm i @figliolia/promises
# or
yarn add @figliolia/promises
```

### Basic Usage

#### Cancellable Promise
```typescript
import { CancellablePromise } from "@figliolia/promises";

const myAsyncWork = (signal: AbortSignal) => {
  return fetch("/some-data", { signal });
}

const CP = new CancellablePromise(myAsyncWork);
await CP.run();
// To cancel:
CP.cancel()
```
In the above example, we've wrapped our asynchronous task in a function accepting an `AbortSignal`. The `CancellablePromise` interface will provide your asynchronous task with a signal that you can pass down into further asynchronous work - yielding you the ability to cancel any number of asynchronous tasks at once with a call to `cancel()`.

#### Timed Promise
```typescript
import { TimedPromise } from "@figliolia/promises";

const myAsyncWork = () => {
  // trigger a loading spinner or something
  return fetch("/some-data", { signal });
}

const TP = new TimedPromise(myAsyncWork, 1000);
const { result, remainingMS } = await TP.run();
if(remainingMS > 0) {
  // Defer hiding the loading state so soon that
  // it may be a jarring visual to some users
  setTimeout(/* hide loading state */, remainingMS);
} else {
  // Carry about your business
}
```

#### Composing them Together
```typescript
import { 
  TimedPromise,
  CancellablePromise
} from "@figliolia/promises";

const myAsyncWork = () => {
  // trigger a loading spinner or something
  return fetch("/some-data", { signal });
}

const CP = new CancellablePromise(myAsyncWork);
const TP = new TimedPromise(() => CP.run(), 1000);
const { result, remainingMS } = await TP.run();
// or
CP.cancel() // which would cancel your TP and CP at once!
```

### Background and Contributions
I often find myself spinning up utilities such as these on fly, then kicking myself when I have to write them again in a new project or company. If you find yourself in my shoes, please feel free to PR this repository with your utilities and polyfills and I'll review promptly!