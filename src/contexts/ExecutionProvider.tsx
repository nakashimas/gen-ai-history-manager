import { useState } from "react";
import {
  ExecutionContext,
  type ExecutionNode,
  type ExecutionNodeState,
} from "./ExecutionContext";
import type { EdgeProps, NodeProps } from "./GraphContext";
import { resolveId } from "../utils/contentsId";

/**
 * 実行順序を整理し、親子関係を参照しやすい形式に変更する
 * @param ids
 * @param edges
 * @returns
 */
const buildExecutionGraph = (
  ids: string[],
  edges: { from: string; to: string }[]
) => {
  const graph = new Map<string, ExecutionNode>();

  ids.forEach((id) => {
    graph.set(id, {
      id,
      state: "pending",
      dependents: [],
      remainingDependencies: 0,
    });
  });

  edges.forEach(({ from, to }) => {
    graph.get(from)!.dependents.push(to);
    graph.get(to)!.remainingDependencies++;
  });

  return graph;
};

/**
 * 実行順序を整理し、親子関係を参照しやすい形式に変更する
 * @param nodes
 * @param edges
 * @returns
 */
const buildExecutionGraphProps = (nodes: NodeProps[], edges: EdgeProps[]) => {
  const ids = nodes.map((node: NodeProps) => resolveId(node.id));
  const edgePaths = edges.map((edge: EdgeProps) => ({
    from: resolveId(edge.from),
    to: resolveId(edge.to),
  }));

  return buildExecutionGraph(ids, edgePaths);
};

export const ExecutionProvider: React.FC<{
  children: React.ReactNode;
  onUpdate?: (
    id: string | null,
    state: ExecutionNodeState,
    graph: Map<string, ExecutionNode>
  ) => void;
}> = ({ children, onUpdate }) => {
  const [operations, setOperations] = useState<Map<string, AbortController>>(
    new Map()
  );
  const [graph, setGraph] = useState<Map<string, ExecutionNode>>(new Map());
  const [aborted, setAborted] = useState(false);

  const runner = async (id: string, signal: AbortSignal) => {
    console.log("Start", id);
    await new Promise<void>((resolve, reject) => {
      // ここが実際の処理
      const timer = setTimeout(resolve, 2000);

      // Abort
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new Error("Cancelled"));
      });
    });
    console.log("Done", id);
  };

  function updateNode(id: string, state: ExecutionNodeState) {
    const node = graph.get(id)!;
    node.state = state;
    onUpdate?.(id, state, new Map(graph));
  }

  const resetCancelledNodes = () => {
    graph.forEach((node) => {
      if (node.state === "cancelled") {
        node.state = "pending";
        node.remainingDependencies = node.dependents.length; // 依存数を再計算
      }
    });
    onUpdate?.(null, "pending", new Map(graph));
  };

  function completeNode(id: string) {
    const node = graph.get(id)!;
    node.state = "done";
    node.dependents.forEach((depId) => {
      const depNode = graph.get(depId)!;
      depNode.remainingDependencies--;
      if (depNode.remainingDependencies === 0 && depNode.state === "pending") {
        depNode.state = "ready";
      }
    });
    onUpdate?.(id, "done", new Map(graph));
  }

  function getReadyNodes(graph: Map<string, ExecutionNode>): string[] {
    return Array.from(graph.values())
      .filter(
        (n) =>
          (n.state === "pending" || n.state === "ready") &&
          n.remainingDependencies === 0
      )
      .map((n) => n.id);
  }

  function createLoop() {
    async function runNode(id: string) {
      const controller = new AbortController();
      setOperations((prev) => {
        const next = new Map(prev);
        next.set(id, controller);
        return next;
      });

      updateNode(id, "running");

      try {
        await runner(id, controller.signal);
        if (!controller.signal.aborted) {
          completeNode(id);
          updateNode(id, "done");
        } else {
          updateNode(id, "cancelled");
        }
      } catch {
        updateNode(id, "cancelled");
      } finally {
        setOperations((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      }
    }

    async function loop() {
      while (!aborted) {
        const ready = getReadyNodes(graph);
        if (ready.length === 0) break;
        await Promise.all(ready.map((id) => runNode(id)));
      }
    }

    return loop;
  }

  const setGraphProps = (nodes: NodeProps[], edges: EdgeProps[]) => {
    setGraph(buildExecutionGraphProps(nodes, edges));
  };

  const start = (id: string) => {
    const node = graph.get(id);
    if (!node) return;

    // 強制的に「ready」にする
    if (node.state === "pending" && node.remainingDependencies === 0) {
      node.state = "ready";
    }

    const loop = createLoop();
    loop();
  };

  const startAll = () => {
    setAborted(false);
    resetCancelledNodes();
    const loop = createLoop();
    loop();
  };

  const stop = (id: string) => {
    operations.get(id)?.abort();
    console.warn(`Operation Canceled: ${id}`);
  };

  const stopAll = () => {
    setAborted(true);
    operations.forEach((c) => c.abort());
    console.warn("Operation Canceled: ALL");
  };

  const reset = (id: string) => {
    stop(id);
    setAborted(false);
    console.warn(`Operation Reset Output: ${id}`);
  };

  const resetAll = () => {
    stopAll();
    setAborted(false);
    resetCancelledNodes();
    console.warn("Operation Reset Output: ALL");
  };

  return (
    <ExecutionContext.Provider
      value={{
        operations,
        graph,
        setGraph,
        setGraphProps,
        start,
        startAll,
        stop,
        stopAll,
        reset,
        resetAll,
      }}
    >
      {children}
    </ExecutionContext.Provider>
  );
};
