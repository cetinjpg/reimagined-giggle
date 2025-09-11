import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { authAPI } from '../../services/api';

export function Header() {
  const { user, logout, sidebarCollapsed } = useAppStore();

  const handleLogout = () => {
    authAPI.logout();
    logout();
  };

  return (
    <motion.header
      className={`
        fixed top-0 right-0 h-20 bg-white dark:bg-gray-800 shadow-lg z-30
        transition-all duration-300 border-b border-gray-200 dark:border-gray-700
        ${sidebarCollapsed ? 'left-16' : 'left-64'}
      `}
      animate={{ left: sidebarCollapsed ? 64 : 256 }}
    >
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user?.fullName || user?.username || 'Kullanıcı'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.rank || 'Stajyer'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          icon={LogOut}
        >
          Çıkış Yap
        </Button>
      </div>
    </motion.header>
  );
}