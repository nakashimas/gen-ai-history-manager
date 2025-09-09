export const NODE_ID_PREFIX = "-node";
export const EDGE_ID_PREFIX = "-edge";

export const isEqualContentsId = (a?: string, b?: string) => {
  if (!a) a = "";
  if (!b) b = "";

  return resolveId(a) === resolveId(b);
};

export const resolveId = (id: string) => {
  return id.replaceAll(NODE_ID_PREFIX, "").replaceAll(EDGE_ID_PREFIX, "");
};
