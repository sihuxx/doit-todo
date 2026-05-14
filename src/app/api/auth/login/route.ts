import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServerClient } from "@/lib/supabase";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { nickname, password } = await req.json();

  if (!nickname?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "닉네임과 비밀번호를 입력해주세요." }, { status: 400 });
  }

  const db = createServerClient();

  const { data: user } = await db
    .from("users")
    .select("id, nickname, password_hash, created_at")
    .eq("nickname", nickname.trim())
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "존재하지 않는 계정입니다." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
  }

  const token = await signToken({ sub: user.id, nickname: user.nickname });
  setAuthCookie(token);

  return NextResponse.json({ data: { id: user.id, nickname: user.nickname } });
}
