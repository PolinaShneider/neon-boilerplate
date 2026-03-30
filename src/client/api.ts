import type { ExampleItem } from "@/server/bff/example";

export type HealthResponse = { ok: boolean; error?: string };
export type ChatResponse = { content?: string; error?: string };
export type ExamplesResponse = { items: ExampleItem[] };

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Request failed (${res.status})`,
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  getHealth: () => fetchJson<HealthResponse>("/api/health"),

  postChat: (prompt: string) =>
    fetchJson<ChatResponse>("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }),

  getExamples: () =>
    fetchJson<ExamplesResponse>("/api/examples").then((r) => r.items),
} as const;
