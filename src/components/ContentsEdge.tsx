import React from "react";
import { useGraph } from "../hooks/useGraph";
import type { EdgeProps } from "../contexts/GraphContext";
import { NODE_HEIGHT, NODE_WIDTH } from "../utils/constants";
import { isEqualContentsId } from "../utils/contentsId";

type ContentsEdgeProps = {
  edge: EdgeProps;
};

export const ContentsEdge: React.FC<ContentsEdgeProps> = ({ edge }) => {
  const { nodes } = useGraph();

  const fromNode = nodes.find((n) => isEqualContentsId(n.id, edge.from));
  const toNode = nodes.find((n) => isEqualContentsId(n.id, edge.to));

  if (!fromNode || !toNode) {
    // ノードが見つからない場合は描画しない
    return null;
  }

  return (
    <line
      className="pointer-none"
      x1={fromNode.x + NODE_WIDTH}
      y1={fromNode.y + NODE_HEIGHT / 2}
      x2={toNode.x}
      y2={toNode.y + NODE_HEIGHT / 2}
      stroke="black"
      strokeWidth={2}
      markerEnd="url(#edge-arrowhead-disabled)"
      markerStart="url(#edge-arrowhead)"
    />
  );
};
