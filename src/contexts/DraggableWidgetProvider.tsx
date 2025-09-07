import { useEffect, useRef, useState } from "react";
import {
  DraggableWidgetContext,
  type DragInfo,
} from "./DraggableWidgetContext";

export const DraggableWidgetProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
  const posRef = useRef<DragInfo | null>(null);

  const startDrag = (id: string, x: number, y: number) =>
    setDragInfo({ sourceId: id, x, y });

  const updateDrag = (x: number, y: number) => {
    if (posRef.current) {
      posRef.current.x = x;
      posRef.current.y = y;
    }
  };

  const endDrag = () => setDragInfo(null);

  // requestAnimationFrame で state を更新
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (posRef.current) {
        setDragInfo({ ...posRef.current });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <DraggableWidgetContext.Provider
      value={{ dragInfo, startDrag, updateDrag, endDrag }}
    >
      {children}
    </DraggableWidgetContext.Provider>
  );
};
