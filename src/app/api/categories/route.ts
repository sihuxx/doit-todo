import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("user_id", session.sub)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, color } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "카테고리 이름을 입력해주세요." }, { status: 400 });

  const db = createServerClient();
  const { data, error } = await db
    .from("categories")
    .insert({ user_id: session.sub, name: name.trim(), color: color || "#3B82F6" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
