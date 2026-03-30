"use client";

import { useState } from "react";
import { useHealthCheck, useChatMutation, useExamples } from "@/client/hooks";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const health = useHealthCheck();
  const chat = useChatMutation();
  const examples = useExamples();

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 font-sans text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Take‑Home Boilerplate: Next.js + Neon + LLM
          </h1>
          <p className="text-sm text-zinc-600">
            This page exercises the BFF layer by calling a database-backed health
            check and an LLM-powered chat endpoint.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-zinc-900">Database health</h2>
              <p className="text-xs text-zinc-600">
                Checks connectivity to the Neon Postgres database via a simple{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.7rem]">
                  select 1
                </code>{" "}
                query.
              </p>
            </div>
            <button
              type="button"
              onClick={() => health.refetch()}
              disabled={health.isFetching}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {health.isFetching ? "Checking..." : "Run health check"}
            </button>
          </div>
          <div className="mt-3 text-xs text-zinc-700">
            <span className="font-medium">Status:</span>{" "}
            {!health.data && !health.error && (
              <span className="text-zinc-500">not checked</span>
            )}
            {health.data?.ok && <span className="text-emerald-600">ok</span>}
            {(health.data && !health.data.ok) && (
              <span className="text-red-600">error</span>
            )}
            {health.error && <span className="text-red-600">error</span>}
            {(health.error || health.data?.error) && (
              <div className="mt-1 text-[0.7rem] text-red-600">
                {health.error instanceof Error
                  ? health.error.message
                  : health.data?.error}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-zinc-900">Examples</h2>
              <p className="text-xs text-zinc-600">
                Fetched from{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.7rem]">
                  /api/examples
                </code>{" "}
                via <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.7rem]">useExamples</code> hook
                &mdash; cached &amp; deduplicated by TanStack Query.
              </p>
            </div>
            {examples.isRefetching && (
              <span className="text-[0.7rem] text-zinc-400">refreshing…</span>
            )}
          </div>

          <div className="mt-3">
            {examples.isLoading && (
              <p className="text-xs text-zinc-500">Loading…</p>
            )}
            {examples.error && (
              <p className="text-xs text-red-600">
                {examples.error instanceof Error
                  ? examples.error.message
                  : "Failed to load examples"}
              </p>
            )}
            {examples.data && examples.data.length === 0 && (
              <p className="text-xs text-zinc-500">No examples found.</p>
            )}
            {examples.data && examples.data.length > 0 && (
              <ul className="divide-y divide-zinc-100">
                {examples.data.map((item) => (
                  <li key={item.id} className="py-2 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                    <p className="text-xs text-zinc-600">{item.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-900">LLM chat</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Sends your prompt to the server‑side{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.7rem]">
              /api/chat
            </code>{" "}
            endpoint, which forwards it to the configured OpenAI model.
          </p>
          <div className="mt-3 space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none ring-0 focus:border-zinc-400"
              placeholder="Ask the model something..."
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => chat.mutate(prompt)}
                disabled={chat.isPending || !prompt.trim()}
                className="rounded-md bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {chat.isPending ? "Sending..." : "Send to LLM"}
              </button>
              <span className="text-[0.7rem] text-zinc-500">
                Uses server-only OpenAI API key
              </span>
            </div>
          </div>

          {(chat.data || chat.error) && (
            <div className="mt-4 rounded-md border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {chat.error || chat.data?.error ? (
                <p className="text-red-600">
                  <span className="font-medium">Error:</span>{" "}
                  {chat.error instanceof Error
                    ? chat.error.message
                    : chat.data?.error}
                </p>
              ) : (
                <p className="whitespace-pre-wrap text-zinc-800">
                  {chat.data?.content || "(empty response)"}
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
