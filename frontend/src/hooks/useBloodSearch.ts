"use client";

import { useState, useCallback } from "react";
import { BloodBankWithAvailability, SearchParams } from "@/types";
import api from "@/lib/api";

export function useBloodSearch() {
  const [results, setResults] = useState<BloodBankWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("blood_group", params.blood_group);
      if (params.city) queryParams.set("city", params.city);
      if (params.latitude) queryParams.set("latitude", String(params.latitude));
      if (params.longitude) queryParams.set("longitude", String(params.longitude));
      if (params.radius) queryParams.set("radius", String(params.radius));

      const res = await api.get(`/api/blood/search?${queryParams.toString()}`);
      const data = res.data;
      setResults(data.results || []);
    } catch {
      setError("Failed to search blood availability. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { results, isLoading, error, search };
}
