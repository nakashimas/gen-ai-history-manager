import {
  APIMethod,
  type APINodeOptions,
} from "../contexts/GraphContextOptions";
import { evaluateExecution } from "../parser/evaluate";

// 文字列にテンプレート評価を適用
function applyTemplate(
  value: string | undefined,
  parentResults: Map<string, APINodeOptions | null | undefined>
): string | undefined {
  if (!value) return value;
  return String(evaluateExecution(value, parentResults));
}

// オブジェクトの全ての文字列に適用
function applyTemplateToObject(
  obj: Record<string, string> | undefined,
  parentResults: Map<string, APINodeOptions | null | undefined>
): Record<string, string> | undefined {
  if (!obj) return obj;
  const result: Record<string, string> = {};
  for (const key in obj) {
    result[key] = applyTemplate(obj[key], parentResults) ?? "";
  }
  return result;
}

export async function sendAPINodeRequest(
  options: APINodeOptions,
  useTemplate: boolean = true,
  parentResults: Map<string, APINodeOptions | null | undefined> = new Map()
): Promise<unknown> {
  if (!options.endpoint) throw new Error("endpoint is required");

  // useTemplate が true の場合、すべての文字列に evaluateExecution を適用
  const endpoint = useTemplate
    ? applyTemplate(options.endpoint, parentResults)
    : options.endpoint;

  const query = useTemplate
    ? applyTemplateToObject(options.query, parentResults)
    : options.query;

  const body =
    useTemplate && options.body
      ? applyTemplate(options.body, parentResults)
      : options.body;

  // メソッド番号を文字列に変換
  const methodMap = {
    [APIMethod.GET]: "GET",
    [APIMethod.POST]: "POST",
    [APIMethod.PUT]: "PUT",
    [APIMethod.DELETE]: "DELETE",
    [APIMethod.PATCH]: "PATCH",
  };
  const method = methodMap[options.method ?? APIMethod.GET];

  // クエリ文字列を作成
  let url = endpoint ?? "";
  if (query) {
    const params = new URLSearchParams(query);
    url += "?" + params.toString();
  }

  // fetch の設定
  const fetchOptions: RequestInit = {
    method,
    headers: options.headers,
    body,
  };

  // タイムアウト対応
  let controller: AbortController | undefined;
  if (options.timeout) {
    controller = new AbortController();
    fetchOptions.signal = controller.signal;
    setTimeout(() => controller?.abort(), options.timeout);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    switch (options.responseType) {
      case "json":
        options.data = await response.json();
        break;
      case "text":
        options.data = await response.text();
        break;
      case "blob":
        options.data = undefined;
        break;
      default:
        options.data = await response.text();
        break;
    }

    options.result = options.data;
    return options.data;
  } catch (err) {
    options.result = err;
    throw err;
  }
}
