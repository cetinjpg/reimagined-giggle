import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Trophy, 
  Star, 
  ChevronRight, 
  Play,
  Award,
  Target,
  Zap,
  Crown,
  Sword,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AuthForm } from './AuthForm';
import { useAppStore } from '../../store/useAppStore';
import { teamMembers } from '../../data/teamData';

export function WelcomeScreen() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const { setUser, setAuthenticated } = useAppStore();

  const handleAuthSuccess = (user: any) => {
    setUser(user);
    setAuthenticated(true);
    setShowAuthModal(false);
  };

  const toggleAuthType = () => {
    setAuthType(authType === 'login' ? 'register' : 'login');
  };

  const openAuth = (type: 'login' | 'register') => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: Shield,
      title: 'Güvenli Sistem',
      description: 'Discord entegrasyonu ile güvenli ve hızlı işlemler',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Trophy,
      title: 'Terfi Sistemi',
      description: 'Otomatik terfi hesaplama ve takip sistemi',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Takım Yönetimi',
      description: 'Personel ve eğitim yönetimi araçları',
      color: 'from-gray-600 to-gray-700'
    },
    {
      icon: Target,
      title: 'Operasyon Takibi',
      description: 'Görevler ve operasyonların detaylı takibi',
      color: 'from-red-600 to-orange-500'
    }
  ];

  const stats = [
    { label: 'Aktif Üye', value: '150+', icon: Users },
    { label: 'Başarılı Operasyon', value: '500+', icon: Target },
    { label: 'Yıllık Deneyim', value: '8+', icon: Award },
    { label: 'Discord Üyesi', value: '300+', icon: Zap }
  ];

  const founders = teamMembers.filter(member => member.category === 'kurucular');
  const leadership = teamMembers.filter(member => 
    ['discord', 'koordinator'].includes(member.category)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  TÖH
                </h1>
                <p className="text-xs text-gray-400">Türkiye Özel Harekat</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                onClick={() => openAuth('login')}
                variant="ghost"
                icon={LogIn}
                className="text-white hover:bg-red-500/20 border border-red-500/30"
              >
                Giriş Yap
              </Button>
              <Button
                onClick={() => openAuth('register')}
                icon={UserPlus}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25"
              >
                TÖH'e Katıl
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm font-medium mb-4">
                  <Crown className="w-4 h-4 mr-2" />
                  Habbo'nun En Prestijli Şirketi
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  TÖH
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Türkiye Özel Harekat
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                8 yıllık deneyimimiz ile Habbo Türkiye'nin en köklü ve prestijli şirketi. 
                Profesyonel ekibimiz, modern yönetim sistemimiz ve güçlü Discord entegrasyonumuz ile 
                Habbo dünyasında fark yaratıyoruz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => openAuth('register')}
                  size="lg"
                  icon={UserPlus}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-2xl shadow-red-500/25"
                >
                  Hemen Başvur
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={Play}
                  className="border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50"
                >
                  Tanıtım Videosu
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images-ext-1.discordapp.net/external/Vpv0uKge2p8fVt_uttgg