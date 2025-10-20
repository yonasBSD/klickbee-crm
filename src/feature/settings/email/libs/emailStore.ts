import { create } from 'zustand';

interface EmailSettings {
  host: string;
  port: string;
  sender: string;
  username: string;
  password: string;
}

interface EmailStore {
  settings: EmailSettings;
  isLoading: boolean;
  error: string | null;
  setSettings: (settings: Partial<EmailSettings>) => void;
  saveSettings: () => Promise<void>;
  sendInvite: (to: string) => Promise<void>;
  resetError: () => void;
}

const initialSettings: EmailSettings = {
  host: '',
  port: '',
  sender: '',
  username: '',
  password: '',
};

export const useEmailStore = create<EmailStore>((set, get) => ({
  settings: initialSettings,
  isLoading: false,
  error: null,
  setSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  saveSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(get().settings),
      });
      if (!response.ok) {
        throw new Error('Failed to save email settings');
      }
      // Optionally handle response data here
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },
  sendInvite: async (to: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...get().settings, recipient: to }),
      });
      if (!response.ok) {
        throw new Error('Failed to send test email');
      }
      // Optionally handle response data here
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },
  resetError: () => set({ error: null }),
}));
