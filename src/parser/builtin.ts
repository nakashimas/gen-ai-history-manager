// ---- 評価結果の型 ----
export type Value = string | number | boolean | Value[] | null;

// ---- 環境定義 ----
export type Env = {
  [key: string]: ((...args: Value[]) => Value) | Value;
};

export const baseEnv: Env = {
  // --- 文字列操作系 ---
  upper: (x: Value) => {
    if (typeof x === "string") return x.toUpperCase();
    throw new Error("upper: argument must be string");
  },
  lower: (x: Value) => {
    if (typeof x === "string") return x.toLowerCase();
    throw new Error("lower: argument must be string");
  },
  trim: (x: Value) => {
    if (typeof x === "string") return x.trim();
    throw new Error("trim: argument must be string");
  },
  concat: (x: Value, y: Value) => {
    if (typeof x === "string" && typeof y === "string") return x + y;
    throw new Error("concat: arguments must be strings");
  },
  replace: (x: Value, oldVal: Value, newVal: Value) => {
    if (
      typeof x === "string" &&
      typeof oldVal === "string" &&
      typeof newVal === "string"
    ) {
      return x.split(oldVal).join(newVal);
    }
    throw new Error("replace: arguments must be strings");
  },
  substring: (x: Value, start: Value, end?: Value) => {
    if (typeof x === "string" && typeof start === "number") {
      return x.substring(start, typeof end === "number" ? end : undefined);
    }
    throw new Error("substring: invalid arguments");
  },
  length: (x: Value) => {
    if (typeof x === "string" || Array.isArray(x)) return x.length;
    throw new Error("length: argument must be string or array");
  },
  split: (x: Value, sep: Value) => {
    if (typeof x === "string" && typeof sep === "string") return x.split(sep);
    throw new Error("split: arguments must be strings");
  },
  join: (x: Value, sep: Value) => {
    if (Array.isArray(x) && typeof sep === "string") return x.join(sep);
    throw new Error("join: first arg must be array, second arg must be string");
  },
  contains: (x: Value, substr: Value) => {
    if (typeof x === "string" && typeof substr === "string")
      return x.includes(substr);
    throw new Error("contains: arguments must be strings");
  },
  startsWith: (x: Value, substr: Value) => {
    if (typeof x === "string" && typeof substr === "string")
      return x.startsWith(substr);
    throw new Error("startsWith: arguments must be strings");
  },
  endsWith: (x: Value, substr: Value) => {
    if (typeof x === "string" && typeof substr === "string")
      return x.endsWith(substr);
    throw new Error("endsWith: arguments must be strings");
  },

  // --- 数値・計算系 ---
  add: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x + y;
    throw new Error("add: arguments must be numbers");
  },
  sub: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x - y;
    throw new Error("sub: arguments must be numbers");
  },
  mul: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x * y;
    throw new Error("mul: arguments must be numbers");
  },
  div: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x / y;
    throw new Error("div: arguments must be numbers");
  },
  clamp: (x: Value, min: Value, max: Value) => {
    if (
      typeof x === "number" &&
      typeof min === "number" &&
      typeof max === "number"
    ) {
      return Math.min(Math.max(x, min), max);
    }
    throw new Error("clamp: arguments must be numbers");
  },
  round: (x: Value) => {
    if (typeof x === "number") return Math.round(x);
    throw new Error("round: argument must be number");
  },
  floor: (x: Value) => {
    if (typeof x === "number") return Math.floor(x);
    throw new Error("floor: argument must be number");
  },
  ceil: (x: Value) => {
    if (typeof x === "number") return Math.ceil(x);
    throw new Error("ceil: argument must be number");
  },
  random: (min: Value, max: Value) => {
    if (typeof min === "number" && typeof max === "number") {
      return Math.random() * (max - min) + min;
    }
    throw new Error("random: arguments must be numbers");
  },

  // --- 条件・ブール系 ---
  if: (cond: Value, thenVal: Value, elseVal?: Value) => {
    if (typeof cond !== "boolean")
      throw new Error("if: condition must be boolean");
    return cond ? thenVal : elseVal ?? null;
  },
  not: (x: Value) => {
    if (typeof x === "boolean") return !x;
    throw new Error("not: argument must be boolean");
  },
  and: (x: Value, y: Value) => {
    if (typeof x === "boolean" && typeof y === "boolean") return x && y;
    throw new Error("and: arguments must be boolean");
  },
  or: (x: Value, y: Value) => {
    if (typeof x === "boolean" && typeof y === "boolean") return x || y;
    throw new Error("or: arguments must be boolean");
  },
  eq: (x: Value, y: Value) => {
    return x === y;
  },
  gt: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x > y;
    throw new Error("gt: arguments must be numbers");
  },
  lt: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x < y;
    throw new Error("lt: arguments must be numbers");
  },
  gte: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x >= y;
    throw new Error("gte: arguments must be numbers");
  },
  lte: (x: Value, y: Value) => {
    if (typeof x === "number" && typeof y === "number") return x <= y;
    throw new Error("lte: arguments must be numbers");
  },

  // --- ループ ---
  repeat: (x: Value, n: Value): Value => {
    if (typeof x === "string" && typeof n === "number") {
      return x.repeat(n);
    }
    throw new Error("repeat: invalid arguments: x:" + x + " n:" + n);
  },

  // --- 正規表現 ---
  match: (x: Value, pattern: Value) => {
    if (typeof x !== "string")
      throw new Error("match: first argument must be string");
    if (!(pattern instanceof RegExp) && typeof pattern !== "string")
      throw new Error("match: pattern must be string or RegExp");

    const re = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    const result = x.match(re);
    return result ? result : [];
  },
  test: (x: Value, pattern: Value) => {
    if (typeof x !== "string")
      throw new Error("test: first argument must be string");
    if (!(pattern instanceof RegExp) && typeof pattern !== "string")
      throw new Error("test: pattern must be string or RegExp");

    const re = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    return re.test(x);
  },
  replaceRegex: (x: Value, pattern: Value, replacement: Value) => {
    if (typeof x !== "string")
      throw new Error("replaceRegex: first argument must be string");
    if (!(pattern instanceof RegExp) && typeof pattern !== "string")
      throw new Error("replaceRegex: pattern must be string or RegExp");
    if (typeof replacement !== "string")
      throw new Error("replaceRegex: replacement must be string");

    const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, "g");
    return x.replace(re, replacement);
  },

  // --- システム参照 ---
  getLocalStorage: (x: Value): Value => {
    if (typeof x === "string") {
      const item = localStorage.getItem(x as string);
      if (item === null) return null;
      return item;
    }
    return null;
  },
};
