import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

const DEFAULT_DAYS = [0, 1, 3]; // D-0, D-1, D-3

// GET — 현재 사용자의 알림 설정 조회 (없으면 기본값 반환)
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();
  const { data } = await db
    .from("notification_settings")
    .select("*")
    .eq("user_id", session.sub)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({
      data: { enabled: true, notify_days: DEFAULT_DAYS },
    });
  }
  return NextResponse.json({ data });
}

// PATCH — 알림 설정 업데이트 (upsert)
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const enabled = typeof body.enabled === "boolean" ? body.enabled : true;
  const notifyDays: number[] = Array.isArray(body.notify_days)
    ? body.notify_days.filter((d: unknown) => typeof d === "number" && d >= 0 && d <= 30)
    : DEFAULT_DAYS;

  const db = createServerClient();
  const { data, error } = await db
    .from("notification_settings")
    .upsert(
      {
        user_id: session.sub,
        enabled,
        notify_days: notifyDays,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
