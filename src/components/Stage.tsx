import React, { useRef } from "react";
import { DraggableWidgetProvider } from "../contexts/DraggableWidgetProvider";
import { StageContext } from "../contexts/StageContext";
import { useZoomPan } from "../hooks/useZoomPan";
import { NodeMenuProvider } from "../contexts/NodeMenuProvider";
import NodeMenu from "./menu/NodeMenu";
import StageRibbonMenu from "./StageRibbonMenu";
import {
  ContentsNode,
  type ContentsNodeHandle,
} from "../components/ContentsNode";
import { useGraph } from "../hooks/useGraph";
import type { EdgeProps, NodeProps } from "../contexts/GraphContext";
import { ContentsEdge } from "./ContentsEdge";
import {
  EDGE_ID_PREFIX,
  isEqualContentsId,
  resolveId,
} from "../utils/contentsId";
import { ContentsNodeDefs } from "./ContentsNodeDefs";
import { ExecutionProvider } from "../contexts/ExecutionProvider";

export const Stage: React.FC = () => {
  const { zoom, offset, bind } = useZoomPan(1, { x: 0, y: 0 });
  const {
    nodes,
    edges,
    nodeOptions,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    addNodeOptions,
  } = useGraph();
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
    if (a.endsWith(EDGE_ID_PREFIX)) {
      addEdge({
        id: self.crypto.randomUUID(),
        from: resolveId(a),
        to: resolveId(b),
      });
    }
  };

  const handleClickNodeDelete = (id: string) => {
    removeNode(id);
  };

  const handleClickNodeReproduction = (id: string) => {
    const targetNode = nodes.find((n) => isEqualContentsId(n.id, id));
    const targetNodeOptions = nodeOptions.find((o) =>
      isEqualContentsId(o.id, id)
    );
    const newId = self.crypto.randomUUID();

    if (targetNode) {
      addNode({
        id: newId,
        x: targetNode.x + 10,
        y: targetNode.y + 10,
        type: targetNode.type,
      });
    }
    if (targetNodeOptions?.options) {
      addNodeOptions({
        id: newId,
        options: { ...targetNodeOptions.options },
      });
    }
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
        onClickNodeDelete={() => handleClickNodeDelete(node.id)}
        onClickNodeReproduction={() => handleClickNodeReproduction(node.id)}
      />
    );
  };

  const generateEdge = (edge: EdgeProps) => {
    return <ContentsEdge key={edge.id} edge={edge} />;
  };

  return (
    <NodeMenuProvider>
      <DraggableWidgetProvider>
        <ExecutionProvider>
          <StageRibbonMenu />
          <StageContext.Provider value={{ zoom, offset }}>
            <div className="w-full h-full overflow-hidden">
              <svg
                width="100%"
                height="100%"
                {...bind} // wheel/pan イベントを適用
              >
                {/* 参照用 */}
                <ContentsNodeDefs />

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
          <NodeMenu />
        </ExecutionProvider>
      </DraggableWidgetProvider>
    </NodeMenuProvider>
  );
};
