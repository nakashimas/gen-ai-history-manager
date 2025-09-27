import type { EdgeProps, NodeProps } from "../contexts/GraphContext";
import { resolveId } from "./contentsId";

export const topologicalSort = (
  ids: string[],
  edges: {
    from: string;
    to: string;
  }[]
) => {
  // Kahn’s Algorithm
  // 全てのノードの入次数が0になるまで選択したノードのエッジを消していく
  // 入次数と隣接リストを初期化
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  ids.forEach((id) => {
    inDegree[id] = 0;
    adj[id] = [];
  });

  // エッジを反映
  for (const { from, to } of edges) {
    adj[from].push(to);
    inDegree[to]++;
  }

  // 入次数0のノードから開始
  let currentLayer: string[] = ids.filter((id) => inDegree[id] === 0);
  const result: string[][] = [];

  while (currentLayer.length > 0) {
    result.push(currentLayer);

    const nextLayer: string[] = [];

    for (const node of currentLayer) {
      for (const next of adj[node]) {
        inDegree[next]--;
        if (inDegree[next] === 0) {
          nextLayer.push(next);
        }
      }
    }

    currentLayer = nextLayer;
  }

  // サイクルがある場合
  const totalCount = result.flat().length;
  if (totalCount !== ids.length) {
    throw new Error(
      "Graph has a cycle; layered topological sort not possible."
    );
  }

  return result;
};

export const topologicalSortProps = (
  nodes: NodeProps[],
  edges: EdgeProps[]
) => {
  // ノード
  const ids = nodes.map((node: NodeProps) => resolveId(node.id));
  const edgePaths = edges.map((edge: EdgeProps) => ({
    from: resolveId(edge.from),
    to: resolveId(edge.to),
  }));

  const layers = topologicalSort(ids, edgePaths);

  return layers;
};
