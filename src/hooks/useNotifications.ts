"use client";
import { useState, useEffect, useCallback } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  due_date: string;
  category: { id: string; name: string; color: string } | null;
  level: "overdue" | "today" | "soon";
  message: string;
  diff: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/notifications");
    const { data } = await res.json();
    setNotifications(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    // 1분마다 자동 새로고침 (날짜 경계 처리)
    const interval = setInterval(fetchAll, 60_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { notifications, loading, refetch: fetchAll };
}
