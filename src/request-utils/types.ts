import { GenericAbortSignal } from "axios";

export type ServerErrorData = {
  status?: number;
  message?: string;
  data?: unknown;
};

export type ListenersBox = Record<string, Set<Listener>>;
export type Listener = () => void;

export type State = {
  loaders: Record<string, boolean>;
  fulfilled: Record<string, boolean>;
  errors: Record<string, ServerErrorData | null>;
  refreshers: Record<string, boolean>;
  refreshFulfilled: Record<string, boolean>;
  refreshErrors: Record<string, ServerErrorData | null>;
};

export type Listeners = Record<keyof State, ListenersBox>;

export type SelectorField =
  | "isLoading"
  | "isFulfilled"
  | "error"
  | "hasError"
  | "isRefreshing"
  | "isRefreshFulfilled"
  | "refreshError"
  | "hasRefreshError";

export type AbortSignalWithReason = GenericAbortSignal & {
  reason?: string;
};

export type WithRequestStateOptions<Arg> = {
  key: string | ((arg?: Arg) => string);
  isRefreshing?: boolean;
  preventErrorThrow?: boolean;
};
