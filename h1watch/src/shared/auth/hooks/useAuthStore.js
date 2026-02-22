import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    setInitialized: (isInitialized) => set({ isInitialized }),

    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isInitialized: true
    }),

    logout: () => set({
        user: null,
        isAuthenticated: false,
        isInitialized: true
    })
}));