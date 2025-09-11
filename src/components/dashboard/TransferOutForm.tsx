import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserMinus, Copy, AlertTriangle } from 'lucide-react';
import { discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface Departure {
  id: string;
  userName: string;
  habboUsername: string;
  currentRank: string;
  currentBadge: string;
  departureReason: string;
  newCompany?: string;
  departureDate: string;
  status: 'voluntary' | 'dismissed' | 'transferred';
  notes: string;
}

export function TransferOutForm() {
  const [formData, setFormData] = useState({
    userName: '',
    habboUsername: '',
    currentRank: '',
    currentBadge: '',
    departureReason: '',
    newCompany: '',
    status: 'voluntary' as 'voluntary' | 'dismissed' | 'transferred',
    notes: ''
  });
  
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(false);

  const departureReasons = [
    'Kendi isteği ile ayrıldı',
    'Başka şirkete transfer oldu',
    'Disiplin cezası ile çıkarıldı',
    'Uzun süre aktif olmadı',
    'Kurallara uymadı',
    'Diğer'
  ];

  const handleDeparture = async () => {
    if (!formData.userName || !formData.habboUsername || !formData.currentRank || !formData.departureReason) {
      toast.error('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    setLoading(true);

    const newDeparture: Departure = {
      id: Date.now().toString(),
      userName: formData.userName,
      habboUsername: formData.habboUsername,
      currentRank: formData.currentRank,
      currentBadge: formData.currentBadge,
      departureReason: formData.departureReason,
      newCompany: formData.newCompany,
      departureDate: new Date().toISOString(),
      status: formData.status,
      notes: formData.notes
    };

    setDepartures(prev => [...prev, newDeparture]);

    // Discord'a log gönder
    const statusText = {
      voluntary: 'Gönüllü Ayrılık',
      dismissed: 'İhraç',
      transferred: 'Transfer'
    };

    const colorMap = {
      voluntary: 0xffa500,
      dismissed: 0xff0000,
      transferred: 0x0099ff
    };

    await discordAPI.sendLog({
      title: '📤 Şirketten Ayrılan',
      description: `${formData.userName} TÖH'den ayrıldı`,
      color: colorMap[formData.status],
      fields: [
        { name: 'Habbo Kullanıcı Adı', value: formData.habboUsername, inline: true },
        { name: 'Rütbe', value: formData.currentRank, inline: true },
        { name: 'Ayrılık Türü', value: statusText[formData.status], inline: true },
        { name: 'Sebep', value: formData.departureReason, inline: false },
        ...(formData.newCompany ? [{ name: 'Yeni Şirket', value: formData.newCompany, inline: true }] : []),
        { name: 'Ayrılık Tarihi', value: new Date().toLocaleDateString('tr-TR'), inline: true },
        ...(formData.notes ? [{ name: 'Notlar', value: formData.notes, inline: false }] : [])
      ],
      username: formData.userName
    });

    // Form temizle
    setFormData({
      userName: '',
      habboUsername: '',
      currentRank: '',
      currentBadge: '',
      departureReason: '',
      newCompany: '',
      status: 'voluntary',
      notes: ''
    });

    setLoading(false);
    toast.success('Ayrılık kaydı oluşturuldu!');
  };

  const copyDepartureList = () => {
    const departureText = departures
      .map(d => {
        const statusText = {
          voluntary: 'Gönüllü',
          dismissed: 'İhraç',
          transferred: 'Transfer'
        };
        return `${d.userName} (${d.habboUsername}) - ${d.currentRank} - ${statusText[d.status]} - ${d.departureReason}`;
      })
      .join('\n');
    
    if (departureText) {
      navigator.clipboard.writeText(departureText);
      toast.success('Ayrılık listesi panoya kopyalandı!');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <UserMinus className="w-6 h-6 mr-2 text-primary-500" />
          Şirketten Giden Yönetimi
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <Input
              label="Kullanıcı Adı"
              placeholder="Kullanıcı adını girin"
              value={formData.userName}
              onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
              fullWidth
            />

            <Input
              label="Habbo Kullanıcı Adı"
              placeholder="Habbo kullanıcı adını girin"
              value={formData.habboUsername}
              onChange={(e) => setFormData(prev => ({ ...prev, habboUsername: e.target.value }))}
              fullWidth
            />

            <Input
              label="Mevcut Rütbe"
              placeholder="Mevcut rütbesini girin"
              value={formData.currentRank}
              onChange={(e) => setFormData(prev => ({ ...prev, currentRank: e.target.value }))}
              fullWidth
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ayrılık Türü
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2"
              >
                <option value="voluntary">Gönüllü Ayrılık</option>
                <option value="transferred">Transfer</option>
                <option value="dismissed">İhraç</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ayrılık Sebebi
              </label>
              <select
                value={formData.departureReason}
                onChange={(e) => setFormData(prev => ({ ...prev, departureReason: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2"
              >
                <option value="">Sebep seçin</option>
                {departureReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {(formData.status === 'transferred' || formData.departureReason.includes('transfer')) && (
              <Input
                label="Yeni Şirket (Opsiyonel)"
                placeholder="Hangi şirkete gitti"
                value={formData.newCompany}
                onChange={(e) => setFormData(prev => ({ ...prev, newCompany: e.target.value }))}
                fullWidth
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notlar (Opsiyonel)
              </label>
              <textarea
                className="w-full h-24 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2 resize-none"
                placeholder="Ayrılık hakkında ek bilgiler..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Bu işlem geri alınamaz. Kullanıcının şirketten ayrıldığından emin olun.
            </p>
          </div>
        </div>

        <Button
          onClick={handleDeparture}
          fullWidth
          size="lg"
          loading={loading}
          disabled={loading}
          icon={UserMinus}
          className="bg-red-500 hover:bg-red-600"
        >
          Ayrılık Kaydı Oluştur
        </Button>
      </Card>

      {departures.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ayrılık Kayıtları ({departures.length})
            </h3>
            <Button
              onClick={copyDepartureList}
              variant="outline"
              size="sm"
              icon={Copy}
            >
              Listeyi Kopyala
            </Button>
          </div>

          <div className="space-y-4">
            {departures.map((departure) => (
              <motion.div
                key={departure.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {departure.userName} ({departure.habboUsername})
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {departure.currentRank}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {departure.departureReason}
                    </p>
                    {departure.newCompany && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Yeni şirket: {departure.newCompany}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(departure.departureDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    departure.status === 'voluntary' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      : departure.status === 'dismissed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                  }`}>
                    {departure.status === 'voluntary' ? 'Gönüllü' : 
                     departure.status === 'dismissed' ? 'İhraç' : 'Transfer'}
                  </span>
                </div>

                {departure.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Notlar:</strong> {departure.notes}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}