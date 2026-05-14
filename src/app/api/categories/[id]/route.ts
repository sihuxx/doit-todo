import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();

  // 해당 카테고리의 todo들 category_id를 null로 초기화
  await db
    .from("todos")
    .update({ category_id: null })
    .eq("category_id", params.id)
    .eq("user_id", session.sub);

  const { error } = await db
    .from("categories")
    .delete()
    .eq("id", params.id)
    .eq("user_id", session.sub);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: "deleted" });
}
