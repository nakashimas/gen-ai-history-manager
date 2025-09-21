import React from "react";
import { useGraph } from "../../hooks/useGraph";

const NodeMenuDebug: React.FC = () => {
  const { nodes, edges, nodeOptions } = useGraph();

  return (
    <>
      <span>{JSON.stringify(nodes)}</span>
      <hr></hr>
      <span>{JSON.stringify(edges)}</span>
      <hr></hr>
      <span>{JSON.stringify(nodeOptions)}</span>
    </>
  );
};

export default NodeMenuDebug;
