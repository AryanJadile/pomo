import { create } from 'zustand';

export const useAppStore = create((set) => ({
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
