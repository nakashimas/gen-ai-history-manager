import { createContext } from "react";

type StageContextType = {
  zoom: number;
  offset: { x: number; y: number };
};

export const StageContext = createContext<StageContextType>({
  zoom: 1,
  offset: { x: 0, y: 0 },
});
