export const NODE_ID_PREFIX = "-node";
export const EDGE_ID_PREFIX = "-edge";

export const isEqualContentsId = (a?: string, b?: string) => {
  return (
    a?.replaceAll(NODE_ID_PREFIX, "").replaceAll(EDGE_ID_PREFIX, "") ===
    b?.replaceAll(NODE_ID_PREFIX, "").replaceAll(EDGE_ID_PREFIX, "")
  );
};
