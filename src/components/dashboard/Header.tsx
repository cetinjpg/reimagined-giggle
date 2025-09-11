import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { authAPI } from '../../services/api';

export function Header() {
  const { user, theme, setTheme, logout } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    logout();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">
            TÖH Yönetim Paneli
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
              <p className="text-xs text-gray-400">{user?.rank || 'Stajyer'}</p>
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}