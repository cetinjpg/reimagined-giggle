import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TrendingUp, Copy, Search, User, Clock, Award } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

export function PromotionForm() {
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState(false);

  const handleUserSearch = async () => {
    if (!userName.trim()) {
      toast.error('Lütfen kullanıcı adı girin!');
      return;
    }

    setLoading(true);
    try {
      const userData = await tohAPI.getUserInfo(userName.trim());
      setUserInfo(userData);
      toast.success('Kullanıcı bilgileri yüklendi!');
    } catch (error: any) {
      toast.error(error.message);
      setUserInfo(null);
    }
    setLoading(false);
  };

  const handlePromotion = async () => {
    if (!userInfo) {
      toast.error('Önce kullanıcı bilgilerini yükleyin!');
      return;
    }

    setPromoting(true);
    try {
      // Discord'a terfi logu gönder
      await discordAPI.sendLog({
        title: '🎉 Terfi İşlemi',
        description: `${userInfo.username} terfi etti!`,
        color: 0x00ff00,
        fields: [
          { name: 'Önceki Rütbe', value: userInfo.currentRank || 'Bilinmiyor', inline: true },
          { name: 'Yeni Rütbe', value: userInfo.nextRank || 'Bilinmiyor', inline: true },
          { name: 'Çalışma Süresi', value: `${userInfo.workTime || 0} dakika`, inline: true },
          { name: 'Rozet', value: userInfo.badge || 'Bilinmiyor', inline: true }
        ],
        username: userInfo.username
      });

      toast.success('Terfi işlemi başarıyla tamamlandı!');
      
      // Kullanıcı bilgilerini yenile
      await handleUserSearch();
    } catch (error: any) {
      toast.error('Terfi işlemi sırasında hata oluştu!');
    }
    setPromoting(false);
  };

  const copyPromotionMessage = () => {
    if (userInfo) {
      const message = `${userInfo.username} > ${userInfo.nextRank || 'Yeni Rütbe'}`;
      navigator.clipboard.writeText(message);
      toast.success('Terfi mesajı panoya kopyalandı!');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-primary-500" />
          Terfi Yönetimi
        </h2>

        {/* User Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Kullanıcı Adı"
                placeholder="Terfi edilecek kullanıcının adını girin"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                icon={User}
                fullWidth
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleUserSearch}
                loading={loading}
                disabled={loading}
                icon={Search}
                className="px-8"
              >
                Kullanıcı Ara
              </Button>
            </div>
          </div>
        </div>

        {/* User Information */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Kullanıcı Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kullanıcı Adı</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {userInfo.username || userName}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Mevcut Rütbe
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {userInfo.currentRank || 'Stajyer'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Sonraki Rütbe
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {userInfo.nextRank || 'Memur I'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Çalışma Süresi
                  </p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {userInfo.workTime || 0} dk
                  </p>
                </div>
              </div>

              {userInfo.canPromote !== undefined && (
                <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                  userInfo.canPromote 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <p className={`font-medium ${
                    userInfo.canPromote 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {userInfo.canPromote 
                      ? '✅ Terfi için gerekli şartlar sağlanmış!' 
                      : '❌ Terfi için gerekli şartlar henüz sağlanmamış.'}
                  </p>
                  {userInfo.requiredTime && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Gerekli süre: {userInfo.requiredTime} dakika
                    </p>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Promotion Actions */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <Button
              onClick={handlePromotion}
              loading={promoting}
              disabled={promoting || !userInfo.canPromote}
              icon={TrendingUp}
              size="lg"
              className="flex-1"
            >
              Terfi Et
            </Button>
            
            <Button
              onClick={copyPromotionMessage}
              variant="outline"
              icon={Copy}
              size="lg"
            >
              Mesajı Kopyala
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}