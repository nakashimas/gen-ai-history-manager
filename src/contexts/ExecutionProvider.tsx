import { useState } from "react";
import {
  ExecutionContext,
  type ExecutionNode,
  type ExecutionNodeState,
} from "./ExecutionContext";
import type { EdgeProps, NodeProps, NodeType } from "./GraphContext";
import { resolveId } from "../utils/contentsId";
import { useGraph } from "../hooks/useGraph";
import {
  NodeType as NodeTypeEnum,
  type NodeOptions,
  type PictureNodeOptions,
  type PlaintextNodeOptions,
  type VideoNodeOptions,
} from "./GraphContextOptions";

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
      parents: [], // ★追加
    });
  });

  edges.forEach(({ from, to }) => {
    graph.get(from)!.dependents.push(to);
    graph.get(to)!.remainingDependencies++;
    graph.get(to)!.parents.push(from); // ★親を登録
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
  const [results, setResults] = useState<
    Map<string, { type: NodeType; options: NodeOptions }>
  >(new Map());
  const [aborted, setAborted] = useState(false);

  const { nodes, nodeOptions } = useGraph();

  const runner = async (id: string, signal: AbortSignal) => {
    await new Promise<void>((resolve, reject) => {
      // Abort
      signal.addEventListener("abort", () => {
        reject(new Error("Process Cancelled: Aborted"));
      });

      const targetNode = nodes.find((n) => n.id == id);
      const targetOptions = nodeOptions.find((n) => n.id == id);
      const parents = graph.get(id)?.parents ?? [];
      const parentResults = new Map<string, NodeOptions | null | undefined>(
        parents.map((pid) => [
          pid,
          Array.from(results.entries()).find((item) => item[0] === pid)?.[1]
            ?.options,
        ])
      );

      // 実際の処理
      switch (String(targetNode?.type)) {
        case String(NodeTypeEnum.Plaintext):
          if (targetOptions) {
            setResults({
              ...results,
              [id]: {
                type: NodeTypeEnum.Plaintext,
                options: {
                  ...(targetOptions?.options as PlaintextNodeOptions),
                },
              },
            });
          }
          break;
        case String(NodeTypeEnum.Picture):
          if (targetOptions) {
            setResults({
              ...results,
              [id]: {
                type: NodeTypeEnum.Plaintext,
                options: {
                  ...(targetOptions?.options as PictureNodeOptions),
                },
              },
            });
          }
          break;
        case String(NodeTypeEnum.Video):
          if (targetOptions) {
            setResults({
              ...results,
              [id]: {
                type: NodeTypeEnum.Plaintext,
                options: {
                  ...(targetOptions?.options as VideoNodeOptions),
                },
              },
            });
          }
          break;
        case String(NodeTypeEnum.Preprocessing):
          console.log("Preprocessing", parentResults);
          break;
        case String(NodeTypeEnum.API):
          console.log("API", parentResults);
          break;
        case String(NodeTypeEnum.AI):
          console.log("AI", parentResults);
          break;
        default:
          console.log(`Process Cancelled: Unknown ${targetNode?.type}`);
      }
      resolve();
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
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

  /** nodes/edges が渡されたら setGraphProps してから fn を実行する共通処理 */
  function withGraphUpdate<Args extends unknown[]>(
    fn: (...args: Args) => void
  ): {
    (...args: Args): void; // 普通に呼ぶケース
    (...args: [...Args, ...[nodes: NodeProps[], edges: EdgeProps[]]]): void; // nodes/edgesを最後に渡すケース
  } {
    return (...args: unknown[]) => {
      const maybeNodes = args[args.length - 2];
      const maybeEdges = args[args.length - 1];

      if (
        Array.isArray(maybeNodes) &&
        Array.isArray(maybeEdges) &&
        maybeNodes.every((n) => "id" in n) &&
        maybeEdges.every((e) => "id" in e)
      ) {
        // nodes/edges が渡されている場合
        setGraphProps(maybeNodes as NodeProps[], maybeEdges as EdgeProps[]);
        args = args.slice(0, -2); // nodes/edges を取り除いて残りを fn に渡す
      }

      fn(...(args as Args));
    };
  }

  const start = withGraphUpdate((id: string) => {
    const node = graph.get(id);
    if (!node) return;

    // 強制的に「ready」にする
    if (node.state === "pending" && node.remainingDependencies === 0) {
      node.state = "ready";
    }

    const loop = createLoop();
    loop();
  });

  const startAll = withGraphUpdate(() => {
    setAborted(false);
    resetCancelledNodes();
    const loop = createLoop();
    loop();
  });

  const stop = withGraphUpdate((id: string) => {
    operations.get(id)?.abort();
    console.warn(`Operation Canceled: ${id}`);
  });

  const stopAll = withGraphUpdate(() => {
    setAborted(true);
    operations.forEach((c) => c.abort());
    console.warn("Operation Canceled: ALL");
  });

  const reset = withGraphUpdate((id: string) => {
    stop(id);
    resetCancelledNodes();
    setResults(
      new Map(Array.from(results.entries()).filter((item) => !(item[0] == id)))
    );
    setAborted(false);
    console.warn(`Operation Reset Output: ${id}`);
  });

  const resetAll = withGraphUpdate(() => {
    stopAll();
    resetCancelledNodes();
    setResults(new Map());
    setAborted(false);
    console.warn("Operation Reset Output: ALL");
  });

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
