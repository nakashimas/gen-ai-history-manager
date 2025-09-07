import { useState } from "react";
import { useAuthStore } from "../store/authToken";

export default function AuthTokenForm() {
  const [input, setInput] = useState("");
  const saveToken = useAuthStore((state) => state.saveToken);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      saveToken(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Google AI Studio のトークンを入力"
        className="border px-2 py-1 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 rounded">
        保存
      </button>
    </form>
  );
}
