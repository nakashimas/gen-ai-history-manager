import { useContext } from "react";
import { GraphContext } from "../contexts/GraphContext";

export const useGraph = () => {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error("useGraph must be inside GraphContextProvider");
  return ctx;
};
