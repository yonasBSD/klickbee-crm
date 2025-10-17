import { create } from "zustand";
import toast from "react-hot-toast";
import { Meeting } from "../types/meeting";
import { FilterData, meetingFilterData } from "../libs/filterData";
import { useUserStore } from "../../user/store/userStore";

interface MeetingStore {
  meetings: Meeting[];
  filteredMeetings: Meeting[];
  loading: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  isExporting: boolean;
  error: string | null;
  filters: FilterData;

  fetchMeetings: (ownerId?: string) => Promise<void>;
  setFilters: (filters: FilterData) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  generateOwnerOptions: () => any[];
  initializeOwnerOptions: () => void;
  addMeeting: (meeting: Omit<Meeting, "id" | "ownerId" | "createdAt">) => Promise<void>;
  updateMeeting: (id: string, meeting: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
}

// Helper function to convert date strings to Date objects
const convertDates = (meeting: any): Meeting => ({
  ...meeting,
  startDate: meeting.startDate ? new Date(meeting.startDate) : meeting.startDate,
  startTime: meeting.startTime ? new Date(meeting.startTime) : meeting.startTime,
  endTime: meeting.endTime ? new Date(meeting.endTime) : meeting.endTime,
});

export const useMeetingsStore = create<MeetingStore>((set, get) => ({
  meetings: [],
  filteredMeetings: [],
  loading: false,
  isDeleting: false,
  isEditing: false,
  isExporting: false,
  error: null,
  filters: meetingFilterData,

  // Helper: build owner options from users
  generateOwnerOptions: () => {
    const { users } = useUserStore.getState();
    const userOptions = users.slice(0, 5).map((user) => ({
      id: user.id,
      label: user.name || user.email,
      checked: false,
    }));
    return [
      { id: "all", label: "All Owners", checked: true },
      ...userOptions,
    ];
  },

  // Initialize owner options
  initializeOwnerOptions: () => {
    const ownerOptions = get().generateOwnerOptions();
    set((state) => ({
      filters: {
        ...state.filters,
        owner: ownerOptions,
      },
    }));
  },

  // Filters management
  setFilters: (newFilters: FilterData) => {
    set({ filters: newFilters });
  },

  applyFilters: () => {
    const { meetings, filters } = get();
    let filtered = [...meetings];

    // Status filter
    const activeStatus = filters.status.filter((s: any) => s.checked && s.id !== "all");
    if (activeStatus.length > 0) {
      filtered = filtered.filter((meeting: Meeting) =>
        activeStatus.some((f: any) => {
          if (f.id === "scheduled") return meeting.status === "Scheduled";
          if (f.id === "confirmed") return meeting.status === "Confirmed";
          if (f.id === "cancelled") return meeting.status === "Cancelled";
          return false;
        })
      );
    }

    // Owner filter
    const activeOwners = filters.owner.filter((o: any) => o.checked && o.id !== "all");
    if (activeOwners.length > 0) {
      filtered = filtered.filter((meeting: Meeting) =>
        activeOwners.some((f: any) => {
          if (f.id === "me") {
            // TODO: Replace with actual current user id if available
            return meeting.ownerId === "current-user-id";
          }
          return meeting.ownerId === f.id;
        })
      );
    }

    // Tags filter (meeting.tags is string[])
    const activeTags = filters.tags.filter((t: any) => t.checked && t.id !== "all");
    if (activeTags.length > 0) {
      filtered = filtered.filter((meeting: Meeting) => {
        const tags = (meeting.tags || []).filter((t): t is string => typeof t === 'string').map((t) => t.toLowerCase());
        return activeTags.some((f: any) => tags.includes(f.label.toLowerCase()));
      });
    }

    set({ filteredMeetings: filtered });
  },

  resetFilters: () => {
    const initial = {
      status: [
        { id: "all", label: "All Status", checked: true },
        { id: "scheduled", label: "Scheduled", checked: false },
        { id: "confirmed", label: "Confirmed", checked: false },
        { id: "cancelled", label: "Cancelled", checked: false },
      ],
      owner: get().generateOwnerOptions(),
      tags: [
        { id: "all", label: "All Tags", checked: true },
      ],
    };
    set({ filters: initial, filteredMeetings: get().meetings });
  },

  // 🧠 Fetch meetings from API
  fetchMeetings: async (ownerId?: string) => {
    set({ loading: true });
    try {
      const query = ownerId ? `?ownerId=${ownerId}` : "";
      const res = await fetch(`/api/admin/meetings${query}`);
      if (!res.ok) throw new Error("Failed to fetch meetings");

      const data: any[] = await res.json();
      const convertedData = data.map(convertDates);
      set({ meetings: convertedData, loading: false });
      get().applyFilters();
    } catch (err: any) {
      console.error("fetchMeetings error:", err);
      toast.error("Failed to load meetings");
      set({ error: err.message, loading: false });
    }
  },

  // ➕ Add a new meeting
  addMeeting: async (meeting) => {
    try {
      const res = await fetch(`/api/admin/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meeting),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create meeting");
      }

      const created: any = await res.json();
      const convertedCreated = convertDates(created);
      set({ meetings: [...get().meetings, convertedCreated] });
      get().applyFilters();
      toast.success("Meeting created successfully!");
    } catch (err: any) {
      console.error("addMeeting error:", err);
      toast.error(err.message);
      set({ error: err.message });
    }
  },

  // ✏️ Update a meeting
  updateMeeting: async (id, meeting) => {
    set({ isEditing: true });
    try {
      const res = await fetch(`/api/admin/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meeting),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update meeting");
      }

      const updated: any = await res.json();
      const convertedUpdated = convertDates(updated);
      set({
        meetings: get().meetings.map((m) => (m.id === id ? convertedUpdated : m)),
      });
      get().applyFilters();
      toast.success("Meeting Updated successfully!");

    } catch (err: any) {
      console.error("updateMeeting error:", err);
      toast.error(err.message);
      set({ error: err.message });
    } finally {
      set({ isEditing: false });
    }
  },

  // ❌ Delete a meeting
  deleteMeeting: async (id) => {
    set({ isDeleting: true });
    try {
      const res = await fetch(`/api/admin/meetings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete meeting");

      set({
        meetings: get().meetings.filter((m) => m.id !== id),
      });
      get().applyFilters();
      toast.success("Meeting deleted successfully!");
    } catch (err: any) {
      console.error("deleteMeeting error:", err);
      toast.error(err.message);
      set({ error: err.message });
    } finally {
      set({ isDeleting: false });
    }
  },
}));