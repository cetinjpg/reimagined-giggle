import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Upload, Download, Copy, Search } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

export function BulkPromotionForm() {
  const [userList, setUserList] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBulkPromotion = async () => {
    if (!userList.trim()) {
      toast.error('Lütfen kullanıcı listesi girin!');
      return;
    }

    setLoading(true);
    const users = userList.split('\n').filter(user => user.trim());
    const promotionResults: any[] = [];

    for (const userName of users) {
      const trimmedName = userName.trim();
      if (trimmedName) {
        try {
          const userInfo = await tohAPI.getUserInfo(trimmedName);
          
          if (userInfo.canPromote) {
            promotionResults.push({ 
              userName: trimmedName, 
              success: true,
              message: `${trimmedName} > ${userInfo.nextRank}`,
              currentRank: userInfo.currentRank,
              nextRank: userInfo.nextRank
            });
          } else {
            promotionResults.push({ 
              userName: trimmedName, 
              success: false,
              message: `${trimmedName} - Terfi için gerekli şartlar sağlanmadı`,
              currentRank: userInfo.currentRank
            });
          }
        } catch (error) {
          promotionResults.push({ 
            userName: trimmedName, 
            success: false,
            message: `${trimmedName} - Kullanıcı bulunamadı`
          });
        }
      }
    }

    setResults(promotionResults);

    // Discord'a toplu terfi logu gönder
    const successCount = promotionResults.filter(r => r.success).length;
    const failCount = promotionResults.length - successCount;

    await discordAPI.sendLog({
      title: '👥 Toplu Terfi İşlemi',
      description: `${promotionResults.length} kullanıcı için toplu terfi işlemi yapıldı`,
      color: 0x9932cc,
      fields: [
        { name: 'Başarılı', value: successCount.toString(), inline: true },
        { name: 'Başarısız', value: failCount.toString(), inline: true },
        { name: 'Toplam', value: promotionResults.length.toString(), inline: true }
      ]
    });

    setLoading(false);
    toast.success(`Toplu terfi tamamlandı! ${successCount} başarılı, ${failCount} başarısız`);
  };

  const copyResults = () => {
    const resultText = results
      .filter(r => r.success)
      .map(r => r.message)
      .join('\n');
    
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      toast.success('Başarılı terfiler panoya kopyalandı!');
    }
  };

  const downloadTemplate = () => {
    const template = 'kullanici1\nkullanici2\nkullanici3\n';
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toplu_terfi_sablonu.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <Users className="w-7 h-7 mr-3 text-primary-500" />
          Toplu Terfi Yönetimi
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kullanıcı Listesi
              </label>
              <textarea
                className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2 resize-none"
                placeholder="Her satıra bir kullanıcı adı yazın..."
                value={userList}
                onChange={(e) => setUserList(e.target.value)}
              />
              <Button
                onClick={downloadTemplate}
                variant="ghost"
                size="sm"
                icon={Download}
                className="mt-2"
              >
                Şablon İndir
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-500" />
                Nasıl Çalışır?
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <p>Her kullanıcının bilgileri API'den otomatik çekilir</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <p>Terfi şartları otomatik kontrol edilir</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <p>Uygun olanlar otomatik terfi eder</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Button
          onClick={handleBulkPromotion}
          fullWidth
          size="lg"
          loading={loading}
          disabled={loading}
          icon={Upload}
        >
          Toplu Terfi Uygula
        </Button>

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Toplu Terfi Sonuçları ({results.length})
              </h3>
              <Button
                onClick={copyResults}
                variant="outline"
                size="sm"
                icon={Copy}
              >
                Başarılı Terfiler Kopyala
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.success 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        result.success 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {result.userName}
                      </p>
                      <p className={`text-sm ${
                        result.success 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      result.success 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {result.success ? '✓' : '✗'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}