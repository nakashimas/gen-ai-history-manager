import React from "react";

const NodeMenuHelp: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl py-5">
      <h2 className="text-lg font-bold">Help</h2>
      <hr className="mb-4" />

      {/* Overview */}
      <h3 className="text-lg font-bold">Overview</h3>
      <hr className="mb-4" />
      <p className="mb-4 text-sm">
        ここにサイトのヘルプを書きます。より最新の情報は
        <a href="https://github.com/nakashimas/gen-ai-history-manager/blob/main/README.md">
          README
        </a>
        を参照ください。
      </p>

      {/* Usage */}
      <h3 className="text-lg font-bold">Usage</h3>
      <hr className="mb-4" />
      <p className="mb-4 text-sm">TBD</p>

      {/* Pipeline Template Syntax */}
      <>
        {/* パイプライン言語仕様 */}
        <h3 className="text-lg font-bold">パイプライン言語概要</h3>
        <hr className="mb-4" />
        <p className="mb-4 text-sm">
          テンプレート内で
          <strong>パイプライン構造を持つ簡易スクリプト言語</strong>
          が使用できます。主な特徴は以下の通りです。
        </p>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>{"{{ }}"}によりテンプレートが呼び出されます。</li>
          <li>プログラムは複数のステートメントで構成されます。</li>
          <li>ステートメントはパイプライン式です。</li>
          <li>
            パイプライン式は <code>|</code> で複数の式をつなげます。
          </li>
          <li>式には関数定義、関数呼び出し、リテラル、配列を使用できます。</li>
        </ul>

        <h4 className="text-md font-bold">プログラム</h4>
        <p className="mb-4 text-sm">
          プログラムは
          1つ以上のステートメントで構成されます。ステートメント同士は改行や空白で区切ることができます。
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>
            {`func:foo("hello") | bar()
42 | true`}
          </code>
        </pre>

        <h4 className="text-md font-bold">ステートメント</h4>
        <p className="mb-4 text-sm">
          ステートメントは単一のパイプライン式で構成されます。通常は 1行に
          1つのステートメントを記述します。
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{'"hello" | func:foo()'}</code>
        </pre>

        <h4 className="text-md font-bold">パイプライン式</h4>
        <p className="mb-4 text-sm">
          式同士を <code>|</code>{" "}
          で接続して、順次処理の流れを定義します。データは左から右へ流れます。
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{'"hello" | func:foo() | bar()'}</code>
        </pre>

        <h4 className="text-md font-bold">式の種類</h4>
        <p className="mb-4 text-sm">式には以下の種類があります。</p>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>関数定義</li>
          <li>関数呼び出し</li>
          <li>文字列リテラル</li>
          <li>数値リテラル</li>
          <li>真偽値リテラル</li>
          <li>配列リテラル</li>
        </ul>

        <h4 className="text-md font-bold">関数定義</h4>
        <p className="mb-4 text-sm">
          構文: <code>func:関数名(パイプライン式)</code>
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{'func:foo("hello" | bar())'}</code>
        </pre>

        <h4 className="text-md font-bold">関数呼び出し</h4>
        <p className="mb-4 text-sm">
          構文: <code>関数名(引数1, 引数2, ...)</code>
          。引数は式で、必要に応じて指定できます。
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{'foo("a", 42, true)\nbar()'}</code>
        </pre>

        <h4 className="text-md font-bold">リテラル</h4>
        <p className="mb-4 text-sm">
          - <strong>文字列:</strong> ダブルクオートで囲む、例:{" "}
          <code>"hello"</code>
          <br />- <strong>数値:</strong> 整数のみ、例: <code>42</code>
          <br />- <strong>真偽値:</strong> <code>true</code> または{" "}
          <code>false</code>
          <br />- <strong>配列:</strong> 式をカンマで区切り <code>[ ]</code>{" "}
          で囲む、例: <code>[1, "a", true]</code>
        </p>

        <h4 className="text-md font-bold">識別子</h4>
        <p className="mb-4 text-sm">
          英字または <code>_</code> で始まり、その後に英数字または{" "}
          <code>_</code> が続く文字列。変数名や関数名に使用します。
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{"foo\n_bar\nmyVar123"}</code>
        </pre>

        <h4 className="text-md font-bold">空白</h4>
        <p className="mb-4 text-sm">
          スペース、タブ、改行は自由に使用できます。読みやすさのために活用してください。
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{'func:foo( "hello" | bar() )'}</code>
        </pre>

        {/* Built-in Functions */}
        <h4 className="text-md font-bold">ビルトイン関数</h4>
        <p className="mb-4 text-sm">
          パイプライン内で利用できる標準関数です。引数や戻り値の型は{" "}
          <code>Value</code> で、文字列、数値、真偽値、配列、null
          が使用できます。
        </p>
        <p className="mb-4 text-sm">
          関数は最初の式がある場合、第一引数にそれを受け取ります
        </p>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{"0 | gte(1)"}</code>
        </pre>
        <pre className="mb-4 bg-gray-100 p-2 rounded text-sm">
          <code>{"gte(0, 1)"}</code>
        </pre>

        {/* 文字列操作 */}
        <h5 className="text-sm font-bold">文字列操作</h5>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>
            <code>upper(x)</code> - 文字列を大文字に変換
          </li>
          <li>
            <code>lower(x)</code> - 文字列を小文字に変換
          </li>
          <li>
            <code>trim(x)</code> - 前後の空白を削除
          </li>
          <li>
            <code>concat(x, y)</code> - 文字列を連結
          </li>
          <li>
            <code>replace(x, oldVal, newVal)</code> - 文字列内の指定部分を置換
          </li>
          <li>
            <code>substring(x, start, end?)</code> - 文字列の部分取得
          </li>
          <li>
            <code>length(x)</code> - 文字列または配列の長さ
          </li>
          <li>
            <code>split(x, sep)</code> - 文字列を区切り文字で分割
          </li>
          <li>
            <code>join(x, sep)</code> - 配列の要素を文字列として結合
          </li>
          <li>
            <code>contains(x, substr)</code> - 部分文字列を含むか判定
          </li>
          <li>
            <code>startsWith(x, substr)</code> - 指定文字列で始まるか判定
          </li>
          <li>
            <code>endsWith(x, substr)</code> - 指定文字列で終わるか判定
          </li>
        </ul>

        {/* 数値・計算系 */}
        <h5 className="text-sm font-bold">数値・計算</h5>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>
            <code>add(x, y)</code> - 足し算
          </li>
          <li>
            <code>sub(x, y)</code> - 引き算
          </li>
          <li>
            <code>mul(x, y)</code> - 掛け算
          </li>
          <li>
            <code>div(x, y)</code> - 割り算
          </li>
          <li>
            <code>clamp(x, min, max)</code> - 指定範囲内に収める
          </li>
          <li>
            <code>round(x)</code> - 四捨五入
          </li>
          <li>
            <code>floor(x)</code> - 小数切り捨て
          </li>
          <li>
            <code>ceil(x)</code> - 小数切り上げ
          </li>
          <li>
            <code>random(min, max)</code> - 指定範囲のランダム値
          </li>
        </ul>

        {/* 条件・ブール系 */}
        <h5 className="text-sm font-bold">条件・ブール</h5>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>
            <code>if(cond, thenVal, elseVal?)</code> - 条件式
          </li>
          <li>
            <code>not(x)</code> - 論理否定
          </li>
          <li>
            <code>and(x, y)</code> - 論理積
          </li>
          <li>
            <code>or(x, y)</code> - 論理和
          </li>
          <li>
            <code>eq(x, y)</code> - 等価判定
          </li>
          <li>
            <code>gt(x, y)</code> - x &gt; y
          </li>
          <li>
            <code>lt(x, y)</code> - x &lt; y
          </li>
          <li>
            <code>gte(x, y)</code> - x &ge; y
          </li>
          <li>
            <code>lte(x, y)</code> - x &le; y
          </li>
        </ul>

        {/* ループ */}
        <h5 className="text-sm font-bold">ループ</h5>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>
            <code>repeat(x, n)</code> - 文字列 x を n 回繰り返す
          </li>
        </ul>

        {/* 正規表現 */}
        <h5 className="text-sm font-bold">正規表現</h5>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>
            <code>match(x, pattern)</code> -
            正規表現にマッチした部分を配列で取得
          </li>
          <li>
            <code>test(x, pattern)</code> - 正規表現にマッチするか判定
          </li>
          <li>
            <code>replaceRegex(x, pattern, replacement)</code> - 正規表現で置換
          </li>
        </ul>

        {/* システム参照 */}
        <h5 className="text-sm font-bold">システム参照</h5>
        <ul className="mb-4 list-disc list-inside text-sm">
          <li>
            <code>getLocalStorage(key)</code> - localStorage から値を取得
          </li>
          <li>
            <code>getResult(idx, key)</code> - 親ノードの結果から値を取得
          </li>
        </ul>
      </>

      {/* FAQ */}
      <h3 className="text-lg font-bold">FAQ</h3>
      <hr className="mb-4" />
      <p className="mb-4 text-sm">TBD</p>

      {/* Support */}
      <h3 className="text-lg font-bold">Support</h3>
      <hr className="mb-4" />
      <p className="mb-4 text-sm">TBD</p>
    </div>
  );
};

export default NodeMenuHelp;
