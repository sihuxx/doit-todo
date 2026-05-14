"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 이미 로그인 상태면 /todos로
  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (r.ok) router.replace("/todos");
    });
  }, [router]);

  const handleSubmit = async () => {
    if (!nickname.trim() || !password.trim()) {
      setError("닉네임과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: nickname.trim(), password }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "오류가 발생했습니다.");
      return;
    }
    router.push("/todos");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-2xl font-bold text-slate-800 tracking-tight">DoIt</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200 border border-slate-100 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            {isSignup ? "회원가입" : "로그인"}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {isSignup ? "새 계정을 만들어보세요" : "로그인하고 할일을 관리하세요"}
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-2.5 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">닉네임</label>
              <Input
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => { setNickname(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">비밀번호</label>
              <Input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          <Button
            className="w-full mt-5 py-2.5"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "처리 중..." : isSignup ? "회원가입" : "로그인"}
          </Button>

          <p className="text-sm text-slate-400 text-center mt-4">
            {isSignup ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}{" "}
            <button
              className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
            >
              {isSignup ? "로그인" : "회원가입"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
