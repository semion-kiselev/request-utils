import { SelectorField, State } from "./types.ts";
import {getIfToObjectsAreEqual, getIfPrimitivesAreEqual} from "./utils/utils.ts";

export const selectorFieldStateKeyMap: Record<SelectorField, keyof State> = {
  isLoading: "loaders",
  isFulfilled: "fulfilled",
  error: "errors",
  hasError: "errors",
  isRefreshing: "refreshers",
  isRefreshFulfilled: "refreshFulfilled",
  refreshError: "refreshErrors",
  hasRefreshError: "refreshErrors",
};

export const stateKeyChangeCheckerMap: Record<keyof State, (a: unknown, b: unknown) => boolean> = {
  "loaders": getIfPrimitivesAreEqual,
  "refreshers": getIfPrimitivesAreEqual,
  "fulfilled": getIfPrimitivesAreEqual,
  "refreshFulfilled": getIfPrimitivesAreEqual,
  "errors": getIfToObjectsAreEqual,
  "refreshErrors": getIfToObjectsAreEqual,
};

export const MANUAL_ABORT = "manual abort";
