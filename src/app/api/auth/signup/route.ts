import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServerClient } from "@/lib/supabase";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { nickname, password } = await req.json();

  if (!nickname?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "닉네임과 비밀번호를 입력해주세요." }, { status: 400 });
  }
  if (nickname.trim().length < 2) {
    return NextResponse.json({ error: "닉네임은 2자 이상이어야 합니다." }, { status: 400 });
  }
  if (password.length < 4) {
    return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
  }

  const db = createServerClient();

  // 중복 닉네임 확인
  const { data: existing } = await db
    .from("users")
    .select("id")
    .eq("nickname", nickname.trim())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data: user, error } = await db
    .from("users")
    .insert({ nickname: nickname.trim(), password_hash })
    .select("id, nickname, created_at")
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "회원가입 중 오류가 발생했습니다." }, { status: 500 });
  }

  // 기본 카테고리 생성
  await db.from("categories").insert([
    { user_id: user.id, name: "공부", color: "#3B82F6" },
    { user_id: user.id, name: "운동", color: "#10B981" },
    { user_id: user.id, name: "취미", color: "#F59E0B" },
  ]);

  const token = await signToken({ sub: user.id, nickname: user.nickname });
  setAuthCookie(token);

  return NextResponse.json({ data: { id: user.id, nickname: user.nickname } });
}
