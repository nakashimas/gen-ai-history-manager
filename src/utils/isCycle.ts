import type { EdgeProps } from "../contexts/GraphContext";

export const isCycle = (edges: EdgeProps[], newEdge: EdgeProps) => {
  const adj: Record<string, string[]> = {};

  for (const e of edges) {
    if (!adj[e.from]) adj[e.from] = [];
    adj[e.from].push(e.to);
  }

  if (!adj[newEdge.from]) adj[newEdge.from] = [];
  adj[newEdge.from].push(newEdge.to);

  // DFSで newEdge.to から newEdge.from へ到達できるか確認
  const visited = new Set<string>();
  const stack = [newEdge.to];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node === newEdge.from) {
      return true; // サイクル発見
    }
    if (!visited.has(node)) {
      visited.add(node);
      if (adj[node]) {
        stack.push(...adj[node]);
      }
    }
  }
  return false;
};
