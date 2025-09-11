import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Lock, LogIn, UserPlus, Users, Shield, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  onToggle: () => void;
}

export function AuthForm({ type, onSubmit, onToggle }: AuthFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    habboUsername: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');

  // Login form data
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `[TÖH]${code}`;
  };

  const handleStep1Submit = async () => {
    if (!formData.habboUsername.trim()) {
      setErrors({ habboUsername: 'Habbo kullanıcı adı zorunludur' });
      return;
    }

    setLoading(true);
    try {
      // Doğrulama kodu oluştur
      const code = generateVerificationCode();
      setGeneratedCode(code);
      setCurrentStep(2);
      setErrors({});
      toast.success('Şimdi doğrulama kodunu mottona ekle.');
    } catch (error) {
      setErrors({ habboUsername: 'Bir hata oluştu!' });
      toast.error('Bir hata oluştu!');
    }
    setLoading(false);
  };

  const handleVerification = async () => {
    setLoading(true);
    setVerificationStatus('checking');
    
    // Simüle edilmiş doğrulama - gerçek uygulamada Habbo API'si kullanılır
    setTimeout(() => {
      setVerificationStatus('success');
      setCurrentStep(3);
      setErrors({});
      toast.success('Doğrulama başarılı! Şimdi şifreni belirle.');
    }, 2000);
    
    setLoading(false);
  };

  const handleFinalSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password.trim()) newErrors.password = 'Şifre zorunludur';
    if (formData.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler uyuşmuyor';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const user = await authAPI.register({
          fullName: formData.habboUsername,
          username: formData.habboUsername,
          email: `${formData.habboUsername.toLowerCase()}@toh.com`,
          password: formData.password,
          habboUsername: formData.habboUsername
        });
        
        toast.success('Kayıt başarılı! Şimdi giriş yapabilirsin.');
        onToggle();
      } catch (error: any) {
        toast.error(error.message);
      }
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newErrors: Record<string, string> = {};
    if (!loginData.username.trim()) newErrors.username = 'Kullanıcı adı zorunludur';
    if (!loginData.password.trim()) newErrors.password = 'Şifre zorunludur';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const user = await authAPI.login(loginData.username, loginData.password);
        onSubmit(user);
        toast.success('Başarıyla giriş yapıldı!');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Kod panoya kopyalandı!');
  };

  const updateField = (field: string, value: string) => {
    if (type === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (type === 'login') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">TÖH'e Hoş Geldin!</h3>
          <p className="text-gray-600">Hesabına giriş yap ve maceraya devam et</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Habbo Kullanıcı Adı"
            placeholder="Habbo kullanıcı adın"
            value={loginData.username}
            onChange={(e) => updateField('username', e.target.value)}
            error={errors.username}
            icon={Users}
            fullWidth
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="Şifren"
            value={loginData.password}
            onChange={(e) => updateField('password', e.target.value)}
            error={errors.password}
            icon={Lock}
            fullWidth
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
            icon={LogIn}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 py-4 text-lg"
          >
            Giriş Yap
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Hesabın yok mu?
            {' '}
            <button
              type="button"
              onClick={onToggle}
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              TÖH'e Katıl
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
              ${currentStep >= step 
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div className={`
                w-12 h-1 mx-2
                ${currentStep > step ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Habbo Username */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Habbo Kullanıcı Adın</h3>
              <p className="text-gray-600">TÖH'e katılmak için Habbo kullanıcı adını gir</p>
            </div>

            <Input
              label="Habbo Kullanıcı Adı"
              placeholder="Habbo'daki kullanıcı adın"
              value={formData.habboUsername}
              onChange={(e) => updateField('habboUsername', e.target.value)}
              error={errors.habboUsername}
              icon={Users}
              fullWidth
            />

            <Button
              onClick={handleStep1Submit}
              fullWidth
              loading={loading}
              disabled={loading}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 py-4 text-lg"
            >
              Devam Et
            </Button>
          </motion.div>
        )}

        {/* Step 2: Verification */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Doğrulama</h3>
              <p className="text-gray-600">Aşağıdaki kodu Habbo mottona ekle</p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-2 border-primary-200 dark:border-primary-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Doğrulama Kodu:</span>
                <Button
                  onClick={copyCode}
                  variant="ghost"
                  size="sm"
                  icon={Copy}
                  className="text-primary-500 hover:text-primary-600"
                >
                  Kopyala
                </Button>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 border-2 border-dashed border-primary-300 dark:border-primary-600">
                <code className="text-2xl font-bold text-primary-600 block text-center">
                  {generatedCode}
                </code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                Bu kodu Habbo profilindeki mottona ekle ve "Doğrula" butonuna bas
              </p>
            </div>

            {errors.verification && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{errors.verification}</span>
              </div>
            )}

            <Button
              onClick={handleVerification}
              fullWidth
              loading={loading}
              disabled={loading}
              className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 py-4 text-lg"
            >
              {verificationStatus === 'checking' ? 'Doğrulanıyor...' : 'Doğrula'}
            </Button>

            <Button
              onClick={() => setCurrentStep(1)}
              variant="ghost"
              fullWidth
              className="text-gray-600 hover:text-gray-700"
            >
              Geri Dön
            </Button>
          </motion.div>
        )}

        {/* Step 3: Password */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Şifre Belirle</h3>
              <p className="text-gray-600">Hesabın için güvenli bir şifre oluştur</p>
            </div>

            <Input
              label="Şifre"
              type="password"
              placeholder="Güvenli bir şifre gir"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
              icon={Lock}
              fullWidth
            />

            <Input
              label="Şifre Tekrar"
              type="password"
              placeholder="Şifreni tekrar gir"
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              icon={Lock}
              fullWidth
            />

            <Button
              onClick={handleFinalSubmit}
              fullWidth
              loading={loading}
              disabled={loading}
              icon={UserPlus}
              className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 py-4 text-lg"
            >
              TÖH'e Katıl
            </Button>

            <Button
              onClick={() => setCurrentStep(2)}
              variant="ghost"
              fullWidth
              className="text-gray-600 hover:text-gray-700"
            >
              Geri Dön
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <p className="text-gray-600">
          Zaten hesabın var mı?
          {' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
}