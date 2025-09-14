import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import { DraggableWidgetWrapper } from "./DraggableWidgetWrapper";
import { useMenu } from "../hooks/useMenu";
import { ContentsEdgeDraft } from "./ContentsEdgeDraft";
import { NODE_HEIGHT, NODE_WIDTH } from "../utils/constants";
import { EDGE_ID_PREFIX, NODE_ID_PREFIX } from "../utils/contentsId";

export type ContentsNodeProps = {
  id: string;
  x: number;
  y: number;
  onDragStart?: (id: string, x: number, y: number) => void;
  onDrag?: (id: string, x: number, y: number) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  onDragEndOn?: (a: string, b: string, x: number, y: number) => void;
  onClickNodeDelete?: () => void;
  onClickNodeReproduction?: () => void;
};

export type ContentsNodeHandle = {
  getPos: () => { x: number; y: number };
  setPos: (x: number, y: number) => void;
};

export const ContentsNode = forwardRef<ContentsNodeHandle, ContentsNodeProps>(
  (
    {
      id,
      x,
      y,
      onDragStart,
      onDrag,
      onDragEnd,
      onDragEndOn,
      onClickNodeDelete,
      onClickNodeReproduction,
    },
    ref
  ) => {
    const { openMenu } = useMenu();
    const [pos, setPos] = useState({ x, y });

    // ドラッグ開始時に計算する補正オフセットを保持
    const dragOffset = useRef({ dx: 0, dy: 0 });

    useImperativeHandle(ref, () => ({
      getPos: () => pos,
      setPos: (x: number, y: number) => setPos({ x, y }),
    }));

    const handleDragStart = (id: string, mouseX: number, mouseY: number) => {
      // クリック位置と要素の位置の差を記憶
      dragOffset.current = { dx: mouseX - pos.x, dy: mouseY - pos.y };
      onDragStart?.(id, pos.x, pos.y);
    };

    const handleDrag = (id: string, mouseX: number, mouseY: number) => {
      // 補正を反映
      const newX = mouseX - dragOffset.current.dx;
      const newY = mouseY - dragOffset.current.dy;

      setPos({ x: newX, y: newY });
      onDrag?.(id, newX, newY);
    };

    const handleDragEnd = (id: string, mouseX: number, mouseY: number) => {
      const newX = mouseX - dragOffset.current.dx;
      const newY = mouseY - dragOffset.current.dy;

      openMenu();
      setPos({ x: newX, y: newY });
      onDragEnd?.(id, newX, newY);
    };

    return (
      <>
        <DraggableWidgetWrapper
          id={id + NODE_ID_PREFIX}
          transform={`translate(${pos.x}, ${pos.y})`}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onDragEndOn={onDragEndOn}
        >
          <use href="#node-background" />
          {/* <use href="#node-foreground" /> */}

          <use
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT}
            href="#node-remove"
            onClick={onClickNodeDelete}
          />
          <use
            x={NODE_WIDTH / 4}
            y={NODE_HEIGHT}
            href="#node-reproduction"
            onClick={onClickNodeReproduction}
          />
        </DraggableWidgetWrapper>
        <ContentsEdgeDraft
          id={id + EDGE_ID_PREFIX}
          transform={`translate(${pos.x}, ${pos.y})`}
          x={NODE_WIDTH}
          y={NODE_HEIGHT / 2}
        ></ContentsEdgeDraft>
      </>
    );
  }
);
