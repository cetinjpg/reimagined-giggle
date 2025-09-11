import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard, 
  GraduationCap,
  UserPlus,
  UserMinus,
  Archive,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const menuItems = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'promotion', label: 'Terfi İşlemleri', icon: TrendingUp },
  { id: 'salary', label: 'Maaş Rozeti', icon: DollarSign },
  { id: 'bulk-promotion', label: 'Toplu Terfi', icon: Users },
  { id: 'license', label: 'Lisans Yönetimi', icon: CreditCard },
  { id: 'education', label: 'Eğitim Yönetimi', icon: GraduationCap },
  { id: 'transfer-in', label: 'Transfer Gelen', icon: UserPlus },
  { id: 'transfer-out', label: 'Transfer Giden', icon: UserMinus },
  { id: 'archive', label: 'Arşiv Görüntüle', icon: Archive }
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                TÖH
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Yönetim Sistemi</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className={`w-5 h-5 ${
              currentPage === item.id ? 'text-red-400' : 'text-gray-400 group-hover:text-white'
            }`} />
            {!sidebarCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}