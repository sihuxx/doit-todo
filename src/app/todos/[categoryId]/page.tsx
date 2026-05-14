"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useTodos } from "@/hooks/useTodos";
import { useCategories } from "@/hooks/useCategories";
import { TodoItem } from "@/components/todo/TodoItem";
import { AddTodoForm } from "@/components/todo/AddTodoForm";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodos(categoryId);
  const { categories } = useCategories();
  const [showAdd, setShowAdd] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  const active = todos.filter((t) => !t.is_completed);
  const completed = todos.filter((t) => t.is_completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            {category && (
              <div className="w-3 h-3 rounded-full" style={{ background: category.color }} />
            )}
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {category?.name ?? "카테고리"}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {active.length}개 진행 중 · {completed.length}개 완료
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-blue-200"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          할일 추가
        </button>
      </div>

      {showAdd && (
        <AddTodoForm
          categories={categories}
          onAdd={async (title, catId, dueDate) => {
            await addTodo(title, catId ?? categoryId, dueDate);
          }}
          onClose={() => setShowAdd(false)}
          defaultCategoryId={categoryId}
        />
      )}

      {todos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3 opacity-20">
            <rect x="8" y="10" width="32" height="28" rx="4" stroke="#94A3B8" strokeWidth="1.5"/>
            <path d="M16 22h16M16 28h10" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <p className="text-slate-400 text-sm">이 카테고리에 할일이 없어요</p>
        </div>
      )}

      {active.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-2">
          {active.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onUpdate={updateTodo} onDelete={deleteTodo} />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <>
          <div className="flex items-center gap-2 pt-5 pb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">완료됨</span>
            <span className="text-xs text-slate-300">{completed.length}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {completed.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
