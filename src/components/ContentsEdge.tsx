import React, { useEffect, useState } from "react";
import { useGraph } from "../hooks/useGraph";
import type { EdgeProps } from "../contexts/GraphContext";
import {
  COLOR_BLACK,
  GLOBAL_HELP_MENU_ID,
  NODE_HEIGHT,
  NODE_WIDTH,
} from "../utils/constants";
import { isEqualContentsId } from "../utils/contentsId";
import { useDrag } from "../hooks/useDrag";

type ContentsEdgeProps = {
  edge: EdgeProps;
};

export const ContentsEdge: React.FC<ContentsEdgeProps> = ({ edge }) => {
  const { nodes, removeEdge } = useGraph();
  const { dragInfo } = useDrag();
  const [recentDragSourceId, setRecentDragSourceId] =
    useState<string>(GLOBAL_HELP_MENU_ID);

  useEffect(() => {
    if (dragInfo?.sourceId) setRecentDragSourceId(dragInfo.sourceId);
  }, [dragInfo, setRecentDragSourceId]);

  // ノードが見つからない場合は描画しない
  const fromNode = nodes.find((n) => isEqualContentsId(n.id, edge.from));
  if (!fromNode) return null;
  const toNode = nodes.find((n) => isEqualContentsId(n.id, edge.to));
  if (!toNode) return null;

  const x1 = fromNode.x + NODE_WIDTH;
  const y1 = fromNode.y + NODE_HEIGHT / 2;
  const x2 = toNode.x;
  const y2 = toNode.y + NODE_HEIGHT / 2;

  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  return (
    <>
      <line
        className="pointer-none"
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={COLOR_BLACK}
        strokeWidth={2}
        markerEnd="url(#edge-arrowhead-disabled)"
        markerStart="url(#edge-arrowhead)"
      />
      {(isEqualContentsId(recentDragSourceId, edge.from) ||
        isEqualContentsId(recentDragSourceId, edge.to)) && (
        <use
          x={cx}
          y={cy}
          href="#node-remove"
          onClick={() => removeEdge(edge.id)}
          opacity={0.5}
        />
      )}
    </>
  );
};
