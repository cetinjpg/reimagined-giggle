import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp,
  Award,
  Clock,
  Shield,
  Star,
  Activity,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatsGrid } from './StatsGrid';
import { useAppStore } from '../../store/useAppStore';

export function DashboardHome() {
  const { user } = useAppStore();

  const quickActions = [
    {
      title: 'Terfi Ver',
      description: 'Kullanıcıya terfi ver',
      icon: TrendingUp,
      color: 'from-red-500 to-red-600',
      action: () => console.log('Terfi ver')
    },
    {
      title: 'Maaş Rozeti',
      description: 'Maaş rozeti hesapla',
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      action: () => console.log('Maaş rozeti')
    },
    {
      title: 'Lisans Ver',
      description: 'Kullanıcıya lisans ver',
      icon: Shield,
      color: 'from-gray-600 to-gray-700',
      action: () => console.log('Lisans ver')
    },
    {
      title: 'Eğitim Planla',
      description: 'Yeni eğitim planla',
      icon: Target,
      color: 'from-red-600 to-orange-500',
      action: () => console.log('Eğitim planla')
    }
  ];

  const recentActivities = [
    {
      user: 'John Doe',
      action: 'Terfi aldı',
      details: 'Uzman → Uzman Çavuş',
      time: '5 dakika önce',
      type: 'promotion'
    },
    {
      user: 'Jane Smith',
      action: 'Maaş rozeti aldı',
      details: '40 saat çalışma',
      time: '15 dakika önce',
      type: 'salary'
    },
    {
      user: 'Mike Johnson',
      action: 'Lisans aldı',
      details: 'Sniper Lisansı',
      time: '1 saat önce',
      type: 'license'
    }
  ];

  const achievements = [
    {
      title: 'En Aktif Ay',
      description: 'Bu ay 150+ terfi verildi',
      icon: Trophy,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Yüksek Performans',
      description: 'Sistem %99.9 uptime',
      icon: Zap,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Büyük Topluluk',
      description: '300+ aktif üye',
      icon: Users,
      color: 'from-gray-600 to-gray-700'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="p-8 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-700/50">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Hoş geldin, {user?.name || 'Komutan'}! 👋
            </h1>
            <p className="text-gray-300">
              TÖH Yönetim Paneline hoş geldin. Bugün ne yapmak istiyorsun?
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-red-500" />
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={action.action}>
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-red-500" />
            Son Aktiviteler
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'promotion' ? 'bg-red-500/20' :
                  activity.type === 'salary' ? 'bg-orange-500/20' : 'bg-gray-500/20'
                }`}>
                  {activity.type === 'promotion' ? (
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  ) : activity.type === 'salary' ? (
                    <Award className="w-4 h-4 text-orange-400" />
                  ) : (
                    <Shield className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">
                    {activity.user} {activity.action}
                  </p>
                  <p className="text-sm text-gray-400">{activity.details}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-orange-500" />
            Başarılar
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-green-500" />
          Sistem Durumu
          <span className="ml-2 text-sm text-green-400">Çevrimiçi</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-white">Discord Bot</p>
            <p className="text-xs text-gray-400">Aktif</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-white">Habbo API</p>
            <p className="text-xs text-gray-400">Bağlı</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-white">Veritabanı</p>
            <p className="text-xs text-gray-400">Çalışıyor</p>
          </div>
        </div>
      </Card>
    </div>
  );
}