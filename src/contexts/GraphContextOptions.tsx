type OverrideOptions<A, B> = Omit<A, keyof B> & B;

export type BaseNodeOptions = {
  label?: string; // 表示名
  description?: string; // 詳細説明
  result?: unknown;
};

export type PlaintextNodeOptions = OverrideOptions<
  BaseNodeOptions,
  {
    filename?: string;
    data?: string; // base64等
    url?: string; // 参照
    mimeType?: string;
  }
>;

export type PictureNodeOptions = OverrideOptions<
  PlaintextNodeOptions,
  {
    caption?: string;
  }
>;

export type VideoNodeOptions = OverrideOptions<
  PlaintextNodeOptions,
  {
    caption?: string;
    duration?: number;
  }
>;

export type PreprocessingNodeOptions = OverrideOptions<
  BaseNodeOptions,
  {
    data?: string;
  }
>;

// API 定義
export const APIType = {
  REST: 0,
  RPC: 1,
} as const;

type APIType = (typeof APIType)[keyof typeof APIType];

export const APIMethod = {
  GET: 0,
  POST: 1,
  PUT: 2,
  DELETE: 3,
  PATCH: 4,
} as const;

type APIMethod = (typeof APIMethod)[keyof typeof APIMethod];

export type APINodeOptions = OverrideOptions<
  BaseNodeOptions,
  {
    apiType?: APIType;
    endpoint?: string; // APIのURL
    method?: APIMethod; // RESTのみ
    headers?: Record<string, string>; // 任意のHTTPヘッダー
    query?: Record<string, string | number | boolean>; // クエリパラメータ
    data?: string;
    timeout?: number; // タイムアウト設定
    responseType?: string; // 期待するレスポンスの形式
  }
>;

// TBD
export type AINodeOptions = OverrideOptions<
  APINodeOptions,
  {
    valid?: boolean;
  }
>;

export type NodeOptions =
  | BaseNodeOptions
  | PlaintextNodeOptions
  | PictureNodeOptions
  | VideoNodeOptions
  | PreprocessingNodeOptions
  | APINodeOptions
  | AINodeOptions;

// NodeType 定義
export const NodeType = {
  Plaintext: 0,
  Picture: 1,
  Video: 2,
  Preprocessing: 3,
  API: 4,
  AI: 5,
} as const;
