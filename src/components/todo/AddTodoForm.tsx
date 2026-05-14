"use client";
import { useState, useRef, useEffect } from "react";
import type { Category } from "@/types";

interface AddTodoFormProps {
  categories: Category[];
  onAdd: (title: string, categoryId?: string, dueDate?: string) => Promise<void>;
  onClose: () => void;
  defaultCategoryId?: string;
}

export function AddTodoForm({ categories, onAdd, onClose, defaultCategoryId }: AddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? "");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async () => {
    if (!title.trim() || loading) return;
    setLoading(true);
    await onAdd(title.trim(), categoryId || undefined, dueDate || undefined);
    setTitle("");
    setDueDate("");
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm shadow-blue-50 p-4 mb-5">
      <input
        ref={inputRef}
        className="w-full text-sm outline-none placeholder:text-slate-300 text-slate-700"
        placeholder="할일을 입력하세요..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
      />
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
        <select
          className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-slate-50 text-slate-500"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">카테고리 없음</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-slate-50 text-slate-500"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="ml-auto flex items-center gap-2">
          <button
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1.5"
            onClick={onClose}
          >취소</button>
          <button
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!title.trim() || loading}
          >
            {loading ? "추가 중..." : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
}
