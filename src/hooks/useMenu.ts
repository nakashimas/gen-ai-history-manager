import { useContext } from "react";
import { NodeMenuContext } from "../contexts/NodeMenuContext";

export const useMenu = () => {
  const ctx = useContext(NodeMenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
};
