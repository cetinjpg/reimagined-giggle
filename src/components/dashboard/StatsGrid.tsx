import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

const stats = [
  {
    title: 'Günlük Süre',
    value: '0 dakika',
    progress: 30,
    target: '120 dk',
    icon: Clock,
    color: 'from-primary-500 to-primary-600'
  },
  {
    title: 'Çalışma Süresi',
    value: '0 dakika',
    progress: 15,
    target: '300 dk',
    icon: Briefcase,
    color: 'from-accent-500 to-accent-600'
  },
  {
    title: 'Maaş Süresi',
    value: '0 dakika',
    progress: 5,
    target: '480 dk',
    icon: DollarSign,
    color: 'from-secondary-500 to-secondary-600'
  },
  {
    title: 'Terfi Süresi',
    value: '1 saat 13 dk',
    progress: 65,
    target: '2 saat',
    icon: TrendingUp,
    color: 'from-primary-600 to-accent-600'
  }
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card hover className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </h3>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Başlangıç</span>
                <span>Hedef: {stat.target}</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}