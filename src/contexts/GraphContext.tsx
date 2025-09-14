import { createContext } from "react";
import type { NodeOptions } from "./GraphContextOptions";

// NodeType 定義
const NodeType = {
  Plaintext: 0,
  Picture: 1,
  Video: 2,
  Preprocessing: 3,
  API: 4,
  AI: 5,
} as const;

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
  options: NodeOptions;
};

export type GraphContextType = {
  nodes: NodeProps[];
  edges: EdgeProps[];
  nodeOptions: NodeOptionProps[];
  addNode: (node: NodeProps) => void;
  updateNode: (id: string, partial: Partial<NodeProps>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: EdgeProps) => void;
  removeEdge: (id: string) => void;
  addNodeOptions: (node: NodeOptionProps) => void;
  updateNodeOptions: (id: string, partial: Partial<NodeOptionProps>) => void;
  removeNodeOptions: (id: string) => void;
};

export const GraphContext = createContext<GraphContextType | null>(null);
