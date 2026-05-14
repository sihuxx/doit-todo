export interface User {
  id: string;
  nickname: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  category?: Category;
}

export interface AuthPayload {
  sub: string;       // user id
  nickname: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
