import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GraduationCap, Plus, Search, User, Calendar, Clock } from 'lucide-react';
import { tohAPI, discordAPI } from '../../services/api';
import toast from 'react-hot-toast';

export function EducationForm() {
  const [instructorName, setInstructorName] = useState('');
  const [instructorInfo, setInstructorInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    participants: '',
    date: '',
    time: '',
    duration: '60',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const trainingTemplates = [
    'Stajyer Eğitimi',
    'Yüksek Rütbe Eğitimi'
  ];

  const handleInstructorSearch = async () => {
    if (!instructorName.trim()) {
      toast.error('Lütfen eğitmen adı girin!');
      return;
    }

    setLoading(true);
    try {
      const userData = await tohAPI.getUserInfo(instructorName.trim());
      setInstructorInfo(userData);
      toast.success('Eğitmen bilgileri yüklendi!');
    } catch (error: any) {
      toast.error(error.message);
      setInstructorInfo(null);
    }
    setLoading(false);
  };

  const handleCreateTraining = async () => {
    if (!instructorInfo || !formData.title || !formData.participants || !formData.date || !formData.time) {
      toast.error('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    setCreating(true);
    try {
      const participants = formData.participants
        .split('\n')
        .map(p => p.trim())
        .filter(p => p);

      const trainingDateTime = new Date(`${formData.date}T${formData.time}`);

      await discordAPI.sendLog({
        title: '🎓 Eğitim Planlandı',
        description: `Yeni eğitim planlandı: ${formData.title}`,
        color: 0x0099ff,
        fields: [
          { name: 'Eğitmen', value: instructorInfo.username, inline: true },
          { name: 'Katılımcı Sayısı', value: participants.length.toString(), inline: true },
          { name: 'Tarih', value: trainingDateTime.toLocaleDateString('tr-TR'), inline: true },
          { name: 'Saat', value: trainingDateTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), inline: true },
          { name: 'Süre', value: `${formData.duration} dakika`, inline: true },
          { name: 'Açıklama', value: formData.description || 'Belirtilmemiş', inline: false }
        ]
      });

      // Form temizle
      setFormData({
        title: '',
        participants: '',
        date: '',
        time: '',
        duration: '60',
        description: ''
      });

      toast.success('Eğitim başarıyla planlandı!');
    } catch (error: any) {
      toast.error('Eğitim planlama sırasında hata oluştu!');
    }
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <GraduationCap className="w-7 h-7 mr-3 text-primary-500" />
          Eğitim Yönetimi
        </h2>

        {/* Instructor Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Eğitmen Adı"
                placeholder="Eğitimi verecek kişinin adını girin"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                icon={User}
                fullWidth
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleInstructorSearch}
                loading={loading}
                disabled={loading}
                icon={Search}
                className="px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                Eğitmen Ara
              </Button>
            </div>
          </div>
        </div>

        {/* Instructor Information */}
        {instructorInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                Eğitmen Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Eğitmen</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {instructorInfo.username || instructorName}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Rütbe
                  </p>
                  <p className="text-lg font-bold text-red-400">
                    {instructorInfo.currentRank || 'Stajyer'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Eğitim Yetkisi
                  </p>
                  <p className="text-lg font-bold text-orange-400">
                    {instructorInfo.canTeach ? 'Var' : 'Yok'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Training Form */}
        {instructorInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Eğitim Başlığı
                  </label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-red-500/20 focus:outline-none focus:ring-2"
                  >
                    <option value="">Eğitim türü seçin</option>
                    {trainingTemplates.map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Tarih"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    icon={Calendar}
                    fullWidth
                  />

                  <Input
                    label="Saat"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    icon={Clock}
                    fullWidth
                  />
                </div>

                <Input
                  label="Süre (Dakika)"
                  type="number"
                  placeholder="60"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  fullWidth
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Katılımcılar
                  </label>
                  <textarea
                    className="w-full h-32 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-red-500/20 focus:outline-none focus:ring-2 resize-none"
                    placeholder="Her satıra bir katılımcı adı yazın..."
                    value={formData.participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama (Opsiyonel)
                  </label>
                  <textarea
                    className="w-full h-24 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-red-500/20 focus:outline-none focus:ring-2 resize-none"
                    placeholder="Eğitim hakkında ek bilgiler..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {instructorInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleCreateTraining}
              fullWidth
              size="lg"
              loading={creating}
              disabled={creating}
              icon={Plus}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              Eğitim Planla
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}