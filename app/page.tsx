"use client";

import { useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Models available through Mizumi. Full list: https://mizumi.co
const MODELS = [
  { id: "gpt-5.6-sol", label: "gpt-5.6-sol (OpenAI, flagship)" },
  { id: "gpt-5.6-luna", label: "gpt-5.6-luna (OpenAI, budget)" },
  { id: "gemini-3.6-flash", label: "gemini-3.6-flash (Google, fast)" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [
      ...messagesRef.current,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send full history so the model has conversation context.
        body: JSON.stringify({
          model,
          messages: nextMessages.slice(0, -1),
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "unknown error");
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      // Read the plain-text stream and append chunks to the last message.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + chunk,
          };
          return updated;
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `⚠️ ${message}`,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Mizumi Chat</h1>
        <select
          className="model-select"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </header>

      <div className="messages">
        {messages.length === 0 && (
          <p className="hint">
            Ask anything. Powered by{" "}
            <a href="https://mizumi.co">Mizumi</a> — OpenAI &amp; Gemini models
            via one OpenAI-compatible API.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.content || (loading && m.role === "assistant" ? "…" : "")}
          </div>
        ))}
      </div>

      <div className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Type a message and press Enter…"
        />
        <button onClick={send} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
