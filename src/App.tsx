import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAppStore } from './store/useAppStore';
import { authAPI } from './services/api';

function App() {
  const { theme, isAuthenticated, setUser, setAuthenticated } = useAppStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Check for existing session
    const user = authAPI.getCurrentUser();
    if (user) {
      setUser(user);
      setAuthenticated(true);
    }
  }, [setUser, setAuthenticated]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {isAuthenticated ? <Dashboard /> : <WelcomeScreen />}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#fff',
            color: theme === 'dark' ? '#fff' : '#374151',
            border: `1px solid ${theme === 'dark' ? '#4B5563' : '#E5E7EB'}`,
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}

export default App;