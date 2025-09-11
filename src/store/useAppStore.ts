import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Theme } from '../types';

interface AppStore extends AppState {
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setCurrentPage: (page: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      theme: 'dark',
      isAuthenticated: false,
      currentPage: 'welcome',
      sidebarCollapsed: false,

      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        currentPage: 'welcome' 
      }),
    }),
    {
      name: 'toh-app-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed 
      }),
    }
  )
);