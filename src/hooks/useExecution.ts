import { useContext } from "react";
import { ExecutionContext } from "../contexts/ExecutionContext";

export function useExecution() {
  const ctx = useContext(ExecutionContext);
  if (!ctx) {
    throw new Error("useExecution must be used within ExecutionProvider");
  }
  return ctx;
}
