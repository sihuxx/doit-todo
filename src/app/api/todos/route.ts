import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

// GET /api/todos?category_id=xxx
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id");

  const db = createServerClient();
  let query = db
    .from("todos")
    .select("*, category:categories(id,name,color)")
    .eq("user_id", session.sub)
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

// POST /api/todos
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, category_id, due_date } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });

  const db = createServerClient();
  const { data, error } = await db
    .from("todos")
    .insert({
      user_id: session.sub,
      title: title.trim(),
      category_id: category_id || null,
      due_date: due_date || null,
    })
    .select("*, category:categories(id,name,color)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
