import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from "react";
import { DraggableWidgetWrapper } from "./DraggableWidgetWrapper";
import { useMenu } from "../hooks/useMenu";
import { ContentsEdgeDraft } from "./ContentsEdgeDraft";
import {
  GLOBAL_HELP_MENU_ID,
  NODE_HEIGHT,
  NODE_WIDTH,
} from "../utils/constants";
import {
  EDGE_ID_PREFIX,
  isEqualContentsId,
  NODE_ID_PREFIX,
  resolveId,
} from "../utils/contentsId";
import { useGraph } from "../hooks/useGraph";
import { useDrag } from "../hooks/useDrag";

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
    // 元データ取得
    const { nodes, nodeOptions } = useGraph();
    const { dragInfo } = useDrag();
    const node = nodes.find((n) => isEqualContentsId(n.id, id));
    const nodeOption = nodeOptions.find((n) => isEqualContentsId(n.id, id)) ?? {
      id: resolveId(node?.id ?? ""),
    };

    // 保持するデータ
    const { openMenu } = useMenu();
    const [pos, setPos] = useState({ x, y });
    const [recentDragSourceId, setRecentDragSourceId] =
      useState<string>(GLOBAL_HELP_MENU_ID);

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

    useEffect(() => {
      if (dragInfo?.sourceId) setRecentDragSourceId(dragInfo.sourceId);
    }, [dragInfo, setRecentDragSourceId]);

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
          {/* タイトル */}
          <text dy={-6} dx={3}>
            {nodeOption.options?.label}
          </text>
          {/* 背景 */}

          {isEqualContentsId(recentDragSourceId, id) ? (
            <use href="#node-background-selected" />
          ) : (
            <use href="#node-background" />
          )}

          {/* アイコン */}
          <use
            href={`#node-foreground-${node?.type ?? 0}`}
            x={10}
            y={-480 + 98}
            width={NODE_WIDTH - 20}
          />
          {/* Utils Button */}
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
