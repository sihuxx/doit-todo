"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { notifications, loading } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 브라우저 푸시 알림 (옵션: 권한 허용 시)
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const overdueOrToday = notifications.filter((n) => n.level === "overdue" || n.level === "today");
    if (overdueOrToday.length === 0) return;

    // 세션당 한 번만 브라우저 알림 띄우기
    const key = "doit-notified-today-" + new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    new Notification(`DoIt — 오늘 마감 ${overdueOrToday.length}건`, {
      body: overdueOrToday.slice(0, 3).map((n) => "• " + n.title).join("\n"),
      icon: "/favicon.ico",
    });
  }, [notifications]);

  const overdueCount = notifications.filter((n) => n.level === "overdue").length;
  const todayCount = notifications.filter((n) => n.level === "today").length;
  const totalCount = notifications.length;

  const requestPush = async () => {
    if (!("Notification" in window)) return;
    await Notification.requestPermission();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="알림"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 2v1m0 0a5 5 0 015 5v3l1.5 2H2.5L4 11V8a5 5 0 015-5zm-2 12a2 2 0 004 0"
            stroke="#64748B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        {totalCount > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${
            overdueCount > 0 ? "bg-red-500" : todayCount > 0 ? "bg-amber-500" : "bg-blue-500"
          }`}>
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-32px)] bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">알림</h3>
            {"Notification" in (typeof window !== "undefined" ? window : {}) && Notification.permission === "default" && (
              <button
                onClick={requestPush}
                className="text-[11px] text-blue-500 hover:text-blue-600 font-medium"
              >
                푸시 알림 켜기
              </button>
            )}
          </div>

          {/* Summary bar */}
          {totalCount > 0 && (
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3 text-[11px] text-slate-500">
              {overdueCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>지남 {overdueCount}</span>
                </span>
              )}
              {todayCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>오늘 {todayCount}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>임박 {totalCount - overdueCount - todayCount}</span>
              </span>
            </div>
          )}

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-xs text-slate-400">불러오는 중...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-auto mb-2 opacity-30">
                  <circle cx="20" cy="20" r="18" stroke="#94A3B8" strokeWidth="1.2"/>
                  <path d="M13 21l5 5 9-12" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-xs text-slate-400">임박한 할일이 없어요</p>
                <p className="text-[11px] text-slate-300 mt-0.5">여유 있게 잘 하고 계세요 👍</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { router.push("/todos"); setOpen(false); }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-b-0"
                >
                  <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${
                    n.level === "overdue" ? "bg-red-500" :
                    n.level === "today" ? "bg-amber-500" : "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{n.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[11px] font-medium ${
                        n.level === "overdue" ? "text-red-500" :
                        n.level === "today" ? "text-amber-600" : "text-slate-500"
                      }`}>
                        {n.message}
                      </span>
                      {n.category && Array.isArray(n.category) === false && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ background: (n.category as any).color + "20", color: (n.category as any).color }}
                        >
                          {(n.category as any).name}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
