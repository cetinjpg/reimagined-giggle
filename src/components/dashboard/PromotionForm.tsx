import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TrendingUp, Search, User, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import { calculatePromotion } from '../../utils/promotionCalculator';
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
      toast.error('Lütfen önce kullanıcı bilgilerini yükleyin!');
      return;
    }

    setPromoting(true);
    try {
      const promotionResult = calculatePromotion({
        userName: userInfo.username,
        workTime: userInfo.workTime,
        badge: userInfo.badge,
        rank: userInfo.currentRank
      });

      if (promotionResult.success) {
        await discordAPI.sendLog({
          title: '🎉 Terfi İşlemi',
          description: promotionResult.message,
          color: 0x00ff00,
          fields: [
            { name: 'Yeni Rütbe', value: promotionResult.nextRank || 'Belirtilmemiş', inline: true },
            { name: 'Rozet', value: promotionResult.badge || userInfo.badge, inline: true }
          ],
          username: userInfo.username
        });

        toast.success(promotionResult.message);
        
        // Kullanıcı bilgilerini güncelle
        setUserInfo(prev => ({
          ...prev,
          currentRank: promotionResult.nextRank,
          badge: promotionResult.badge || prev.badge
        }));
      } else {
        toast.error(promotionResult.message);
      }
    } catch (error: any) {
      toast.error('Terfi işlemi sırasında hata oluştu!');
    }
    setPromoting(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-red-500" />
          Terfi İşlemleri
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
                className="px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
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
            <Card className="p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-red-500" />
                Kullanıcı Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400">Kullanıcı Adı</p>
                  <p className="text-lg font-bold text-white">
                    {userInfo.username || userName}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Mevcut Rütbe
                  </p>
                  <p className="text-lg font-bold text-red-400">
                    {userInfo.currentRank || 'Stajyer'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Sonraki Rütbe
                  </p>
                  <p className="text-lg font-bold text-orange-400">
                    {userInfo.nextRank || 'Hesaplanıyor...'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400 flex items-center">
                      Çalışma Süresi
                    </p>
                    <p className="text-lg font-bold text-gray-400">
                      {userInfo.workHours || 0} saat ({userInfo.workTime || 0} dk)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400 flex items-center">
                      Terfi Durumu
                    </p>
                    <p className={`text-lg font-bold ${
                      userInfo.canPromote 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {userInfo.canPromote ? 'Terfi Edilebilir' : 'Süre Yetersiz'}
                    </p>
                  </div>
                </div>
              </div>

              {!userInfo.canPromote && (
                <div className="mt-4 p-4 bg-red-900/30 rounded-lg border border-red-700/50">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-200">
                      Gerekli süre: {userInfo.requiredTime || 0} dk - 
                      Eksik süre: {(userInfo.requiredTime || 0) - (userInfo.workTime || 0)} dk
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handlePromotion}
              fullWidth
              size="lg"
              loading={promoting}
              disabled={promoting || !userInfo.canPromote}
              icon={userInfo.canPromote ? CheckCircle : AlertCircle}
              className={`${
                userInfo.canPromote 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
              }`}
            >
              {userInfo.canPromote ? 'Terfi Et' : 'Terfi Edilemez'}
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}