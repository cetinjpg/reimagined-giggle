import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Clock, 
  MapPin,
  Star,
  Shield,
  Crown,
  Award,
  Activity,
  User
} from 'lucide-react';
import { mockActiveUsers } from '../../services/graphqlClient';
import toast from 'react-hot-toast';

interface ActiveUser {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: string;
  onlineTime: number;
  rank: string;
  badge: string;
  motto: string;
  room?: {
    name: string;
    id: string;
  };
}

export function ActiveUsers() {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<ActiveUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [filterBadge, setFilterBadge] = useState('all');

  useEffect(() => {
    loadActiveUsers();
  }, []);

  const loadActiveUsers = async () => {
    setLoading(true);
    try {
      // Gerçek uygulamada GraphQL query çalışacak
      // const { data } = await client.query({ query: GET_ACTIVE_USERS });
      
      // Mock data kullanıyoruz
      await new Promise(resolve => setTimeout(resolve, 1000)); // Loading simülasyonu
      setUsers(mockActiveUsers);
      toast.success(`${mockActiveUsers.length} aktif kullanıcı yüklendi!`);
    } catch (error) {
      toast.error('Aktif kullanıcılar yüklenirken hata oluştu!');
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.rank.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBadge = filterBadge === 'all' || user.badge === filterBadge;
    return matchesSearch && matchesBadge;
  });

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      kurucular: 'from-yellow-500 to-orange-500',
      basbakan: 'from-purple-500 to-pink-500',
      yonetim: 'from-blue-500 to-indigo-500',
      liderler: 'from-green-500 to-emerald-500',
      memurlar: 'from-gray-500 to-gray-600',
      guvenlik: 'from-red-500 to-red-600'
    };
    return colors[badge] || 'from-gray-500 to-gray-600';
  };

  const getBadgeIcon = (badge: string) => {
    const icons: Record<string, any> = {
      kurucular: Crown,
      basbakan: Star,
      yonetim: Shield,
      liderler: Award,
      memurlar: User,
      guvenlik: Shield
    };
    return icons[badge] || User;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      busy: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const openUserDetails = (user: ActiveUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const uniqueBadges = [...new Set(users.map(user => user.badge))];

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="w-7 h-7 mr-3 text-green-500" />
            Aktif Kullanıcılar
            <span className="ml-3 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium">
              {users.length} Çevrimiçi
            </span>
          </h2>
          
          <Button
            onClick={loadActiveUsers}
            loading={loading}
            disabled={loading}
            icon={RefreshCw}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            Yenile
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-green-500 focus:ring-green-500/20 focus:outline-none focus:ring-2"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterBadge}
              onChange={(e) => setFilterBadge(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-green-500 focus:ring-green-500/20 focus:outline-none focus:ring-2"
            >
              <option value="all">Tüm Rozetler</option>
              {uniqueBadges.map(badge => (
                <option key={badge} value={badge}>
                  {badge.charAt(0).toUpperCase() + badge.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="p-6 bg-gray-800/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredUsers.map((user, index) => {
                const BadgeIcon = getBadgeIcon(user.badge);
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="p-6 bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
                      onClick={() => openUserDetails(user)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-16 h-16 rounded-full border-2 border-gray-600 group-hover:border-green-500 transition-colors"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=64&h=64&fit=crop&crop=face`;
                            }}
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(user.status)} rounded-full border-2 border-gray-800`}></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-white truncate">{user.username}</h3>
                            <div className={`p-1 rounded-lg bg-gradient-to-r ${getBadgeColor(user.badge)}`}>
                              <BadgeIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-400 truncate mb-2">{user.rank}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{user.onlineTime} dk</span>
                            </div>
                            {user.room && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{user.room.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-400 truncate">{user.motto}</p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm || filterBadge !== 'all' 
                ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' 
                : 'Şu anda aktif kullanıcı bulunmuyor.'
              }
            </p>
          </div>
        )}
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Kullanıcı Detayları"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.username}
                  className="w-24 h-24 rounded-full border-4 border-gray-600"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=96&h=96&fit=crop&crop=face`;
                  }}
                />
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${getStatusColor(selectedUser.status)} rounded-full border-4 border-gray-800`}></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedUser.username}</h3>
                <p className="text-gray-400 mb-2">{selectedUser.rank}</p>
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(selectedUser.badge)} text-white text-sm font-medium`}>
                    {selectedUser.badge.charAt(0).toUpperCase() + selectedUser.badge.slice(1)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedUser.status === 'online' ? 'bg-green-500/20 text-green-300' :
                    selectedUser.status === 'away' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {selectedUser.status === 'online' ? 'Çevrimiçi' :
                     selectedUser.status === 'away' ? 'Uzakta' : 'Meşgul'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 bg-gray-800/50">
                <div className="flex items-center space-x-3 mb-3">
                  <Activity className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-white">Aktivite</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Çevrimiçi Süre:</span>
                    <span className="text-white">{selectedUser.onlineTime} dakika</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Son Görülme:</span>
                    <span className="text-white">Şimdi</span>
                  </div>
                </div>
              </Card>

              {selectedUser.room && (
                <Card className="p-4 bg-gray-800/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-white">Konum</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Oda:</span>
                      <span className="text-white">{selectedUser.room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Oda ID:</span>
                      <span className="text-white">{selectedUser.room.id}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <Card className="p-4 bg-gray-800/50">
              <div className="flex items-center space-x-3 mb-3">
                <User className="w-5 h-5 text-purple-500" />
                <h4 className="font-semibold text-white">Profil</h4>
              </div>
              <p className="text-gray-300 text-sm">{selectedUser.motto}</p>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(selectedUser.username);
                  toast.success('Kullanıcı adı kopyalandı!');
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Kullanıcı Adını Kopyala
              </Button>
              <Button
                onClick={() => setShowUserModal(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              >
                Kapat
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}