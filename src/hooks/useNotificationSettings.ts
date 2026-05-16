"use client";
import { useState, useEffect, useCallback } from "react";

export interface NotificationSettings {
  enabled: boolean;
  notify_days: number[];
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/notification-settings")
      .then((r) => r.json())
      .then(({ data }) => setSettings(data ?? { enabled: true, notify_days: [0, 1, 3] }))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (next: NotificationSettings) => {
    setSaving(true);
    const res = await fetch("/api/notification-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const { data } = await res.json();
    if (data) setSettings(data);
    setSaving(false);
    return data;
  }, []);

  return { settings, loading, saving, save };
}
