"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { queryKeys } from "./query-keys";

export function useExamples() {
  return useQuery({
    queryKey: queryKeys.examples,
    queryFn: api.getExamples,
  });
}
