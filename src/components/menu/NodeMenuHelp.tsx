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
