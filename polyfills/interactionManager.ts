import ReactNative from "react-native";

/**
 * RN 0.88 removed InteractionManager. @react-navigation/stack still uses it
 * for card transitions. Provide a minimal idle-callback-based shim so we can
 * keep the main-branch stack navigator (home/layout parity) on SDK 58.
 */
const interactionManagerShim = {
  Events: {
    interactionStart: "interactionStart",
    interactionComplete: "interactionComplete",
  },
  runAfterInteractions(task?: (() => unknown) | { gen: () => unknown }) {
    let cancelled = false;
    const promise = new Promise<unknown>((resolve) => {
      const schedule =
        typeof requestIdleCallback === "function"
          ? (cb: () => void) => requestIdleCallback(() => cb())
          : (cb: () => void) => setTimeout(cb, 0);
      schedule(() => {
        if (cancelled) {
          resolve(undefined);
          return;
        }
        if (typeof task === "function") {
          resolve(task());
        } else if (task && typeof task.gen === "function") {
          resolve(task.gen());
        } else {
          resolve(undefined);
        }
      });
    });
    return {
      then: promise.then.bind(promise),
      done: (...args: unknown[]) =>
        // legacy TaskHandle API
        (promise as Promise<unknown> & { done?: Function }).then?.(...args),
      cancel() {
        cancelled = true;
      },
    };
  },
  createInteractionHandle() {
    return -1;
  },
  clearInteractionHandle(_handle: number) {},
  setDeadline(_deadline: number) {},
};

Object.defineProperty(ReactNative, "InteractionManager", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: interactionManagerShim,
});
