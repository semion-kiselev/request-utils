import {useEffect, useState, useRef, useCallback} from "react";
import { SelectorField } from "../types";
import { state, toggleListeners } from "../state";

export const useRequestState = (key: string) => {
  const [, toggleBoolean] = useState(false);
  const forceUpdate = useCallback(() => toggleBoolean((prev) => !prev), []);

  const usedFieldsRef = useRef<Set<SelectorField>>(new Set());

  useEffect(() => {
    const usedFieldsList = usedFieldsRef.current;
    if (usedFieldsList.size === 0) return;
    toggleListeners(key, usedFieldsList, forceUpdate);

    return () => {
      toggleListeners(key, usedFieldsList, forceUpdate, true);
    };
  }, [forceUpdate, key]);

  const isLoading = state.loaders[key] || false;
  const isRefreshing = state.refreshers[key] || false;
  const isFulfilled = state.fulfilled[key] || false;
  const isRefreshFulfilled = state.refreshFulfilled[key] || false;
  const error = state.errors[key] || null;
  const hasError = Boolean(error);
  const refreshError = state.refreshErrors[key] || null;
  const hasRefreshError = Boolean(refreshError);


  let value = {
    isLoading,
    isRefreshing,
    isFulfilled,
    isRefreshFulfilled,
    error,
    hasError,
    refreshError,
    hasRefreshError
  };

  value = new Proxy(value, {
    get(target, prop, receiver) {
      usedFieldsRef.current.add(prop as SelectorField);
      return Reflect.get(target, prop, receiver);
    },
  });

  return value;
};
