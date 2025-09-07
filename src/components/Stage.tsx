import React, { useRef } from "react";
import { DraggableWidgetProvider } from "../contexts/DraggableWidgetProvider";
import { StageContext } from "../contexts/StageContext";
import { useZoomPan } from "../hooks/useZoomPan";
import { ContentsNodeMenuProvider } from "../contexts/ContentsNodeMenuProvider";
import ContentsNodeMenu from "./ContentsNodeMenu";
import StageRibbonMenu from "./StageRibbonMenu";
import {
  ContentsNode,
  type ContentsNodeHandle,
} from "../components/ContentsNode";
import { useGraph } from "../hooks/useGraph";
import type { EdgeProps, NodeProps } from "../contexts/GraphContext";
import { ContentsEdge } from "./ContentsEdge";
import { EDGE_MARKER_WIDTH } from "../utils/constants";

export const Stage: React.FC = () => {
  const { zoom, offset, bind } = useZoomPan(1, { x: 0, y: 0 });
  const { nodes, edges, updateNode, addEdge } = useGraph();
  const nodeRefs = useRef<
    Map<string, React.RefObject<ContentsNodeHandle | null>>
  >(new Map());

  if (nodeRefs.current.size === 0) {
    nodes.forEach((n) =>
      nodeRefs.current.set(n.id, React.createRef<ContentsNodeHandle>())
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragStart = (_id: string, _mouseX: number, _mouseY: number) => {
    // console.log("Stage: drag start", id, mouseX, mouseY);
  };

  const handleDrag = (id: string, mouseX: number, mouseY: number) => {
    updateNode(id, { x: mouseX, y: mouseY });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragEnd = (_id: string, _mouseX: number, _mouseY: number) => {
    // console.log("Stage: drag end", id, mouseX, mouseY);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragEndOn = (a: string, b: string, _x: number, _y: number) => {
    addEdge({ id: self.crypto.randomUUID(), from: a, to: b });
  };

  const generateNode = (node: NodeProps) => {
    const refs = nodeRefs.current.get(node.id);
    return (
      <ContentsNode
        key={node.id}
        id={node.id}
        x={node.x}
        y={node.y}
        ref={refs}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onDragEndOn={handleDragEndOn}
      />
    );
  };

  const generateEdge = (edge: EdgeProps) => {
    return <ContentsEdge key={edge.id} edge={edge} />;
  };

  return (
    <ContentsNodeMenuProvider>
      <DraggableWidgetProvider>
        <StageRibbonMenu />
        <StageContext.Provider value={{ zoom, offset }}>
          <div className="w-full h-full overflow-hidden">
            <svg
              width="100%"
              height="100%"
              {...bind} // wheel/pan イベントを適用
            >
              {/* 参照用 */}
              <defs>
                <marker
                  id="edge-arrowhead"
                  markerWidth={EDGE_MARKER_WIDTH}
                  markerHeight={EDGE_MARKER_WIDTH}
                  refX={EDGE_MARKER_WIDTH / 2}
                  refY={EDGE_MARKER_WIDTH / 2}
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <circle
                    cx={EDGE_MARKER_WIDTH / 2}
                    cy={EDGE_MARKER_WIDTH / 2}
                    r={EDGE_MARKER_WIDTH / 2 - 1}
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <circle
                    cx={EDGE_MARKER_WIDTH / 2}
                    cy={EDGE_MARKER_WIDTH / 2}
                    r={EDGE_MARKER_WIDTH / 4}
                    fill="black"
                  />
                </marker>
                <marker
                  id="edge-arrowhead-disabled"
                  markerWidth={EDGE_MARKER_WIDTH}
                  markerHeight={EDGE_MARKER_WIDTH}
                  refX={EDGE_MARKER_WIDTH / 2}
                  refY={EDGE_MARKER_WIDTH / 2}
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <circle
                    cx={EDGE_MARKER_WIDTH / 2}
                    cy={EDGE_MARKER_WIDTH / 2}
                    r={EDGE_MARKER_WIDTH / 4}
                    fill="black"
                  />
                </marker>
              </defs>

              {/* Stage 全体 transform */}
              <g
                transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}
              >
                {nodes.map(generateNode)}
                {edges.map(generateEdge)}
              </g>
            </svg>
          </div>
        </StageContext.Provider>
        <ContentsNodeMenu />
      </DraggableWidgetProvider>
    </ContentsNodeMenuProvider>
  );
};
