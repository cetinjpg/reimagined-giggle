import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DollarSign, Copy, Search, User, Clock, Award } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

export function SalaryForm() {
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
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
      toast.error('Önce kullanıcı bilgilerini yükleyin!');
      return;
    }

    setCalculating(true);
    try {
      // Discord'a maaş rozeti logu gönder
      await discordAPI.sendLog({
        title: '💰 Maaş Rozeti Hesaplandı',
        description: `${userInfo.username} için maaş rozeti hesaplandı`,
        color: 0xffd700,
        fields: [
          { name: 'Çalışma Saati', value: `${userInfo.workHours || 0} saat`, inline: true },
          { name: 'Maaş Rozeti', value: userInfo.salaryRating?.toString() || '0', inline: true },
          { name: 'Toplam Rozet', value: userInfo.totalSalaryRating?.toString() || '0', inline: true }
        ],
        username: userInfo.username
      });

      toast.success('Maaş rozeti hesaplandı!');
    } catch (error: any) {
      toast.error('Maaş rozeti hesaplama sırasında hata oluştu!');
    }
    setCalculating(false);
  };

  const copyResult = () => {
    if (userInfo) {
      const resultText = `${userInfo.username} > Maaş Rozeti: ${userInfo.salaryRating || 0}, Toplam: ${userInfo.totalSalaryRating || 0}`;
      navigator.clipboard.writeText(resultText);
      toast.success('Sonuç panoya kopyalandı!');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <DollarSign className="w-7 h-7 mr-3 text-accent-500" />
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
            <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-yellow-500" />
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
                    <Clock className="w-4 h-4 mr-1" />
                    Çalışma Saati
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {userInfo.workHours || 0} saat
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Maaş Rozeti
                  </p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {userInfo.salaryRating || 0}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Toplam Rozet
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {userInfo.totalSalaryRating || 0}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  💡 Maaş rozeti otomatik olarak hesaplanmıştır
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <Button
              onClick={handleSalaryCalculation}
              loading={calculating}
              disabled={calculating}
              icon={DollarSign}
              size="lg"
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Maaş Rozeti Kaydet
            </Button>
            
            <Button
              onClick={copyResult}
              variant="outline"
              icon={Copy}
              size="lg"
            >
              Sonucu Kopyala
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}