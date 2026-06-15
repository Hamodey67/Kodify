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
import { Chat } from './pages/Chat';
import { About } from './pages/About';

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
  const [chatNotification, setChatNotification] = useState<{ message: string; senderName: string } | null>(null);
  const [lastMessageCount, setLastMessageCount] = useState<number | null>(null);

  // Auto Updater State
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [updateProgress, setUpdateProgress] = useState<{ percent: number; bytesPerSecond: number; transferred: number; total: number } | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [showDownloadedModal, setShowDownloadedModal] = useState(false);

  // Listen to auto updater events
  useEffect(() => {
    if (!window.api || !window.api.onUpdateStatus) return;

    const unsubscribe = window.api.onUpdateStatus((status: string, info: any) => {
      console.log('Update Status Event:', status, info);
      setUpdateStatus(status);
      
      if (status === 'downloading') {
        setUpdateProgress(info);
      } else if (status === 'downloaded') {
        setShowDownloadedModal(true);
        setUpdateProgress(null);
      } else if (status === 'error') {
        setUpdateError(info);
        // Automatically hide error after 7 seconds
        const timer = setTimeout(() => {
          setUpdateStatus(null);
          setUpdateError(null);
        }, 7000);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  // Poll for background messages to trigger toast notification
  useEffect(() => {
    if (!user) return;

    const checkNewMessages = async () => {
      try {
        const list = await window.api.getMessages();
        if (list && list.length > 0) {
          if (lastMessageCount !== null && list.length > lastMessageCount) {
            const latestMsg = list[list.length - 1];
            if (latestMsg.sender === 'manager' && activePage !== 'chat') {
              setChatNotification({
                message: latestMsg.message,
                senderName: latestMsg.senderName || 'المدير (Manager)'
              });
              // Auto hide toast after 6 seconds
              const timer = setTimeout(() => {
                setChatNotification(null);
              }, 6000);
              return () => clearTimeout(timer);
            }
          }
          setLastMessageCount(list.length);
        } else {
          setLastMessageCount(0);
        }
      } catch (err) {
        console.error('Failed to poll background messages:', err);
      }
    };

    checkNewMessages();
    const interval = setInterval(checkNewMessages, 3000);
    return () => clearInterval(interval);
  }, [user, lastMessageCount, activePage]);

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
          {activePage === 'chat' && <Chat />}
          {activePage === 'about' && <About />}
          {activePage === 'settings' && <Settings />}
        </main>
      </div>

      {/* Chat Notification Toast */}
      {chatNotification && (
        <div 
          onClick={() => {
            setActivePage('chat');
            setChatNotification(null);
          }}
          className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-[9999] flex items-center gap-3 bg-slate-800/95 border border-teal-500/40 hover:border-teal-400 text-slate-100 p-4 rounded-2xl shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] max-w-sm animate-fade-in`}
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-teal-400">
              {dir === 'rtl' ? 'رسالة جديدة من المدير' : 'New Message from Manager'}
            </div>
            <p className="text-xs text-slate-200 mt-1 font-semibold truncate">
              {chatNotification.message}
            </p>
          </div>
        </div>
      )}

      {/* Downloading Progress Banner */}
      {updateStatus === 'downloading' && updateProgress && (
        <div className={`fixed bottom-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} z-[9999] bg-slate-800/95 border border-amber-500/40 text-slate-100 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm w-80 animate-fade-in`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-amber-400">Downloading System Update...</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-slate-400 font-semibold">{Math.round(updateProgress.percent)}%</span>
                <span className="text-[9px] text-slate-500">{(updateProgress.bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${updateProgress.percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Downloaded / Restart Prompt Modal (English UI) */}
      {showDownloadedModal && (
        <div className="fixed inset-0 glass z-[10000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-slate-800 border border-teal-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in p-6">
            <div className="flex items-center gap-4 border-b border-slate-700 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">System Update Available</h3>
                <p className="text-xs text-teal-400 font-semibold mt-0.5">Ready to install</p>
              </div>
            </div>

            <div className="py-6 space-y-3">
              <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                A new version of the KODIFY System has been successfully downloaded in the background.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Please restart the application now to apply the updates. This will keep your system secure and up-to-date.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  if (window.api && window.api.restartAppForUpdate) {
                    window.api.restartAppForUpdate();
                  }
                }}
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all text-sm"
              >
                Restart Now
              </button>
              <button 
                onClick={() => setShowDownloadedModal(false)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-650 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-sm"
              >
                Install Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Error Notification Toast */}
      {updateStatus === 'error' && updateError && (
        <div className={`fixed bottom-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} z-[9999] bg-slate-800/95 border border-red-500/40 text-slate-100 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm animate-fade-in`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-red-400">Update Error</div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate">{updateError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
