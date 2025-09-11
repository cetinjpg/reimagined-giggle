import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard, 
  GraduationCap,
  UserPlus,
  UserMinus,
  Archive,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const menuItems = [
  { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: 'promotion', label: 'Terfi', icon: TrendingUp },
  { id: 'salary', label: 'Maaş Rozeti', icon: DollarSign },
  { id: 'bulk-promotion', label: 'Toplu Terfi', icon: Users },
  { id: 'license', label: 'Lisans', icon: CreditCard },
  { id: 'education', label: 'Eğitim', icon: GraduationCap },
  { id: 'transfer-in', label: 'Transfer Gelen', icon: UserPlus },
  { id: 'transfer-out', label: 'Şirketten Giden', icon: UserMinus },
  { id: 'archive', label: 'Arşiv', icon: Archive },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, currentPage, setCurrentPage } = useAppStore();

  return (
    <motion.div
      className={`
        fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-40
        transition-all duration-300 ease-in-out border-r border-gray-700/50
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-gray-700/50 bg-gradient-to-r from-primary-600/20 to-accent-600/20">
        <motion.div
          className="flex items-center space-x-3"
          animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
        >
          {!sidebarCollapsed && (
            <>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  TÖH Yönetim
                </h2>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </>
          )}
        </motion.div>
        
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`
                w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                ${currentPage === item.id 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
              whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`p-1 rounded-lg ${
                currentPage === item.id 
                  ? 'bg-white/20' 
                  : 'group-hover:bg-gray-600/50'
              }`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
              </div>
              
              <motion.span
                className="ml-3 text-sm font-medium"
                animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
              >
                {!sidebarCollapsed && item.label}
              </motion.span>

              {currentPage === item.id && !sidebarCollapsed && (
                <motion.div
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-4 bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-xl border border-primary-500/20">
            <p className="text-xs text-gray-400 text-center">
              TÖH Management v2.0
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Powered by TÖH Dev Team
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}