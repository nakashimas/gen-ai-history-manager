<div align="center">
  <a href="https://nakashimas.github.io/gen-ai-history-manager">
    <img height="75" src="./public/favicon.png" alt="favicon">
  </a>
  <h1>GenAI History Manager</h1>
</div>

チームメイトと生成 AI アプリケーションの処理系について議論するために、可視化ツールを公開しました。

A visualization tool for discussing the workflow of Generative AI applications with teammates.

## Demo

[View Demo](https://nakashimas.github.io/gen-ai-history-manager)

## Details

A frontend app built with **Vite + React + TypeScript**.  
It allows users to design Generative AI workflows as a **directed network graph**,  
making it easier to **communicate complex ideas** or **organize thoughts visually**.  
Execution support is planned (TBD).

## Stacks

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Setup

リポジトリをクローンして依存関係をインストールします。  
Clone the repository and install dependencies.

```bash
git clone https://github.com/nakashimas/gen-ai-history-manager.git
cd gen-ai-history-manager
npm install
```

## Development

| コマンド          | 説明                                                              |
| ----------------- | ----------------------------------------------------------------- |
| `npm run dev`     | Start dev server ([http://localhost:5173](http://localhost:5173)) |
| `npm run build`   | Build for production / 本番ビルド                                 |
| `npm run preview` | Preview local production build / ビルド内容をローカルで確認       |
| `npm run lint`    | Lint code with ESLint                                             |
