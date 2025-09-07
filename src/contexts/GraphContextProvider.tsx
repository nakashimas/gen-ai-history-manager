import { useEffect, useState } from "react";
import { GraphContext, type EdgeProps, type NodeProps } from "./GraphContext";
import { isEqualContentsId } from "../utils/contentsId";

export const GraphContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [edges, setEdges] = useState<EdgeProps[]>([]);
  const [nodes, setNodes] = useState<NodeProps[]>([]);

  useEffect(() => {}, []);

  // --- ノード操作 ---
  const addNode = (node: NodeProps) => {
    setNodes((prev) => [...prev, node]);
  };

  const updateNode = (id: string, partial: Partial<NodeProps>) => {
    setNodes((prev) =>
      prev.map((n) => (isEqualContentsId(n.id, id) ? { ...n, ...partial } : n))
    );
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    // ノード削除に伴ってエッジも削除
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
  };

  // --- エッジ操作 ---
  const addEdge = (edge: EdgeProps) => {
    setEdges((prev) => [...prev, edge]);
  };

  const removeEdge = (id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <GraphContext.Provider
      value={{
        nodes,
        edges,
        addNode,
        updateNode,
        removeNode,
        addEdge,
        removeEdge,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
