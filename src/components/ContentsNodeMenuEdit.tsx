import React from "react";
import { useGraph } from "../hooks/useGraph";
import { isEqualContentsId } from "../utils/contentsId";

const ContentsNodeMenuEdit: React.FC<{ recentDragSourceId: string }> = ({
  recentDragSourceId,
}) => {
  const { nodes, nodeOptions } = useGraph();
  const node = nodes.find((n) => isEqualContentsId(n.id, recentDragSourceId));
  const nodeOption = nodeOptions.find((n) =>
    isEqualContentsId(n.id, recentDragSourceId)
  );

  return (
    <>
      <span>{JSON.stringify(node)}</span>
      <span>{JSON.stringify(nodeOption)}</span>
    </>
  );
};

export default ContentsNodeMenuEdit;
