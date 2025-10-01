import React from "react";
import { useGraph } from "../../hooks/useGraph";
import { useExecution } from "../../hooks/useExecution";

const NodeMenuDebug: React.FC = () => {
  const { nodes, edges, nodeOptions } = useGraph();
  const { graph } = useExecution();
  return (
    <>
      <h2 className="text-lg">Nodes</h2>
      <hr></hr>
      <pre className="text-sm">{JSON.stringify(nodes, null, 2)}</pre>
      <hr></hr>
      <h2 className="text-lg">Edges</h2>
      <hr></hr>
      <pre className="text-sm">{JSON.stringify(edges, null, 2)}</pre>
      <hr></hr>
      <h2 className="text-lg">Node Options</h2>
      <hr></hr>
      <pre className="text-sm">{JSON.stringify(nodeOptions, null, 2)}</pre>
      <h2 className="text-lg">Execution Graph</h2>
      <hr></hr>
      <pre className="text-sm">{JSON.stringify(graph, null, 2)}</pre>
    </>
  );
};

export default NodeMenuDebug;
