"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "../api";

export function useChatMutation() {
  return useMutation({
    mutationFn: (prompt: string) => api.postChat(prompt),
  });
}
