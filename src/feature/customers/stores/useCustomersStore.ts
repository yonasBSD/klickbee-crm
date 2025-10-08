import { create } from "zustand";
import toast from "react-hot-toast";
import { Customer } from "../types/types";

interface CustomerStore {
  customers: Customer[];
  loading: boolean;
  error: string | null;

  fetchCustomers: (ownerId?: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, "id" | "ownerId" | "createdAt">) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomersStore = create<CustomerStore>((set, get) => ({
  customers: [],
  loading: false,
  error: null,

  // 🧠 Fetch customers from API
  fetchCustomers: async (ownerId?: string) => {
    set({ loading: true });
    try {
      const query = ownerId ? `?ownerId=${ownerId}` : "";
      const res = await fetch(`/api/admin/customers${query}`);
      if (!res.ok) throw new Error("Failed to fetch customers");

      const data: Customer[] = await res.json();
      set({ customers: data, loading: false });
    } catch (err: any) {
      console.error("fetchCustomers error:", err);
      toast.error("Failed to load customers");
      set({ error: err.message, loading: false });
    }
  },

  // ➕ Add a new customer
  addCustomer: async (customer) => {
    try {
      const res = await fetch(`/api/admin/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create customer");
      }

      const created: Customer = await res.json();
      set({ customers: [...get().customers, created] });
      toast.success("Customer created successfully!");
    } catch (err: any) {
      console.error("addCustomer error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },

  // ✏️ Update a customer
  updateCustomer: async (id, customer) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update customer");
      }

      const updated: Customer = await res.json();
      set({
        customers: get().customers.map((c) => (c.id === id ? updated : c)),
      });

    } catch (err: any) {
      console.error("updateCustomer error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },

  // ❌ Delete a customer
  deleteCustomer: async (id) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete customer");

      set({
        customers: get().customers.filter((c) => c.id !== id),
      });
      toast.success("Customer deleted successfully!");
    } catch (err: any) {
      console.error("deleteCustomer error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },
}));