import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  Shield, 
  Target,
  Calendar,
  Activity,
  Star,
  Trophy,
  Zap,
  Crown
} from 'lucide-react';
import { tohAPI } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';

export function DashboardHome() {
  const { user } = useAppStore();
  const [stats, setStats] = useState({
    totalMembers: 150,
    activeMembers: 120,
    todayPromotions: 8,
    weeklyOperations: 15
  });

  const quickStats = [
    {
      title: 'Toplam Üye',
      value: stats.totalMembers.toString(),
      change: '+12',
      changeType: 'positive' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Aktif Üye',
      value: stats.activeMembers.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Bugünkü Terfiler',
      value: stats.todayPromotions.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Haftalık Toplu Terfi',
      value: stats.weeklyOperations.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: Target,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'promotion',
      user: 'kullanici123',
      action: 'Memur II rütbesine terfi etti',
      time: '5 dakika önce',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      id: '2',
      type: 'join',
      user: 'yeniuye456',
      action: 'TÖH\'e katıldı',
      time: '15 dakika önce',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      id: '3',
      type: 'education',
      user: 'egitmen789',
      action: 'Güvenlik eğitimi verdi',
      time: '1 saat önce',
      icon: Award,
      color: 'text-purple-500'
    },
    {
      id: '4',
      type: 'operation',
      user: 'komutan321',
      action: 'Toplu terfi başlattı',
      time: '2 saat önce',
      icon: Shield,
      color: 'text-red-500'
    }
  ];

  const achievements = [
    {
      title: 'En Aktif Üye',
      winner: 'kullanici123',
      description: 'Bu hafta en çok çalışan üye',
      icon: Star,
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      title: 'En İyi Eğitmen',
      winner: 'egitmen789',
      description: 'Bu ay en çok eğitim veren üye',
      icon: Trophy,
      color: 'from-purple-400 to-purple-500'
    },
    {
      title: 'Toplu Terfi Lideri',
      winner: 'komutan321',
      description: 'En başarılı toplu terfici',
      icon: Crown,
      color: 'from-red-400 to-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="p-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Hoş geldin, {user?.fullName || user?.username || 'Komutan'}! 👋
              </h1>
              <p className="text-primary-100 text-lg">
                TÖH Yönetim Sistemine hoş geldin. Bugün nasıl bir fark yaratacaksın?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                    : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="w-6 h-6 mr-2 text-primary-500" />
                Son Aktiviteler
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Son 24 saat
              </span>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-600`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.action}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-accent-500" />
              Bu Ayın Başarıları
            </h2>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${achievement.color} shadow-lg`}>
                      <achievement.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {achievement.title}
                    </h3>
                  </div>
                  <p className="font-medium text-primary-600 dark:text-primary-400 text-sm mb-1">
                    {achievement.winner}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-accent-500" />
            Hızlı İşlemler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: 'Terfi İşlemi', 
                description: 'Kullanıcı terfi et', 
                icon: TrendingUp, 
                color: 'from-green-500 to-green-600',
                page: 'promotion'
              },
              { 
                title: 'Maaş Rozeti', 
                description: 'Maaş rozeti hesapla', 
                icon: Award, 
                color: 'from-yellow-500 to-yellow-600',
                page: 'salary'
              },
              { 
                title: 'Toplu Terfi', 
                description: 'Çoklu terfi işlemi', 
                icon: Users, 
                color: 'from-purple-500 to-purple-600',
                page: 'bulk-promotion'
              },
              { 
                title: 'Eğitim Planla', 
                description: 'Yeni eğitim oluştur', 
                icon: Calendar, 
                color: 'from-blue-500 to-blue-600',
                page: 'education'
              }
            ].map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                onClick={() => useAppStore.getState().setCurrentPage(action.page)}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl hover:shadow-lg transition-all duration-300 text-left group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-200 dark:border-primary-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Sistem Durumu: Aktif
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tüm sistemler normal çalışıyor • Son güncelleme: 2 dakika önce
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Çevrimiçi
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}