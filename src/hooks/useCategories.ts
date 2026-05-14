"use client";
import { useState, useEffect } from "react";
import type { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  const addCategory = async (name: string, color: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });
    const { data } = await res.json();
    if (data) setCategories((prev) => [...prev, data]);
    return data;
  };

  const deleteCategory = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return { categories, addCategory, deleteCategory };
}
