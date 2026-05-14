"use client";
import { useState, useEffect, useCallback } from "react";
import type { Todo } from "@/types";

export function useTodos(categoryId?: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const url = categoryId ? `/api/todos?category_id=${categoryId}` : "/api/todos";
    const res = await fetch(url);
    const { data } = await res.json();
    setTodos(data ?? []);
    setLoading(false);
  }, [categoryId]);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const addTodo = async (title: string, category_id?: string, due_date?: string) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category_id, due_date }),
    });
    const { data } = await res.json();
    if (data) setTodos((prev) => [data, ...prev]);
    return data;
  };

  const toggleTodo = async (id: string, is_completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed }),
    });
    const { data } = await res.json();
    if (data) setTodos((prev) => prev.map((t) => (t.id === id ? data : t)));
  };

  const updateTodo = async (id: string, title: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const { data } = await res.json();
    if (data) setTodos((prev) => prev.map((t) => (t.id === id ? data : t)));
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo, refetch: fetchTodos };
}
