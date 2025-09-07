import { useContext } from "react";
import { DraggableWidgetContext } from "../contexts/DraggableWidgetContext";

export const useDrag = () => {
  const ctx = useContext(DraggableWidgetContext);
  if (!ctx) throw new Error("useDrag must be inside DragProvider");
  return ctx;
};
