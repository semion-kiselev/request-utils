import { AxiosError } from "axios";
import { WithRequestStateOptions, AbortSignalWithReason } from "../types";
import { MANUAL_ABORT } from "../constants";
import { getErrorData } from "./utils";
import {
  addRefresher,
  removeRefresher,
  addLoader,
  removeLoader,
  addFulfilled,
  removeFulfilled,
  addRefreshFulfilled,
  removeRefreshFulfilled,
  addError,
  removeError,
  addRefreshError,
  removeRefreshError,
} from "../state";

export const withRequestState = <Arg, Return>(
  func: (arg: Arg) => Promise<Return>,
  { key, isRefreshing = false, preventErrorThrow = false }: WithRequestStateOptions<Arg>
) => {
  const addPending = isRefreshing ? addRefresher : addLoader;
  const removePending = isRefreshing ? removeRefresher : removeLoader;
  const addRequestError = isRefreshing ? addRefreshError : addError;
  const removeRequestError = isRefreshing ? removeRefreshError : removeError;
  const addRequestFulfilled = isRefreshing ? addRefreshFulfilled : addFulfilled;
  const removeRequestFulfilled = isRefreshing ? removeRefreshFulfilled : removeFulfilled;

  return (arg: Arg) => {
    const requestKey = typeof key === "function" ? key(arg) : key;

    removeRequestError(requestKey);
    removeRequestFulfilled(requestKey);

    addPending(requestKey);

    return func(arg)
      .then((result) => {
        removePending(requestKey);
        addRequestFulfilled(requestKey);
        return result;
      })
      .catch((error: AxiosError) => {
        if (error.message === "canceled") {
          const isManualAbort =
            (error.config?.signal as AbortSignalWithReason)?.reason === MANUAL_ABORT;

          if (isManualAbort) {
            removePending(requestKey);
          }
          return;
        }
        addRequestError(requestKey, getErrorData(error));
        removePending(requestKey);
        if (preventErrorThrow) return;
        throw error;
      });
  };
};
