import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDday(dateStr: string | null): { label: string; level: "normal" | "urgent" | "overdue" } | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { label: `${Math.abs(diff)}일 지남`, level: "overdue" };
  if (diff === 0) return { label: "오늘 마감", level: "urgent" };
  if (diff <= 2)  return { label: `D-${diff}`, level: "urgent" };
  return { label: `D-${diff}`, level: "normal" };
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
