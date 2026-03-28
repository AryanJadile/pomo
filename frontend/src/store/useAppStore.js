import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export const useAppStore = create((set) => ({
  // Auth state
  user: null,
  session: null,
  profile: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  initializeAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => set({ profile: data }))
          .catch(console.error);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => set({ profile: data }))
          .catch(console.error);
      } else {
        set({ profile: null });
      }
    });
  },

  // Theme state
  theme: localStorage.getItem('pomeguard-theme') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('pomeguard-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  initTheme: () => set((state) => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return {};
  }),

  // Analysis state
  currentAnalysis: {
    diseaseData: null,
    envData: null,
    nutritionData: null,
  },
  
  setDiseaseData: (data) => set((state) => ({ currentAnalysis: { ...state.currentAnalysis, diseaseData: data } })),
  setEnvData: (data) => set((state) => ({ currentAnalysis: { ...state.currentAnalysis, envData: data } })),
  setNutritionData: (data) => set((state) => ({ currentAnalysis: { ...state.currentAnalysis, nutritionData: data } })),
  resetAnalysis: () => set({ currentAnalysis: { diseaseData: null, envData: null, nutritionData: null } }),

  // History state
  history: [],
  setHistory: (history) => set({ history }),

  // Notification state
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  unreadNotificationsCount: () => set((state) => {
    // This is a derived state helper, usually we'd just use a selector but keeping simple here
  })
}));
