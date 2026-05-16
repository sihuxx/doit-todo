"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import type { Category, User } from "@/types";

const PALETTE = [
  "#3B82F6", "#10B981", "#F59E0B", "#F43F5E",
  "#8B5CF6", "#F97316", "#06B6D4", "#6366F1",
];

interface SidebarProps {
  user: User;
  categories: Category[];
  todos: { category_id: string | null }[];
  onAddCategory: (name: string, color: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  user, categories, todos, onAddCategory, onDeleteCategory, onLogout, isOpen, onClose
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddCat, setShowAddCat] = useState(false);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState(PALETTE[0]);

  const countForCat = (id: string) => todos.filter((t) => t.category_id === id).length;
  const isAll = pathname === "/todos";
  const isMypage = pathname === "/mypage";

  const handleAddCat = async () => {
    if (!catName.trim()) return;
    await onAddCategory(catName.trim(), catColor);
    setCatName("");
    setShowAddCat(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-100",
        "flex flex-col h-full transition-transform duration-250 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-bold text-lg text-slate-800 tracking-tight">DoIt</span>
          </div>
          <NotificationBell />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">메뉴</p>
          <button
            onClick={() => { router.push("/todos"); onClose(); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5",
              isAll ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            전체보기
            <span className="ml-auto text-xs text-slate-300 font-medium">{todos.length}</span>
          </button>

          <button
            onClick={() => { router.push("/mypage"); onClose(); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5",
              isMypage ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 13.5C2 11 4.2 9 8 9s6 2 6 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            마이페이지
          </button>

          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mt-4 mb-1.5">카테고리</p>
          {categories.map((cat) => {
            const isActive = pathname === `/todos/${cat.id}`;
            return (
              <div
                key={cat.id}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer mb-0.5",
                  isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-500 hover:bg-slate-50"
                )}
                onClick={() => { router.push(`/todos/${cat.id}`); onClose(); }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <span className="flex-1 truncate">{cat.name}</span>
                <span className="text-xs text-slate-300 font-medium group-hover:hidden">{countForCat(cat.id)}</span>
                <button
                  className="hidden group-hover:block text-slate-300 hover:text-red-400 transition-colors leading-none"
                  onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }}
                >×</button>
              </div>
            );
          })}

          {showAddCat ? (
            <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <input
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white"
                placeholder="카테고리 이름"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCat()}
                autoFocus
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    className="w-5 h-5 rounded-full transition-transform"
                    style={{
                      background: c,
                      outline: catColor === c ? `2px solid ${c}` : "2px solid transparent",
                      outlineOffset: 1,
                      transform: catColor === c ? "scale(1.15)" : "scale(1)",
                    }}
                    onClick={() => setCatColor(c)}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-2.5">
                <button
                  className="flex-1 py-1 text-xs bg-blue-500 text-white rounded-lg font-medium"
                  onClick={handleAddCat}
                >추가</button>
                <button
                  className="flex-1 py-1 text-xs bg-slate-100 text-slate-500 rounded-lg"
                  onClick={() => setShowAddCat(false)}
                >취소</button>
              </div>
            </div>
          ) : (
            <button
              className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mt-1"
              onClick={() => setShowAddCat(true)}
            >
              <span className="text-base leading-none">+</span> 카테고리 추가
            </button>
          )}
        </nav>

        {/* User */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1 text-sm font-medium text-slate-600 truncate">{user.nickname}</span>
          <button
            className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            onClick={onLogout}
            title="로그아웃"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M10.5 11.5L14 8l-3.5-3.5M14 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
