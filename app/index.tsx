import React, { useState } from 'react';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen, UserRole } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';

type ScreenName =
  | 'onboarding'
  | 'login'
  | 'register'
  | 'driver-dashboard'
  | 'admin-dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('onboarding');

  const handleLogin = (role: UserRole) => {
    setCurrentScreen(role === 'admin' ? 'admin-dashboard' : 'driver-dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={() => setCurrentScreen('login')} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onRegister={() => setCurrentScreen('register')}
      />
    );
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onComplete={() => setCurrentScreen('driver-dashboard')}
        onBackToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'driver-dashboard') {
    return <DashboardScreen onLogout={handleLogout} />;
  }

  if (currentScreen === 'admin-dashboard') {
    return <AdminDashboardScreen onLogout={handleLogout} />;
  }

  return null;
}
