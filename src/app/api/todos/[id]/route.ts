import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

// PATCH /api/todos/:id  (완료 토글 or 제목 수정)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = createServerClient();

  // is_completed 변경 시 completed_at 자동 세팅
  const updates: Record<string, unknown> = { ...body };
  if (typeof body.is_completed === "boolean") {
    updates.completed_at = body.is_completed ? new Date().toISOString() : null;
  }

  const { data, error } = await db
    .from("todos")
    .update(updates)
    .eq("id", params.id)
    .eq("user_id", session.sub) // 본인 것만 수정 가능
    .select("*, category:categories(id,name,color)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/todos/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();
  const { error } = await db
    .from("todos")
    .delete()
    .eq("id", params.id)
    .eq("user_id", session.sub);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: "deleted" });
}
