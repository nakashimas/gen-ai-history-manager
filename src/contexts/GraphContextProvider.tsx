import { useEffect, useState } from "react";
import {
  GraphContext,
  type EdgeProps,
  type NodeProps,
  type NodeOptionProps,
} from "./GraphContext";
import { isEqualContentsId } from "../utils/contentsId";
import { deepMerge } from "../utils/deepMerge";

export const GraphContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [edges, setEdges] = useState<EdgeProps[]>([]);
  const [nodes, setNodes] = useState<NodeProps[]>([]);
  const [nodeOptions, setNodeOptions] = useState<NodeOptionProps[]>([]);

  useEffect(() => {}, []);

  // --- ノード操作 ---
  const addNode = (node: NodeProps) => {
    setNodes((prev) => [...prev, node]);
  };

  const updateNode = (id: string, partial: Partial<NodeProps>) => {
    setNodes((prev) =>
      prev.map((n) => (isEqualContentsId(n.id, id) ? deepMerge(n, partial) : n))
    );
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    // ノード削除に伴ってエッジも削除
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    // ノード削除に伴ってノード情報も削除
    setNodeOptions((prev) => prev.filter((o) => o.id !== id && o.id !== id));
  };

  // --- エッジ操作 ---
  const addEdge = (edge: EdgeProps) => {
    setEdges((prev) => [...prev, edge]);
  };

  const removeEdge = (id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  };

  // --- ノード情報操作 ---
  const addNodeOptions = (nodeOption: NodeOptionProps) => {
    setNodeOptions((prev) => [...prev, nodeOption]);
  };

  const updateNodeOptions = (id: string, partial: Partial<NodeOptionProps>) => {
    const prevOption = nodeOptions.find((n) => isEqualContentsId(n.id, id));
    if (!prevOption) addNodeOptions({ id: id });

    console.log(nodeOptions, partial);

    setNodeOptions((prev) =>
      prev.map((o) => (isEqualContentsId(o.id, id) ? deepMerge(o, partial) : o))
    );
  };

  const removeNodeOptions = (id: string) => {
    setNodeOptions((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <GraphContext.Provider
      value={{
        nodes,
        edges,
        nodeOptions,
        addNode,
        updateNode,
        removeNode,
        addEdge,
        removeEdge,
        addNodeOptions,
        updateNodeOptions,
        removeNodeOptions,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
