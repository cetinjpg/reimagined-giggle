// Test için kullanıcı çalışma süresini artırma fonksiyonu
import { localAuthService } from '../services/authService';

export function addWorkTimeToUser(username: string, minutes: number) {
  localAuthService.updateUserWorkTime(username, minutes);
}

// Test kullanıcıları için hızlı çalışma süresi ekleme
export function setupTestData() {
  // Test kullanıcısına terfi için yeterli süre ekle
  addWorkTimeToUser('test', 30);
  
  // Admin kullanıcısına daha fazla süre ekle
  addWorkTimeToUser('admin', 500);
}