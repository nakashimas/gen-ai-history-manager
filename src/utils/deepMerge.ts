export const deepMerge = <T>(target: T, source: Partial<T>): T => {
  const output = { ...target };
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      output[key] = deepMerge((target as any)[key] || {}, source[key] as any);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      output[key] = source[key] as any;
    }
  }
  return output;
};
