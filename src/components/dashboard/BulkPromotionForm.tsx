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
          workTime: parseInt(parts[1]) || 0,
          badge: parts[2] || 'memurlar',
          rank: parts[3] || 'Stajyer'
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
        const result = calculatePromotion({
          userName: user.username,
          workTime: user.workTime,
          badge: user.badge,
          rank: user.rank
        });

        promotionResults.push({
          username: user.username,
          success: result.success,
          message: result.message,
          newRank: result.nextRank,
          badge: result.badge
        });

        if (result.success) {
          await discordAPI.sendLog({
            title: '🎉 Toplu Terfi',
            description: result.message,
            color: 0x00ff00,
            fields: [
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
          message: 'İşlem sırasında hata oluştu'
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
      .map(r => `${r.username}: ${r.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(resultText);
    toast.success('Sonuçlar panoya kopyalandı!');
  };

  const downloadTemplate = () => {
    const template = `kullanici1,120,memurlar,Stajyer
kullanici2,180,guvenlik,Güvenlik Memuru I
kullanici3,300,egitmen,Eğitmen I`;
    
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
          <Users className="w-7 h-7 mr-3 text-red-500" />
          Toplu Terfi İşlemleri
        </h2>

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/50 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Nasıl Çalışır?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <p className="text-gray-300">Her satıra bir kullanıcı bilgisi yazın</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <p className="text-gray-300">Format: kullanici_adi,calisma_suresi,rozet,rutbe</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <p className="text-gray-300">Örnek: ahmet,120,memurlar,Stajyer</p>
            </div>
          </div>
          
          <Button
            onClick={downloadTemplate}
            variant="outline"
            size="sm"
            icon={Download}
            className="mt-4 border-red-500/30 text-red-300 hover:bg-red-500/20"
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
            className="w-full h-48 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-red-500/20 focus:outline-none focus:ring-2 resize-none font-mono text-sm"
            placeholder={`kullanici1,120,memurlar,Stajyer
kullanici2,180,guvenlik,Güvenlik Memuru I
kullanici3,300,egitmen,Eğitmen I`}
            value={userList}
            onChange={(e) => setUserList(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            Format: kullanici_adi,calisma_suresi_dakika,rozet,mevcut_rutbe
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
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
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
              className="border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              Sonuçları Kopyala
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
                        {result.message}
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