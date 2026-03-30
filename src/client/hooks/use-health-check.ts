"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { queryKeys } from "./query-keys";

export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.getHealth,
    enabled: false,
    retry: false,
  });
}
