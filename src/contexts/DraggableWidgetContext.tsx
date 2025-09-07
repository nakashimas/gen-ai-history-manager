// DragContext.tsx
import { createContext } from "react";

export type DragInfo = {
  sourceId: string | null; // drag開始したwidget
  x: number;
  y: number;
};

type DraggableWidgetContextType = {
  dragInfo: DragInfo | null;
  startDrag: (id: string, x: number, y: number) => void;
  updateDrag: (x: number, y: number) => void;
  endDrag: () => void;
};

export const DraggableWidgetContext =
  createContext<DraggableWidgetContextType | null>(null);
