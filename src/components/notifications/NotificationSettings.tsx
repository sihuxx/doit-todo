"use client";
import { useState, useEffect } from "react";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

const DAY_OPTIONS = [
  { value: 0, label: "당일 (D-day)" },
  { value: 1, label: "1일 전 (D-1)" },
  { value: 2, label: "2일 전 (D-2)" },
  { value: 3, label: "3일 전 (D-3)" },
  { value: 7, label: "1주일 전 (D-7)" },
];

export function NotificationSettings() {
  const { settings, loading, saving, save } = useNotificationSettings();
  const [enabled, setEnabled] = useState(true);
  const [days, setDays] = useState<number[]>([0, 1, 3]);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [savedHint, setSavedHint] = useState(false);

  // 서버에서 설정 불러오면 로컬 state 동기화
  useEffect(() => {
    if (settings) {
      setEnabled(settings.enabled);
      setDays(settings.notify_days ?? [0, 1, 3]);
    }
  }, [settings]);

  // 브라우저 알림 권한 상태 확인
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const toggleDay = (day: number) => {
    setDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b));
  };

  const handleSave = async () => {
    await save({ enabled, notify_days: days });
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2000);
  };

  const requestPushPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-base font-bold text-slate-800">알림 설정</h3>
        {savedHint && (
          <span className="text-xs text-emerald-600 font-medium">✓ 저장됨</span>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-5">마감일 알림을 받을 시점을 선택하세요</p>

      {/* 1. 알림 ON/OFF 토글 */}
      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-medium text-slate-700">알림 사용</p>
          <p className="text-xs text-slate-400 mt-0.5">마감 임박 할일을 알려드려요</p>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-blue-500" : "bg-slate-200"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {/* 2. 브라우저 푸시 권한 */}
      {enabled && permission !== "unsupported" && (
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">브라우저 푸시 알림</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {permission === "granted" && "✓ 허용됨"}
              {permission === "denied" && "차단됨 (브라우저 설정에서 변경)"}
              {permission === "default" && "권한이 필요해요"}
            </p>
          </div>
          {permission === "default" && (
            <button
              onClick={requestPushPermission}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            >
              허용
            </button>
          )}
        </div>
      )}

      {/* 3. 알림 시점 선택 */}
      {enabled && (
        <div className="py-4 border-b border-slate-100">
          <p className="text-sm font-medium text-slate-700 mb-1">알림 시점</p>
          <p className="text-xs text-slate-400 mb-3">여러 개 선택 가능 (지난 마감일은 항상 알림)</p>
          <div className="flex flex-wrap gap-2">
            {DAY_OPTIONS.map((opt) => {
              const active = days.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleDay(opt.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    active
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white text-sm font-medium rounded-xl transition-colors"
      >
        {saving ? "저장 중..." : "설정 저장"}
      </button>
    </div>
  );
}
