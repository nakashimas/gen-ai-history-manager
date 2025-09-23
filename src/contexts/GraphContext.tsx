import { createContext } from "react";
import { NodeType, type NodeOptions } from "./GraphContextOptions";

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

export type NodeProps = {
  id: string;
  x: number;
  y: number;
  type: NodeType;
};

export type EdgeProps = {
  id: string; // 識別子を追加しておくと便利
  from: string; // Node.id
  to: string; // Node.id
};

export type NodeOptionProps = {
  id: string; // Node.id
  options?: NodeOptions;
};

export type GraphContextType = {
  nodes: NodeProps[];
  edges: EdgeProps[];
  nodeOptions: NodeOptionProps[];
  setNodes: (nodes: NodeProps[]) => void;
  setEdges: (edges: EdgeProps[]) => void;
  setNodeOptions: (nodeOptions: NodeOptionProps[]) => void;
  // node
  addNode: (node: NodeProps) => void;
  updateNode: (id: string, partial: Partial<NodeProps>) => void;
  removeNode: (id: string) => void;
  // edge
  addEdge: (edge: EdgeProps) => void;
  removeEdge: (id: string) => void;
  // options
  addNodeOptions: (nodeOption: NodeOptionProps) => void;
  updateNodeOptions: (id: string, partial: Partial<NodeOptionProps>) => void;
  overwriteNodeOptions: (id: string, partial: NodeOptionProps) => void;
  removeNodeOptions: (id: string) => void;
};

export const GraphContext = createContext<GraphContextType | null>(null);
