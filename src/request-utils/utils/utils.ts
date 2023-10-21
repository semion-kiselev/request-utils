import { AxiosError } from "axios";
import { ServerErrorData } from "../types.ts";

export const omit = <T extends object>(entity: T, attrs: (keyof T)[]) =>
  Object.fromEntries(
    Object.entries(entity).filter(([key]) => !attrs.includes(key as keyof T)),
  );

export const getIfPrimitivesAreEqual = (oldValue: unknown, newValue: unknown) => {
  if (!oldValue && !newValue) return true;
  return oldValue === newValue;
};

export const getIfToObjectsAreEqual = (oldValue: unknown, newValue: unknown) => {
  if (!oldValue && !newValue) return true;
  return JSON.stringify(oldValue) === JSON.stringify(newValue);
};

export const getErrorData = (error: AxiosError): ServerErrorData => {
  const isClientError = Boolean(error.response?.status?.toString().startsWith("4"));
  return {
    status: error.response?.status,
    message: isClientError ? error.message || "Unknown client error" : "Internal server error",
    data: isClientError ? error.response?.data : undefined,
  };
};
