"use client";
import { useState, useRef, useEffect } from "react";
import { cn, formatDday } from "@/lib/utils";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const dday = formatDday(todo.due_date);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveEdit = () => {
    if (editText.trim() && editText.trim() !== todo.title) {
      onUpdate(todo.id, editText.trim());
    } else {
      setEditText(todo.title);
    }
    setEditing(false);
  };

  return (
    <div className={cn(
      "group flex items-start gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100",
      "hover:border-slate-200 hover:shadow-sm transition-all duration-150",
      todo.is_completed && "opacity-50"
    )}>
      {/* Checkbox */}
      <button
        className="flex-shrink-0 mt-0.5"
        onClick={() => onToggle(todo.id, !todo.is_completed)}
      >
        {todo.is_completed ? (
          <div className="w-[18px] h-[18px] rounded-md bg-blue-500 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ) : (
          <div className="w-[18px] h-[18px] rounded-md border-[1.5px] border-slate-200 group-hover:border-blue-300 transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            className="w-full text-sm border-b border-blue-400 outline-none py-0.5 bg-transparent"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") { setEditText(todo.title); setEditing(false); }}}
          />
        ) : (
          <span
            className={cn("text-sm text-slate-700 cursor-text leading-snug", todo.is_completed && "line-through text-slate-400")}
            onDoubleClick={() => !todo.is_completed && setEditing(true)}
          >
            {todo.title}
          </span>
        )}

        {/* Tags row */}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {todo.category && (
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: todo.category.color + "20", color: todo.category.color }}
            >
              {todo.category.name}
            </span>
          )}
          {dday && (
            <span className={cn(
              "text-[11px] font-medium px-2 py-0.5 rounded-full",
              dday.level === "overdue" && "bg-red-50 text-red-500",
              dday.level === "urgent" && "bg-amber-50 text-amber-600",
              dday.level === "normal" && "bg-slate-100 text-slate-400",
            )}>
              {dday.label}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!todo.is_completed && (
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            onClick={() => setEditing(true)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 10l7.2-7.2 1.5 1.5L3 11.5H1.5V10z" fill="currentColor"/>
              <path d="M10 2l1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <button
          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors"
          onClick={() => onDelete(todo.id)}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M3 4h7M5 4V3a1 1 0 011-1h1a1 1 0 011 1v1M8.5 4v5.5a1 1 0 01-1 1h-2a1 1 0 01-1-1V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
