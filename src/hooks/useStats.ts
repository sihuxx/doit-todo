"use client";
import { useState, useEffect } from "react";

export interface DailyStat {
  date: string;
  label: string;
  completed: number;
  total: number;
  rate: number;
}

export interface StatsData {
  weekly: DailyStat[];
  monthly: DailyStat[];
}

export function useStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
