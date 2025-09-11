import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DollarSign, Search, User, Award, Clock, Plus } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import { calculateSalaryRating } from '../../utils/promotionCalculator';
import toast from 'react-hot-toast';

export function SalaryForm() {
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [extraHours, setExtraHours] = useState('0');
  const [afkMinutes, setAfkMinutes] = useState('0');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

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

  const handleSalaryCalculation = async () => {
    if (!userInfo) {
      toast.error('Lütfen önce kullanıcı bilgilerini yükleyin!');
      return;
    }

    setCalculating(true);
    try {
      const salaryResult = calculateSalaryRating(
        userInfo.workHours || 0,
        parseInt(extraHours) || 0,
        parseInt(afkMinutes) || 0
      );

      await discordAPI.sendLog({
        title: '💰 Maaş Rozeti Hesaplandı',
        description: `${userInfo.username} için maaş rozeti hesaplandı`,
        color: 0xffa500,
        fields: [
          { name: 'Temel Maaş Rozeti', value: salaryResult.rating.toString(), inline: true },
          { name: 'Ek Maaş Rozeti', value: salaryResult.extraRating.toString(), inline: true },
          { name: 'Toplam Maaş Rozeti', value: salaryResult.totalRating.toString(), inline: true },
          { name: 'Çalışma Saati', value: `${userInfo.workHours || 0} saat`, inline: true },
          { name: 'Ek Çalışma', value: `${extraHours} saat`, inline: true },
          { name: 'AFK Süresi', value: `${afkMinutes} dakika`, inline: true }
        ],
        username: userInfo.username
      });

      toast.success(`Maaş rozeti hesaplandı: ${salaryResult.totalRating} rozet`);
      
      // Form temizle
      setExtraHours('0');
      setAfkMinutes('0');
    } catch (error: any) {
      toast.error('Maaş rozeti hesaplama sırasında hata oluştu!');
    }
    setCalculating(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <DollarSign className="w-7 h-7 mr-3 text-orange-500" />
          Maaş Rozeti Hesaplama
        </h2>

        {/* User Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Kullanıcı Adı"
                placeholder="Maaş rozeti hesaplanacak kullanıcının adını girin"
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
                className="px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
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
            <Card className="p-6 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-500" />
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
                  <p className="text-lg font-bold text-orange-400">
                    {userInfo.currentRank || 'Stajyer'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Çalışma Süresi
                  </p>
                  <p className="text-lg font-bold text-gray-400">
                    {userInfo.workHours || 0} saat
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Mevcut Maaş Rozeti Durumu:</p>
                <p className="text-lg font-bold text-orange-400">
                  {userInfo.totalSalaryRating || 0} rozet
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Calculation Form */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ek Çalışma Saati"
                type="number"
                placeholder="0"
                value={extraHours}
                onChange={(e) => setExtraHours(e.target.value)}
                icon={Plus}
                fullWidth
              />

              <Input
                label="AFK Süresi (Dakika)"
                type="number"
                placeholder="0"
                value={afkMinutes}
                onChange={(e) => setAfkMinutes(e.target.value)}
                icon={Clock}
                fullWidth
              />
            </div>

            <div className="mt-6 p-4 bg-orange-900/30 rounded-lg border border-orange-700/50">
              <h4 className="font-semibold text-orange-200 mb-2">Hesaplama Kuralları:</h4>
              <ul className="text-sm text-orange-200 space-y-1">
                <li>• Her 8 saatte 1 maaş rozeti</li>
                <li>• Her 4 ek saatte 1 ek maaş rozeti</li>
                <li>• Her 30 dakika AFK'da 1 rozet kesinti</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleSalaryCalculation}
              fullWidth
              size="lg"
              loading={calculating}
              disabled={calculating}
              icon={DollarSign}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Maaş Rozeti Hesapla
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}