import { MANUAL_ABORT } from "../constants.ts";

export const withCancelPrevious = <Arg, Return>(
  func: (arg: Arg, signal: AbortSignal) => Promise<Return>
) => {
  let controller: AbortController | undefined;
  const fn = (arg: Arg) => {
    if (controller) {
      controller.abort();
    }
    controller = new AbortController();
    return func(arg, controller.signal);
  };
  fn.abort = () => {
    if (controller) {
      controller.abort(MANUAL_ABORT);
    }
  };
  return fn;
};
