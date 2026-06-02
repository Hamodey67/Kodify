import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useLanguageStore } from './store/languageStore';
import { useThemeStore } from './store/themeStore';
import { useSettingsStore } from './store/settingsStore';
import { useShiftStore } from './store/shiftStore';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Inventory } from './pages/Inventory';
import { Settings } from './pages/Settings';
import { Calendar } from './pages/Calendar';
import { Activation } from './pages/Activation';

export const App: React.FC = () => {
  const { user } = useAuthStore();
  const { dir } = useLanguageStore();
  const { fetchSettings } = useSettingsStore();
  const { fetchActiveShift } = useShiftStore();
  const [activePage, setActivePage] = useState('login');

  // Licensing state
  const [licenseChecking, setLicenseChecking] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  const [machineId, setMachineId] = useState('');

  // Check license state on mount
  useEffect(() => {
    const verifyLicense = async () => {
      try {
        const status = await window.api.checkLicense();
        setIsActivated(status.activated);
        setMachineId(status.machineId);
      } catch (err) {
        console.error('Failed to verify app license:', err);
      } finally {
        setLicenseChecking(false);
      }
    };
    verifyLicense();
  }, []);

  // Load app wide configurations
  useEffect(() => {
    fetchSettings();
  }, []);

  // Control default routes for logged in users (defaulting to POS view)
  useEffect(() => {
    if (user) {
      fetchActiveShift(user.id);
      setActivePage('pos');
    } else {
      setActivePage('login');
    }
  }, [user]);

  if (licenseChecking) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 border-r-2 border-slate-700"></div>
        <p className="text-xs text-slate-400 mt-3 font-semibold">جاري التحقق من ترخيص النظام...</p>
      </div>
    );
  }

  if (!isActivated) {
    return (
      <Activation 
        machineId={machineId} 
        onActivated={() => setIsActivated(true)} 
      />
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-900 text-slate-100" dir={dir}>
        <TitleBar />
        <div className="flex-1 overflow-hidden">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-900 text-slate-100" dir={dir}>
      {/* Frameless Top Drag TitleBar */}
      <TitleBar />

      {/* Main Core Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Dynamic Route Pages Viewport */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'pos' && <POS />}
          {activePage === 'inventory' && <Inventory />}
          {activePage === 'calendar' && <Calendar />}
          {activePage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default App;
