import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import { DraggableWidgetWrapper } from "./DraggableWidgetWrapper";
import { COLOR_BLACK } from "../utils/constants";

export type ContentsEdgeProps = {
  id: string;
  x: number;
  y: number;
  // 親要素がドラッグ可能オブジェクトの場合それに追従するため
  transform?: string;
  onDragStart?: (id: string, x: number, y: number) => void;
  onDrag?: (id: string, x: number, y: number) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
};

export type ContentsEdgeHandle = {
  getPos: () => { x: number; y: number };
  setPos: (x: number, y: number) => void;
  getTargetPos: () => { x: number; y: number };
  setTargetPos: (x: number, y: number) => void;
};

export const ContentsEdgeDraft = forwardRef<
  ContentsEdgeHandle,
  ContentsEdgeProps
>(({ id, x, y, transform, onDragStart, onDrag, onDragEnd }, ref) => {
  const [sourcePos, setSourcePos] = useState({ x, y });
  const [targetPos, setTargetPos] = useState({ x, y });

  // ドラッグ開始時に計算する補正オフセットを保持
  const dragOffset = useRef({ dx: 0, dy: 0 });

  useImperativeHandle(ref, () => ({
    getPos: () => sourcePos,
    setPos: (x: number, y: number) => setSourcePos({ x, y }),
    getTargetPos: () => targetPos,
    setTargetPos: (x: number, y: number) => setTargetPos({ x, y }),
  }));

  const handleDragStart = (id: string, mouseX: number, mouseY: number) => {
    // クリック位置と要素の位置の差を記憶
    dragOffset.current = {
      dx: mouseX - sourcePos.x,
      dy: mouseY - sourcePos.y,
    };
    onDragStart?.(id, targetPos.x, targetPos.y);
  };

  const handleDrag = (id: string, mouseX: number, mouseY: number) => {
    // 補正を反映
    const newX = mouseX - dragOffset.current.dx;
    const newY = mouseY - dragOffset.current.dy;

    setTargetPos({ x: newX, y: newY });
    onDrag?.(id, newX, newY);
  };

  const handleDragEnd = (id: string, mouseX: number, mouseY: number) => {
    const newX = mouseX - dragOffset.current.dx;
    const newY = mouseY - dragOffset.current.dy;

    setTargetPos({ x: sourcePos.x, y: sourcePos.y });
    onDragEnd?.(id, newX, newY);
  };

  const handleDragEndOn = (a: string, b: string, x: number, y: number) => {
    console.log(a, b, x, y, "create line");
  };

  return (
    <DraggableWidgetWrapper
      id={id}
      transform={transform}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragEndOn={handleDragEndOn}
    >
      <circle className="cursor-grab" cx={sourcePos.x} cy={sourcePos.y} r="8" />
      {/* ドラフト線 */}
      <line
        x1={sourcePos.x}
        y1={sourcePos.y}
        x2={targetPos.x}
        y2={targetPos.y}
        stroke={COLOR_BLACK}
        strokeWidth={2}
        strokeDasharray="6 4" // 点線パターン: 6px 線 + 4px スペース
        strokeDashoffset={0} // 初期オフセット
        markerEnd="url(#edge-arrowhead)"
        style={{
          animation: "dash-move 0.5s linear infinite",
        }}
      />
    </DraggableWidgetWrapper>
  );
});
