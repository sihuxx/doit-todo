import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();

  const { data: todos, error } = await db
    .from("todos")
    .select("id, is_completed, created_at, completed_at")
    .eq("user_id", session.sub);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!todos) return NextResponse.json({ data: { weekly: [], monthly: [] } });

  const weekly = buildDailyStats(todos, 7);
  const monthly = buildDailyStats(todos, 30);

  return NextResponse.json({ data: { weekly, monthly } });
}

interface TodoLike {
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
}

function buildDailyStats(todos: TodoLike[], days: number) {
  const result: { date: string; label: string; completed: number; total: number; rate: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);

    const created = todos.filter((t) => t.created_at?.slice(0, 10) === dateStr).length;
    const completed = todos.filter((t) => t.completed_at?.slice(0, 10) === dateStr).length;
    const rate = created > 0 ? Math.round((completed / created) * 100) : 0;

    result.push({
      date: dateStr,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      completed,
      total: created,
      rate,
    });
  }
  return result;
}
