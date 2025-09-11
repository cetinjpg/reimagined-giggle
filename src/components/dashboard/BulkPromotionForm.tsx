import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Upload, Download, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { calculatePromotion } from '../../utils/promotionCalculator';
import { discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface BulkPromotionResult {
  username: string;
  success: boolean;
  message: string;
  oldRank: string;
  newRank?: string;
  badge?: string;
}

export function BulkPromotionForm() {
  const [userList, setUserList] = useState('');
  const [results, setResults] = useState<BulkPromotionResult[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleBulkPromotion = async () => {
    if (!userList.trim()) {
      toast.error('Lütfen kullanıcı listesi girin!');
      return;
    }

    const users = userList
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        const parts = line.split(',').map(p => p.trim());
        return {
          username: parts[0],
          currentRank: parts[1] || 'Stajyer',
          badge: parts[2] || 'memurlar'
        };
      });

    if (users.length === 0) {
      toast.error('Geçerli kullanıcı bulunamadı!');
      return;
    }

    setProcessing(true);
    const promotionResults: BulkPromotionResult[] = [];

    for (const user of users) {
      try {
        // Otomatik terfi (süre kontrolü olmadan)
        const result = calculatePromotion({
          userName: user.username,
          workTime: 9999, // Yeterli süre ver
          badge: user.badge,
          rank: user.currentRank
        });

        promotionResults.push({
          username: user.username,
          success: result.success,
          message: result.message,
          oldRank: user.currentRank,
          newRank: result.nextRank,
          badge: result.badge
        });

        if (result.success) {
          await discordAPI.sendLog({
            title: '🎉 Toplu Terfi',
            description: `${user.username} otomatik terfi aldı`,
            color: 0x6b7280,
            fields: [
              { name: 'Eski Rütbe', value: user.currentRank, inline: true },
              { name: 'Yeni Rütbe', value: result.nextRank || 'Belirtilmemiş', inline: true },
              { name: 'Rozet', value: result.badge || user.badge, inline: true }
            ],
            username: user.username
          });
        }

        // Her işlem arasında kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        promotionResults.push({
          username: user.username,
          success: false,
          message: 'İşlem sırasında hata oluştu',
          oldRank: user.currentRank
        });
      }
    }

    setResults(promotionResults);
    setProcessing(false);

    const successCount = promotionResults.filter(r => r.success).length;
    toast.success(`${successCount}/${promotionResults.length} kullanıcı başarıyla terfi edildi!`);
  };

  const copyResults = () => {
    const resultText = results
      .filter(r => r.success)
      .map(r => `${r.username}: ${r.oldRank} → ${r.newRank}`)
      .join('\n');
    
    navigator.clipboard.writeText(resultText);
    toast.success('Başarılı terfiler panoya kopyalandı!');
  };

  const downloadTemplate = () => {
    const template = `kullanici1,Stajyer,memurlar
kullanici2,Memur I,memurlar
kullanici3,Güvenlik Memuru I,guvenlik`;
    
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toplu-terfi-sablonu.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Şablon indirildi!');
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <Users className="w-7 h-7 mr-3 text-gray-500" />
          Toplu Terfi İşlemleri
        </h2>

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-r from-gray-900/20 to-gray-800/20 border border-gray-700/50 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Nasıl Çalışır?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <p className="text-gray-300">Her satıra bir kullanıcı bilgisi yazın</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <p className="text-gray-300">Format: kullanici_adi,mevcut_rutbe,rozet</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <p className="text-gray-300">Sistem otomatik olarak bir sonraki rütbeye terfi eder</p>
            </div>
          </div>
          
          <Button
            onClick={downloadTemplate}
            variant="outline"
            size="sm"
            icon={Download}
            className="mt-4 border-gray-500/30 text-gray-300 hover:bg-gray-500/20"
          >
            Şablon İndir
          </Button>
        </Card>

        {/* User List Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kullanıcı Listesi
          </label>
          <textarea
            className="w-full h-48 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-gray-500 focus:ring-gray-500/20 focus:outline-none focus:ring-2 resize-none font-mono text-sm"
            placeholder={`kullanici1,Stajyer,memurlar
kullanici2,Memur I,memurlar
kullanici3,Güvenlik Memuru I,guvenlik`}
            value={userList}
            onChange={(e) => setUserList(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            Format: kullanici_adi,mevcut_rutbe,rozet
          </p>
        </div>

        {/* Process Button */}
        <Button
          onClick={handleBulkPromotion}
          fullWidth
          size="lg"
          loading={processing}
          disabled={processing || !userList.trim()}
          icon={Upload}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
        >
          {processing ? 'İşleniyor...' : 'Toplu Terfi İşlemini Başlat'}
        </Button>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              İşlem Sonuçları ({results.length})
            </h3>
            <Button
              onClick={copyResults}
              variant="outline"
              size="sm"
              icon={Copy}
              className="border-gray-500/30 text-gray-300 hover:bg-gray-500/20"
            >
              Başarılı Sonuçları Kopyala
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-900/20 border-green-700/50' 
                    : 'bg-red-900/20 border-red-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">{result.username}</p>
                      <p className={`text-sm ${
                        result.success ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {result.success ? `${result.oldRank} → ${result.newRank}` : result.message}
                      </p>
                    </div>
                  </div>
                  
                  {result.success && result.newRank && (
                    <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-medium">
                      {result.newRank}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {results.filter(r => r.success).length}
                </p>
                <p className="text-sm text-gray-400">Başarılı</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">
                  {results.filter(r => !r.success).length}
                </p>
                <p className="text-sm text-gray-400">Başarısız</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}