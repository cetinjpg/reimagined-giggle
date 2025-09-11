import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CreditCard, Plus, Search, User, Calendar, Award } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

export function LicenseForm() {
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [licenseType, setLicenseType] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const licenseTypes = [
    'Lisans 1',
    'Lisans 2',
    'Lisans 3'
  ];

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

  const handleIssueLicense = async () => {
    if (!userInfo || !licenseType) {
      toast.error('Lütfen kullanıcı bilgilerini yükleyin ve lisans türü seçin!');
      return;
    }

    setIssuing(true);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(duration));

      await discordAPI.sendLog({
        title: '📜 Lisans Verildi',
        description: `${userInfo.username} kullanıcısına yeni lisans verildi`,
        color: 0x00ff00,
        fields: [
          { name: 'Lisans Türü', value: licenseType, inline: true },
          { name: 'Geçerlilik Süresi', value: `${duration} gün`, inline: true },
          { name: 'Son Geçerlilik', value: expiryDate.toLocaleDateString('tr-TR'), inline: true }
        ],
        username: userInfo.username
      });

      toast.success('Lisans başarıyla verildi!');
      
      // Form temizle
      setLicenseType('');
      setDuration('30');
    } catch (error: any) {
      toast.error('Lisans verme sırasında hata oluştu!');
    }
    setIssuing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <CreditCard className="w-7 h-7 mr-3 text-primary-500" />
          Lisans Yönetimi
        </h2>

        {/* User Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Kullanıcı Adı"
                placeholder="Lisans verilecek kullanıcının adını girin"
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-500" />
                Kullanıcı Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-lg font-bold text-red-400">
                    {userInfo.currentRank || 'Stajyer'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Mevcut Lisanslar
                  </p>
                  <p className="text-lg font-bold text-orange-400">
                    {userInfo.licenses?.length || 0}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* License Form */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lisans Türü
                </label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-red-500/20 focus:outline-none focus:ring-2"
                >
                  <option value="">Lisans türü seçin</option>
                  {licenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Geçerlilik Süresi (Gün)"
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                icon={Calendar}
                fullWidth
              />
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
              onClick={handleIssueLicense}
              fullWidth
              size="lg"
              loading={issuing}
              disabled={issuing || !licenseType}
              icon={Plus}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
            >
              Lisans Ver
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}