import { create } from "zustand";
import toast from "react-hot-toast";
import { TaskData } from "../types/types";

interface TodoStore {
  todos: TaskData[];
  loading: boolean;
  error: string | null;

  fetchTodos: (ownerId?: string) => Promise<void>;
  addTodo: (todo: Omit<TaskData, "id" | "ownerId" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTodo: (id: string, todo: Partial<TaskData>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  // 🧠 Fetch todos from API
  fetchTodos: async (ownerId?: string) => {
    set({ loading: true });
    try {
      const query = ownerId ? `?ownerId=${ownerId}` : "";
      const res = await fetch(`/api/admin/todos${query}`);
      if (!res.ok) throw new Error("Failed to fetch todos");

      const data: any[] = await res.json();
      set({ todos: data, loading: false });
    } catch (err: any) {
      console.error("fetchTodos error:", err);
      toast.error("Failed to load todos");
      set({ error: err.message, loading: false });
    }
  },

  // ➕ Add a new todo
  addTodo: async (todo) => {
    try {
      const res = await fetch(`/api/admin/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create todo");
      }

      const created: TaskData = await res.json();
      set({ todos: [...get().todos, created] });
      toast.success("Todo created successfully!");
    } catch (err: any) {
      console.error("addTodo error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },

  // ✏️ Update a todo
  updateTodo: async (id, todo) => {
    try {
      const res = await fetch(`/api/admin/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update todo");
      }

      const updated: TaskData = await res.json();
      set({
        todos: get().todos.map((t) => (t.id === id ? updated : t)),
      });

    } catch (err: any) {
      console.error("updateTodo error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },

  // ❌ Delete a todo
  deleteTodo: async (id) => {
    try {
      const res = await fetch(`/api/admin/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");

      set({
        todos: get().todos.filter((t) => t.id !== id),
      });
      toast.success("Todo deleted successfully!");
    } catch (err: any) {
      console.error("deleteTodo error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },
}));