import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TrendingUp, Search, User, Award, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import { calculatePromotion } from '../../utils/promotionCalculator';
import toast from 'react-hot-toast';

interface PromotionLog {
  id: string;
  username: string;
  oldRank: string;
  newRank: string;
  timestamp: string;
}

export function PromotionForm() {
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [promotionLogs, setPromotionLogs] = useState<PromotionLog[]>([]);

  const handleUserSearch = async () => {
    if (!userName.trim()) {
      toast.error('Lütfen kullanıcı adı girin!');
      return;
    }

    setLoading(true);
    try {
      const userData = await tohAPI.getUserInfo(userName.trim());
      setUserInfo(userData);
      setShowConfirmation(false);
      toast.success('Kullanıcı bilgileri yüklendi!');
    } catch (error: any) {
      toast.error(error.message);
      setUserInfo(null);
    }
    setLoading(false);
  };

  const handlePromotionConfirm = async () => {
    if (!userInfo) return;

    setLoading(true);
    try {
      const promotionResult = calculatePromotion({
        userName: userInfo.username,
        workTime: userInfo.workTime,
        badge: userInfo.badge,
        rank: userInfo.currentRank
      });

      if (promotionResult.success) {
        // Discord'a log gönder
        await discordAPI.sendLog({
          title: '🎉 Terfi İşlemi',
          description: `${userInfo.username} terfi aldı!`,
          color: 0x6b7280,
          fields: [
            { name: 'Eski Rütbe', value: userInfo.currentRank, inline: true },
            { name: 'Yeni Rütbe', value: promotionResult.nextRank || 'Belirtilmemiş', inline: true },
            { name: 'Rozet', value: promotionResult.badge || userInfo.badge, inline: true }
          ],
          username: userInfo.username
        });

        // Log'a ekle
        const newLog: PromotionLog = {
          id: Date.now().toString(),
          username: userInfo.username,
          oldRank: userInfo.currentRank,
          newRank: promotionResult.nextRank || userInfo.currentRank,
          timestamp: new Date().toLocaleString('tr-TR')
        };
        setPromotionLogs(prev => [newLog, ...prev]);

        toast.success('Terfi başarıyla verildi!');
        
        // Kullanıcı bilgilerini güncelle
        setUserInfo(prev => ({
          ...prev,
          currentRank: promotionResult.nextRank,
          badge: promotionResult.badge || prev.badge
        }));
        setShowConfirmation(false);
      } else {
        toast.error(promotionResult.message);
      }
    } catch (error: any) {
      toast.error('Terfi işlemi sırasında hata oluştu!');
    }
    setLoading(false);
  };

  const copyPromotionLog = (log: PromotionLog) => {
    const logText = `${log.username}: ${log.oldRank} → ${log.newRank} (${log.timestamp})`;
    navigator.clipboard.writeText(logText);
    toast.success('Log panoya kopyalandı!');
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-gray-500" />
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
                className="px-8 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
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
            <Card className="p-6 bg-gradient-to-r from-gray-900/20 to-gray-800/20 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
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
                  <p className="text-lg font-bold text-gray-400">
                    {userInfo.currentRank || 'Stajyer'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Sonraki Rütbe
                  </p>
                  <p className="text-lg font-bold text-gray-300">
                    {userInfo.nextRank || 'Hesaplanıyor...'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">
                      Çalışma Süresi
                    </p>
                    <p className="text-lg font-bold text-gray-400">
                      {userInfo.workHours || 0} saat ({userInfo.workTime || 0} dk)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">
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
        {userInfo && !showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => setShowConfirmation(true)}
              fullWidth
              size="lg"
              disabled={!userInfo.canPromote}
              icon={TrendingUp}
              className={`${
                userInfo.canPromote 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
              }`}
            >
              {userInfo.canPromote ? 'Terfi Ver' : 'Terfi Verilemez'}
            </Button>
          </motion.div>
        )}

        {/* Confirmation */}
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-yellow-900/20 rounded-lg border border-yellow-700/50"
          >
            <h4 className="text-lg font-semibold text-yellow-200 mb-4">Terfi Onayı</h4>
            <p className="text-yellow-200 mb-6">
              <strong>{userInfo.username}</strong> kullanıcısını <strong>{userInfo.currentRank}</strong> rütbesinden 
              <strong> {userInfo.nextRank}</strong> rütbesine terfi ettirmek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handlePromotionConfirm}
                loading={loading}
                disabled={loading}
                icon={CheckCircle}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                Onayla
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                İptal
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Promotion Logs */}
      {promotionLogs.length > 0 && (
        <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Terfi Logları ({promotionLogs.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {promotionLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">
                      {log.username}: {log.oldRank} → {log.newRank}
                    </p>
                    <p className="text-sm text-gray-400">{log.timestamp}</p>
                  </div>
                  <Button
                    onClick={() => copyPromotionLog(log)}
                    variant="outline"
                    size="sm"
                    icon={Copy}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Kopyala
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}