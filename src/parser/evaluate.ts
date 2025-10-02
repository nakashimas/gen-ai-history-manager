import { parse } from "./template";

// ---- AST 型定義 ----
export type ASTNode =
  | StringLiteral
  | NumberLiteral
  | BooleanLiteral
  | ArrayLiteral
  | Call
  | FunctionDef;

export interface StringLiteral {
  type: "StringLiteral";
  value: string;
}

export interface NumberLiteral {
  type: "NumberLiteral";
  value: number;
}

export interface BooleanLiteral {
  type: "BooleanLiteral";
  value: boolean;
}

export interface ArrayLiteral {
  type: "ArrayLiteral";
  elements: ASTNode[];
}

export interface Call {
  type: "Call";
  callee: string | ASTNode;
  args: ASTNode[];
}

export interface FunctionDef {
  type: "FunctionDef";
  name: string;
  body: ASTNode[];
}

// ---- 評価結果の型 ----
export type Value = string | number | boolean | Value[] | null;

// ---- 環境定義 ----
export type Env = {
  [key: string]: ((...args: Value[]) => Value) | Value;
};

// ---- 評価関数 (AST input) ----
export function evaluate(
  node: ASTNode | ASTNode[],
  env: Env = {},
  prevValue: Value = null
): Value {
  if (Array.isArray(node)) {
    // Pipeline: 順に評価
    let result: Value = prevValue;
    for (const n of node) {
      result = evaluate(n, env, result);
    }
    return result;
  }

  switch (node?.type) {
    case "StringLiteral":
      return node.value;

    case "NumberLiteral":
      return node.value;

    case "BooleanLiteral":
      return node.value;

    case "ArrayLiteral":
      return node.elements.map((el) => evaluate(el, env));

    case "FunctionDef":
      env[node.name] = (...args: Value[]): Value => {
        // 前の Pipeline の出力を第一引数として扱う
        const firstArg = args.length > 0 ? args[0] : prevValue;
        const bodyEnv: Env = { ...env };
        // body は Pipeline 配列として評価
        return evaluate(node.body, bodyEnv, firstArg);
      };
      return null;

    case "Call": {
      const fn =
        typeof node.callee === "string"
          ? env[node.callee]
          : evaluate(node.callee, env);

      if (typeof fn !== "function") {
        throw new Error(`Undefined function: ${JSON.stringify(node.callee)}`);
      }

      // prevValue を先頭引数に追加して可変長で呼ぶ
      const args = [
        prevValue,
        ...node.args.map((a) => evaluate(a, env)),
      ].filter((v) => v !== null);

      return fn(...args); // ...args で展開
    }

    default:
      return null;
  }
}

// ---- 評価関数 (TEXT input) ----
export function evaluateTemplate(input: string) {
  const env: Env = {
    upper: (x: Value): Value => {
      if (typeof x === "string") return x.toUpperCase();
      throw new Error("upper: argument must be string");
    },
    repeat: (x: Value, n: Value): Value => {
      if (typeof x === "string" && typeof n === "number") {
        return x.repeat(n);
      }
      throw new Error("repeat: invalid arguments: " + x + " " + n);
    },
  };

  const ast = parse(input, { startRule: "Program" });

  if (ast) {
    return (ast as ASTNode[])
      .map((stmt) => evaluate(stmt, env))
      .filter((e) => e)
      .pop();
  }

  return null;
}
