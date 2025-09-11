import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Archive, Search, Calendar, Award, TrendingUp, Copy } from 'lucide-react';
import { tohAPI } from '../../services/api';
import toast from 'react-hot-toast';

export function ArchiveView() {
  const [archiveType, setArchiveType] = useState<'mr' | 'badge'>('mr');
  const [selectedDate, setSelectedDate] = useState('');
  const [archiveData, setArchiveData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchArchive = async () => {
    setLoading(true);
    try {
      const data = await tohAPI.getArchive(archiveType, selectedDate);
      setArchiveData(data);
      toast.success('Arşiv verileri yüklendi!');
    } catch (error: any) {
      toast.error(error.message);
      setArchiveData([]);
    }
    setLoading(false);
  };

  const copyArchiveData = () => {
    if (archiveData.length > 0) {
      const archiveText = archiveData
        .map(item => `${item.username} - ${item.details}`)
        .join('\n');
      
      navigator.clipboard.writeText(archiveText);
      toast.success('Arşiv verileri panoya kopyalandı!');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <Archive className="w-7 h-7 mr-3 text-primary-500" />
          Arşiv Görüntüleme
        </h2>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Arşiv Türü
            </label>
            <select
              value={archiveType}
              onChange={(e) => setArchiveType(e.target.value as 'mr' | 'badge')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2"
            >
              <option value="mr">Maaş Rozeti Arşivi</option>
              <option value="badge">Rozet Arşivi</option>
            </select>
          </div>

          <Input
            label="Tarih (Opsiyonel)"
            type="date"
            placeholder="Tarih seçin"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            icon={Calendar}
            fullWidth
          />

          <div className="flex items-end">
            <Button
              onClick={handleSearchArchive}
              loading={loading}
              disabled={loading}
              icon={Search}
              size="lg"
              className="w-full"
            >
              Arşiv Ara
            </Button>
          </div>
        </div>

        {/* Archive Results */}
        {archiveData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Arşiv Sonuçları ({archiveData.length})
              </h3>
              <Button
                onClick={copyArchiveData}
                variant="outline"
                size="sm"
                icon={Copy}
              >
                Verileri Kopyala
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {archiveData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                        {archiveType === 'mr' ? (
                          <Award className="w-5 h-5 text-white" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.username || `Kullanıcı ${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.details || 'Detay bilgisi yok'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.date || new Date().toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {archiveData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Arşiv verisi bulunamadı. Farklı tarih veya tür deneyin.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}