import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    setInitialized: (value) => set({ isInitialized: value }),

    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isInitialized: true
    }),

    logout: () => set({ user: null, isAuthenticated: false, isInitialized: true }),
}));