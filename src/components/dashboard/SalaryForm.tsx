import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DollarSign, Search, User, Award, Clock, CheckCircle, Copy } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

const salaryBadges = [
  { name: 'Bronz Maaş Rozeti', requiredHours: 8, color: 'text-amber-600' },
  { name: 'Demir Maaş Rozeti', requiredHours: 16, color: 'text-gray-500' },
  { name: 'Gümüş Maaş Rozeti', requiredHours: 32, color: 'text-gray-400' },
  { name: 'Altın Maaş Rozeti', requiredHours: 64, color: 'text-yellow-400' },
  { name: 'Elmas Maaş Rozeti', requiredHours: 128, color: 'text-blue-400' },
  { name: 'Zümrüt Maaş Rozeti', requiredHours: 256, color: 'text-green-400' }
];

interface SalaryLog {
  id: string;
  username: string;
  badgeName: string;
  timestamp: string;
}

export function SalaryForm() {
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [salaryLogs, setSalaryLogs] = useState<SalaryLog[]>([]);

  const handleUserSearch = async () => {
    if (!userName.trim()) {
      toast.error('Lütfen kullanıcı adı girin!');
      return;
    }

    setLoading(true);
    try {
      const userData = await tohAPI.getUserInfo(userName.trim());
      
      // Maaş rozeti bilgilerini hesapla
      const workHours = userData.workHours || 0;
      console.log('Debug - workTime:', userData.workTime, 'workHours:', workHours); // Debug için
      let currentBadge = null;
      let nextBadge = null;
      let canGetSalary = false;
      let hoursToNext = 0;

      for (let i = 0; i < salaryBadges.length; i++) {
        if (workHours >= salaryBadges[i].requiredHours) {
          currentBadge = salaryBadges[i];
          if (i < salaryBadges.length - 1) {
            nextBadge = salaryBadges[i + 1];
            hoursToNext = nextBadge.requiredHours - workHours;
            canGetSalary = workHours >= nextBadge.requiredHours;
          }
        } else {
          if (!currentBadge) {
            nextBadge = salaryBadges[i];
            hoursToNext = nextBadge.requiredHours - workHours;
            canGetSalary = workHours >= nextBadge.requiredHours;
          }
          break;
        }
      }

      setUserInfo({
        ...userData,
        currentSalaryBadge: currentBadge,
        nextSalaryBadge: nextBadge,
        canGetSalary: canGetSalary,
        hoursToNext: hoursToNext
      });
      
      setShowConfirmation(false);
      toast.success('Kullanıcı bilgileri yüklendi!');
    } catch (error: any) {
      toast.error(error.message);
      setUserInfo(null);
    }
    setLoading(false);
  };

  const handleSalaryConfirm = async () => {
    if (!userInfo || !userInfo.nextSalaryBadge) return;

    setLoading(true);
    try {
      await discordAPI.sendLog({
        title: '💰 Maaş Rozeti Verildi',
        description: `${userInfo.username} yeni maaş rozeti aldı!`,
        color: 0x6b7280,
        fields: [
          { name: 'Maaş Rozeti', value: userInfo.nextSalaryBadge.name, inline: true },
          { name: 'Çalışma Saati', value: `${userInfo.workHours || 0} saat`, inline: true },
          { name: 'Gerekli Saat', value: `${userInfo.nextSalaryBadge.requiredHours} saat`, inline: true }
        ],
        username: userInfo.username
      });

      // Log'a ekle
      const newLog: SalaryLog = {
        id: Date.now().toString(),
        username: userInfo.username,
        badgeName: userInfo.nextSalaryBadge.name,
        timestamp: new Date().toLocaleString('tr-TR')
      };
      setSalaryLogs(prev => [newLog, ...prev]);

      toast.success('Maaş rozeti başarıyla verildi!');
      
      // Kullanıcı bilgilerini güncelle
      setUserInfo(prev => ({
        ...prev,
        currentSalaryBadge: prev.nextSalaryBadge,
        nextSalaryBadge: salaryBadges[salaryBadges.findIndex(b => b.name === prev.nextSalaryBadge.name) + 1] || null,
        canGetSalary: false
      }));
      setShowConfirmation(false);
    } catch (error: any) {
      toast.error('Maaş rozeti verme sırasında hata oluştu!');
    }
    setLoading(false);
  };

  const copySalaryLog = (log: SalaryLog) => {
    const logText = `${log.username}: ${log.badgeName} (${log.timestamp})`;
    navigator.clipboard.writeText(logText);
    toast.success('Log panoya kopyalandı!');
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <DollarSign className="w-7 h-7 mr-3 text-gray-500" />
          Maaş Rozeti Yönetimi
        </h2>

        {/* User Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Kullanıcı Adı"
                placeholder="Maaş rozeti verilecek kullanıcının adını girin"
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
                    Mevcut Maaş Rozeti
                  </p>
                  <p className={`text-lg font-bold ${userInfo.currentSalaryBadge?.color || 'text-gray-400'}`}>
                    {userInfo.currentSalaryBadge?.name || 'Henüz Yok'}
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

              {userInfo.nextSalaryBadge && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-400">
                        Sonraki Maaş Rozeti
                      </p>
                      <p className={`text-lg font-bold ${userInfo.nextSalaryBadge.color}`}>
                        {userInfo.nextSalaryBadge.name}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-400">
                        Durum
                      </p>
                      <p className={`text-lg font-bold ${
                        userInfo.canGetSalary 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {userInfo.canGetSalary ? 'Verilebilir' : `${Math.max(0, userInfo.hoursToNext)} saat eksik`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Salary Badges Info */}
        <Card className="p-6 bg-gray-800/30 border border-gray-700/50 mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Maaş Rozeti Seviyeleri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salaryBadges.map((badge, index) => (
              <div key={badge.name} className="p-3 bg-gray-800/50 rounded-lg">
                <p className={`font-medium ${badge.color}`}>{badge.name}</p>
                <p className="text-sm text-gray-400">{badge.requiredHours} saat gerekli</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        {userInfo && !showConfirmation && userInfo.nextSalaryBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => setShowConfirmation(true)}
              fullWidth
              size="lg"
              disabled={!userInfo.canGetSalary}
              icon={DollarSign}
              className={`${
                userInfo.canGetSalary 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 cursor-not-allowed opacity-60'
              }`}
            >
              {userInfo.canGetSalary ? 'Maaş Rozeti Ver' : `Süre Yetersiz (${Math.max(0, userInfo.hoursToNext)} saat eksik)`}
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
            <h4 className="text-lg font-semibold text-yellow-200 mb-4">Maaş Rozeti Onayı</h4>
            <p className="text-yellow-200 mb-6">
              <strong>{userInfo.username}</strong> kullanıcısına <strong>{userInfo.nextSalaryBadge.name}</strong> 
              vermek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleSalaryConfirm}
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

      {/* Salary Logs */}
      {salaryLogs.length > 0 && (
        <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Maaş Rozeti Logları ({salaryLogs.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {salaryLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">
                      {log.username}: {log.badgeName}
                    </p>
                    <p className="text-sm text-gray-400">{log.timestamp}</p>
                  </div>
                  <Button
                    onClick={() => copySalaryLog(log)}
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