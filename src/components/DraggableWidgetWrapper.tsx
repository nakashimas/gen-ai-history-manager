import React, { useCallback, useContext } from "react";
import { useDrag } from "../hooks/useDrag";
import { StageContext } from "../contexts/StageContext";
import { isEqualContentsId } from "../utils/contentsId";

type DraggableWidgetWrapperProps = {
  id: string;
  transform?: string; // 親から渡せるようにする
  children: React.ReactNode;
  onDragStart?: (id: string, x: number, y: number) => void;
  onDrag?: (id: string, x: number, y: number) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  onDragEndOn?: (a: string, b: string, x: number, y: number) => void;
};

export const DraggableWidgetWrapper: React.FC<DraggableWidgetWrapperProps> = ({
  id,
  transform,
  children,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragEndOn,
}) => {
  const { dragInfo, startDrag, updateDrag, endDrag } = useDrag();
  const { zoom, offset } = useContext(StageContext);

  // Stage 座標に変換
  const toStageCoords = useCallback(
    (clientX: number, clientY: number) => ({
      x: (clientX - offset.x) / zoom,
      y: (clientY - offset.y) / zoom,
    }),
    [zoom, offset]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const { x: clientX, y: clientY } = toStageCoords(e.clientX, e.clientY);

      startDrag(id, clientX, clientY);
      onDragStart?.(id, clientX, clientY);

      const onMove = (moveEvent: MouseEvent) => {
        const { x: clientX, y: clientY } = toStageCoords(
          moveEvent.clientX,
          moveEvent.clientY
        );
        updateDrag(clientX, clientY);
        onDrag?.(id, clientX, clientY);
      };

      const onUp = (upEvent: MouseEvent) => {
        const { x: clientX, y: clientY } = toStageCoords(
          upEvent.clientX,
          upEvent.clientY
        );
        endDrag();
        onDragEnd?.(id, clientX, clientY);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [
      id,
      startDrag,
      updateDrag,
      endDrag,
      onDragStart,
      onDrag,
      onDragEnd,
      toStageCoords,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // ここは完全一致をみる
      if (dragInfo?.sourceId === id) {
        const { x: clientX, y: clientY } = toStageCoords(e.clientX, e.clientY);
        updateDrag(clientX, clientY);
        onDrag?.(id, clientX, clientY);
      }
    },
    // dragInfoを対象外にする
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, updateDrag, onDrag, toStageCoords]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const { x: clientX, y: clientY } = toStageCoords(e.clientX, e.clientY);
      // ここは完全一致をみない。同じIDの、違うオブジェクトはDnDの宛先にならない
      if (
        !isEqualContentsId(String(dragInfo?.sourceId), id) &&
        dragInfo &&
        dragInfo.sourceId
      ) {
        onDragEndOn?.(dragInfo.sourceId, id, clientX, clientY);
      }
    },
    [id, dragInfo, onDragEndOn, toStageCoords]
  );

  return (
    <g
      id={id}
      transform={transform}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}
    </g>
  );
};
