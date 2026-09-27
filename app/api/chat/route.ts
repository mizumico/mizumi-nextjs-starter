import OpenAI from "openai";
import { NextRequest } from "next/server";

// Mizumi is an OpenAI-compatible API — just point the official SDK at it.
// Docs: https://mizumi.co/docs
const client = new OpenAI({
  apiKey: process.env.MIZUMI_API_KEY,
  baseURL: "https://api.mizumi.co/v1",
});

// Allowlisted models; the client sends one of these.
const ALLOWED_MODELS = new Set([
  "gpt-5.6-sol",
  "gpt-5.6-luna",
  "gemini-3.6-flash",
]);

export async function POST(req: NextRequest) {
  if (!process.env.MIZUMI_API_KEY) {
    return new Response(
      "MIZUMI_API_KEY is not set. Copy .env.example to .env.local and add your key from https://mizumi.co",
      { status: 500 }
    );
  }

  const body = await req.json();
  const model = typeof body.model === "string" ? body.model : "gpt-5.6-sol";
  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (!ALLOWED_MODELS.has(model)) {
    return new Response(`Unsupported model: ${model}`, { status: 400 });
  }

  const stream = await client.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  // Convert the OpenAI SSE stream into a plain-text ReadableStream
  // so the browser can consume it with a simple reader.
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
