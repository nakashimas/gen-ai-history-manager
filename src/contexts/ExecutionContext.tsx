import { createContext } from "react";
import { type EdgeProps, type NodeProps } from "./GraphContext";

export type ExecutionNodeState =
  | "pending"
  | "ready"
  | "running"
  | "done"
  | "cancelled";

export type ExecutionNode = {
  id: string;
  state: ExecutionNodeState;
  dependents: string[];
  parents: string[];
  remainingDependencies: number;
};

export type ExecutionNodeContextType = {
  operations: Map<string, AbortController>;
  graph: Map<string, ExecutionNode>;
  // accessor
  setGraph: (newGraph: Map<string, ExecutionNode>) => void;
  setGraphProps: (nodes: NodeProps[], edges: EdgeProps[]) => void;
  // operations
  start: (id: string, nodes?: NodeProps[], edges?: EdgeProps[]) => void; // 特定ノードから開始
  startAll: (nodes?: NodeProps[], edges?: EdgeProps[]) => void; // 全体開始
  stop: (id: string, nodes?: NodeProps[], edges?: EdgeProps[]) => void; // 特定ノード停止
  stopAll: (nodes?: NodeProps[], edges?: EdgeProps[]) => void; // 全体停止
  reset: (id: string, nodes?: NodeProps[], edges?: EdgeProps[]) => void; // 特定ノードリセット
  resetAll: (nodes?: NodeProps[], edges?: EdgeProps[]) => void; // 全体リセット
};

export const ExecutionContext = createContext<ExecutionNodeContextType | null>(
  null
);
