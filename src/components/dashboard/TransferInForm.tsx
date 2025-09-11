import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserPlus, Copy, CheckCircle } from 'lucide-react';
import { discordAPI, habboAPI } from '../../services/api';
import { ranks, badgeNames } from '../../data/promotionData';
import toast from 'react-hot-toast';

interface Transfer {
  id: string;
  userName: string;
  habboUsername: string;
  previousCompany: string;
  assignedBadge: string;
  assignedRank: string;
  transferDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

export function TransferInForm() {
  const [formData, setFormData] = useState({
    userName: '',
    habboUsername: '',
    previousCompany: '',
    assignedBadge: '',
    assignedRank: '',
    notes: ''
  });
  
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTransferIn = async () => {
    if (!formData.userName || !formData.habboUsername || !formData.previousCompany || !formData.assignedBadge || !formData.assignedRank) {
      toast.error('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    setLoading(true);

    try {
      // Habbo kullanıcısını doğrula
      await habboAPI.getUserProfile(formData.habboUsername);

      const newTransfer: Transfer = {
        id: Date.now().toString(),
        userName: formData.userName,
        habboUsername: formData.habboUsername,
        previousCompany: formData.previousCompany,
        assignedBadge: formData.assignedBadge,
        assignedRank: formData.assignedRank,
        transferDate: new Date().toISOString(),
        status: 'pending',
        notes: formData.notes
      };

      setTransfers(prev => [...prev, newTransfer]);

      // Discord'a log gönder
      await discordAPI.sendLog({
        title: '📥 Transfer Gelen',
        description: `${formData.userName} TÖH'e transfer oldu`,
        color: 0x00ff00,
        fields: [
          { name: 'Habbo Kullanıcı Adı', value: formData.habboUsername, inline: true },
          { name: 'Önceki Şirket', value: formData.previousCompany, inline: true },
          { name: 'Atanan Rozet', value: badgeNames[formData.assignedBadge as keyof typeof badgeNames], inline: true },
          { name: 'Atanan Rütbe', value: formData.assignedRank, inline: true },
          { name: 'Transfer Tarihi', value: new Date().toLocaleDateString('tr-TR'), inline: true },
          { name: 'Notlar', value: formData.notes || 'Belirtilmemiş', inline: false }
        ],
        username: formData.userName
      });

      // Form temizle
      setFormData({
        userName: '',
        habboUsername: '',
        previousCompany: '',
        assignedBadge: '',
        assignedRank: '',
        notes: ''
      });

      setLoading(false);
      toast.success('Transfer kaydı oluşturuldu!');
    } catch (error: any) {
      setLoading(false);
      toast.error('Habbo kullanıcı adı bulunamadı!');
    }
  };

  const approveTransfer = async (transferId: string) => {
    setTransfers(prev => prev.map(t => 
      t.id === transferId ? { ...t, status: 'approved' as const } : t
    ));

    const transfer = transfers.find(t => t.id === transferId);
    if (transfer) {
      await discordAPI.sendLog({
        title: '✅ Transfer Onaylandı',
        description: `${transfer.userName} transferi onaylandı`,
        color: 0x00ff00,
        fields: [
          { name: 'Rozet', value: badgeNames[transfer.assignedBadge as keyof typeof badgeNames], inline: true },
          { name: 'Rütbe', value: transfer.assignedRank, inline: true }
        ],
        username: transfer.userName
      });

      toast.success('Transfer onaylandı!');
    }
  };

  const copyTransferList = () => {
    const transferText = transfers
      .filter(t => t.status === 'approved')
      .map(t => `${t.userName} (${t.habboUsername}) - ${t.previousCompany} > TÖH - ${t.assignedRank}`)
      .join('\n');
    
    if (transferText) {
      navigator.clipboard.writeText(transferText);
      toast.success('Transfer listesi panoya kopyalandı!');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <UserPlus className="w-6 h-6 mr-2 text-primary-500" />
          Transfer Gelen Yönetimi
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
              label="Önceki Şirket"
              placeholder="Hangi şirketten geldiğini girin"
              value={formData.previousCompany}
              onChange={(e) => setFormData(prev => ({ ...prev, previousCompany: e.target.value }))}
              fullWidth
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Atanacak Rozet
              </label>
              <select
                value={formData.assignedBadge}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedBadge: e.target.value, assignedRank: '' }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2"
              >
                <option value="">Rozet seçin</option>
                {Object.entries(badgeNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Atanacak Rütbe
              </label>
              <select
                value={formData.assignedRank}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedRank: e.target.value }))}
                disabled={!formData.assignedBadge}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2 disabled:opacity-50"
              >
                <option value="">Rütbe seçin</option>
                {formData.assignedBadge && ranks[formData.assignedBadge as keyof typeof ranks]?.map((rank) => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notlar (Opsiyonel)
              </label>
              <textarea
                className="w-full h-24 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-2 resize-none"
                placeholder="Transfer hakkında ek bilgiler..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleTransferIn}
          fullWidth
          size="lg"
          loading={loading}
          disabled={loading}
          icon={UserPlus}
        >
          Transfer Kaydı Oluştur
        </Button>
      </Card>

      {transfers.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transfer Kayıtları ({transfers.length})
            </h3>
            <Button
              onClick={copyTransferList}
              variant="outline"
              size="sm"
              icon={Copy}
            >
              Onaylı Transferleri Kopyala
            </Button>
          </div>

          <div className="space-y-4">
            {transfers.map((transfer) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {transfer.userName} ({transfer.habboUsername})
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transfer.previousCompany} → TÖH
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {badgeNames[transfer.assignedBadge as keyof typeof badgeNames]} - {transfer.assignedRank}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(transfer.transferDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transfer.status === 'approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                        : transfer.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                    }`}>
                      {transfer.status === 'approved' ? 'Onaylandı' : 
                       transfer.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                    
                    {transfer.status === 'pending' && (
                      <Button
                        onClick={() => approveTransfer(transfer.id)}
                        variant="outline"
                        size="sm"
                        icon={CheckCircle}
                        className="text-accent-600 hover:text-accent-700"
                      >
                        Onayla
                      </Button>
                    )}
                  </div>
                </div>

                {transfer.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Notlar:</strong> {transfer.notes}
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