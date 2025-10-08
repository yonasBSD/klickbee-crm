import { create } from "zustand";
import toast from "react-hot-toast";
import { Prospect } from "../types/types";

interface ProspectStore {
  prospects: Prospect[];
  loading: boolean;
  error: string | null;

  fetchProspects: (ownerId?: string) => Promise<void>;
  addProspect: (prospect: Omit<Prospect, "id" | "ownerId" | "userId" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProspect: (id: string, prospect: Partial<Prospect>) => Promise<void>;
  deleteProspect: (id: string) => Promise<void>;
}

export const useProspectsStore = create<ProspectStore>((set, get) => ({
  prospects: [],
  loading: false,
  error: null,

  // 🧠 Fetch prospects from API
  fetchProspects: async (ownerId?: string) => {
    set({ loading: true });
    try {
      const query = ownerId ? `?ownerId=${ownerId}` : "";
      const res = await fetch(`/api/admin/prospects${query}`);
      if (!res.ok) throw new Error("Failed to fetch prospects");

      const data: Prospect[] = await res.json();
      const cleanData: Prospect[] = data?.length ? data.map(prospect => {
        const ownerName = typeof prospect.owner === 'object' && prospect.owner?.name
          ? prospect.owner.name
          : typeof prospect.owner === 'string'
          ? prospect.owner
          : 'Unknown';

        const ownerAvatar = typeof prospect.owner === 'object' && prospect.owner?.email
          ? prospect.owner.email // Using email as avatar fallback, you might want to use a proper avatar field
          : undefined;

        return {
          ...prospect,
          owner: ownerName,
          ownerAvatar: ownerAvatar
        };
      }) : data;
      set({ prospects: cleanData, loading: false });
    } catch (err: any) {
      console.error("fetchProspects error:", err);
      toast.error("Failed to load prospects");
      set({ error: err.message, loading: false });
    }
  },

  // ➕ Add a new prospect
  addProspect: async (prospect) => {
    try {
      const res = await fetch(`/api/admin/prospects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prospect),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create prospect");
      }

      const created: Prospect = await res.json();
      set({ prospects: [...get().prospects, created] });
      toast.success("Prospect created successfully!");
    } catch (err: any) {
      console.error("addProspect error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },

  // ✏️ Update a prospect
  updateProspect: async (id, prospect) => {
    try {
      const res = await fetch(`/api/admin/prospects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prospect),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update prospect");
      }

      const updated: Prospect = await res.json();
      set({
        prospects: get().prospects.map((p) => (p.id === id ? updated : p)),
      });
      toast.success("Prospect updated successfully!");
    } catch (err: any) {
      console.error("updateProspect error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },

  // ❌ Delete a prospect
  deleteProspect: async (id) => {
    try {
      const res = await fetch(`/api/admin/prospects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete prospect");

      set({
        prospects: get().prospects.filter((p) => p.id !== id),
      });
      toast.success("Prospect deleted successfully!");
    } catch (err: any) {
      console.error("deleteProspect error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },
}));