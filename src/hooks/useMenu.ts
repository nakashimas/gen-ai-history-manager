import { useContext } from "react";
import { ContentsNodeMenuContext } from "../contexts/ContentsNodeMenuContext";

export const useMenu = () => {
  const ctx = useContext(ContentsNodeMenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
};
