import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

const DEFAULT_DAYS = [0, 1, 3];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();

  // 1. 사용자 알림 설정 조회
  const { data: settings } = await db
    .from("notification_settings")
    .select("enabled, notify_days")
    .eq("user_id", session.sub)
    .maybeSingle();

  const enabled = settings?.enabled ?? true;
  const notifyDays: number[] = settings?.notify_days ?? DEFAULT_DAYS;

  if (!enabled) return NextResponse.json({ data: [] });

  // 2. 가장 먼 알림 시점 (= 가져올 범위)
  const maxDay = notifyDays.length > 0 ? Math.max(...notifyDays) : 3;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDay);

  // 3. 미완료 + 마감일 ≤ maxDate
  const { data, error } = await db
    .from("todos")
    .select("id, title, due_date, category:categories(id,name,color)")
    .eq("user_id", session.sub)
    .eq("is_completed", false)
    .not("due_date", "is", null)
    .lte("due_date", maxDate.toISOString().slice(0, 10))
    .order("due_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 4. notify_days 와 일치하는 것만 + 지난 건은 항상 포함
  const notifications = (data ?? [])
    .map((t) => {
      const due = new Date(t.due_date + "T00:00:00");
      const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let level: "overdue" | "today" | "soon" = "soon";
      let message = "";
      if (diff < 0) { level = "overdue"; message = Math.abs(diff) + "일 지났어요"; }
      else if (diff === 0) { level = "today"; message = "오늘 마감이에요"; }
      else { level = "soon"; message = diff + "일 후 마감"; }

      return { id: t.id, title: t.title, due_date: t.due_date, category: t.category, level, message, diff };
    })
    .filter((n) => n.diff < 0 || notifyDays.includes(n.diff));

  return NextResponse.json({ data: notifications });
}
