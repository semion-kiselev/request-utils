import { State, Listeners, Listener, SelectorField, ServerErrorData} from "./types.ts";
import { omit } from "./utils/utils.ts";
import { selectorFieldStateKeyMap, stateKeyChangeCheckerMap } from "./constants.ts";

export const state: State = {
  loaders: {},
  fulfilled: {},
  errors: {},
  refreshers: {},
  refreshFulfilled: {},
  refreshErrors: {},
};

const listeners: Listeners = {
  loaders: {},
  fulfilled: {},
  errors: {},
  refreshers: {},
  refreshFulfilled: {},
  refreshErrors: {},
};

const checkAndClearStateByRequestKey = (key: string) => {
  console.log("HERE");
  const stateKeys = Object.keys(state) as (keyof State)[];
  console.log({ stateKeys });
  const couldRemoveKeyFromEverywhere = stateKeys.every((stateKey) => {
    const listenersSet = listeners[stateKey][key];
    console.log(stateKey, key, listenersSet);
    return !listenersSet || listenersSet.size === 0;
  });
  console.log({ couldRemoveKeyFromEverywhere });
  if (!couldRemoveKeyFromEverywhere) return;
  for (let i = 0; i < stateKeys.length; i++) {
    state[stateKeys[i]] = omit(state[stateKeys[i]], [key]);
  }
};

const toggleListener = (stateKey: keyof State, key: string, listener: Listener, unset: boolean = false) => {
  if (unset) {
    const listenersSet = listeners[stateKey][key];
    if (!listenersSet) {
      checkAndClearStateByRequestKey(key);
      return;
    }
    listenersSet.delete(listener);
    if (listenersSet.size === 0) {
      listeners[stateKey] = omit(listeners[stateKey], [key]);
      state[stateKey] = omit(state[stateKey], [key]);
      checkAndClearStateByRequestKey(key);
    }
    return;
  }

  if (listeners[stateKey][key]) {
    listeners[stateKey][key].add(listener);
  } else {
    listeners[stateKey][key] = new Set([listener]);
  }
};

export const toggleListeners = (key: string, fieldsSet: Set<SelectorField>, listener: Listener, unset: boolean = false) => {
  const fields = Array.from(fieldsSet);
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    console.log({ field });
    const stateKey = selectorFieldStateKeyMap[field];
    toggleListener(stateKey, key, listener, unset);
  }
};

const notify = (stateKey: keyof State, key: string) => {
  const listenersSet = listeners[stateKey][key];
  if (listenersSet && listenersSet.size > 0) {
    listenersSet.forEach((listener) => listener());
  }
};

export const setState = (stateKey: keyof State, key: string, value: ServerErrorData | boolean | null) => {
  const getIfEqual = stateKeyChangeCheckerMap[stateKey] || Object.is;
  if (getIfEqual(value, state[stateKey][key])) return;
  state[stateKey][key] = value;
  notify(stateKey, key);
};

export const logState = () => console.log(state);
export const logListeners = () => console.log(listeners);

export const addRefresher = (key: string) => setState("refreshers", key, true);
export const removeRefresher = (key: string) => setState("refreshers", key, false);

export const addLoader = (key: string) => setState("loaders", key, true);
export const removeLoader = (key: string) => setState("loaders", key, false);

export const addFulfilled = (key: string) => setState("fulfilled", key, true);
export const removeFulfilled = (key: string) => setState("fulfilled", key, false);

export const addRefreshFulfilled = (key: string) => setState("refreshFulfilled", key, true);
export const removeRefreshFulfilled = (key: string) => setState("refreshFulfilled", key, false);

export const addError = (key: string, error: ServerErrorData) => setState("errors", key, error);
export const removeError = (key: string) => setState("errors", key, null);

export const addRefreshError = (key: string, error: ServerErrorData) => setState("refreshErrors", key, error);
export const removeRefreshError = (key: string) => setState("refreshErrors", key, null);
