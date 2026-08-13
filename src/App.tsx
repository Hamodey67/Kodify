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
import { OnlineOrders } from './pages/OnlineOrders';
import { WebStore } from './pages/WebStore';
import { WebAdmin } from './pages/WebAdmin';
import { SuspensionScreen } from './components/SuspensionScreen';
import { RestrictedBanner } from './components/RestrictedBanner';
import { RestrictedPageNotice } from './components/RestrictedPageNotice';

// System suspension & restriction flags
// IS_SYSTEM_SUSPENDED = false: System will open normally
// IS_SYSTEM_RESTRICTED = false: System is fully unlocked with all pages, reports, and settings available
const IS_SYSTEM_SUSPENDED = false;
const IS_SYSTEM_RESTRICTED = false;

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
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#eef2f8]">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#e3e9f1] border-t-[#2563eb]" />
        <p className="mt-3 text-xs font-bold text-[#64748b]">جاري التحقق من ترخيص النظام...</p>
      </div>
    );
  }

  if (IS_SYSTEM_SUSPENDED) {
    return <SuspensionScreen />;
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
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#eef2f8]" dir={dir}>
        <TitleBar />
        <div className="flex-1 overflow-hidden">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#eef2f8] text-[#18212f]" dir={dir}>
      <TitleBar />

      {IS_SYSTEM_RESTRICTED && <RestrictedBanner />}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          isRestricted={IS_SYSTEM_RESTRICTED} 
        />

        <main className="flex h-full flex-1 flex-col overflow-hidden bg-[#eef2f8]">
          {IS_SYSTEM_RESTRICTED && activePage !== 'pos' ? (
            <RestrictedPageNotice onGoToPos={() => setActivePage('pos')} />
          ) : (
            <>
              {activePage === 'dashboard' && <Dashboard />}
              {activePage === 'pos' && <POS />}
              {activePage === 'online-orders' && <OnlineOrders />}
              {activePage === 'web-store' && <WebStore />}
              {activePage === 'web-admin' && <WebAdmin />}
              {activePage === 'inventory' && <Inventory />}
              {activePage === 'calendar' && <Calendar />}
              {activePage === 'chat' && <Chat />}
              {activePage === 'about' && <About />}
              {activePage === 'settings' && <Settings />}
            </>
          )}
        </main>
      </div>

      {/* Chat Notification Toast */}
      {chatNotification && (
        <div 
          onClick={() => {
            setActivePage('chat');
            setChatNotification(null);
          }}
          className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-[9999] flex max-w-sm cursor-pointer items-center gap-3 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] transition-colors hover:border-[#bfdbfe] animate-fade-in`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-[#2563eb]">
              {dir === 'rtl' ? 'رسالة جديدة من المدير' : 'New Message from Manager'}
            </div>
            <p className="mt-1 truncate text-xs font-semibold text-[#334155]">
              {chatNotification.message}
            </p>
          </div>
        </div>
      )}

      {/* Downloading Progress Banner */}
      {updateStatus === 'downloading' && updateProgress && (
        <div className={`fixed bottom-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} z-[9999] w-80 max-w-sm rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] animate-fade-in`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#b45309]">Downloading System Update...</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#64748b]">{Math.round(updateProgress.percent)}%</span>
                <span className="text-[9px] font-semibold text-[#94a3b8]">{(updateProgress.bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef2f7]">
                <div 
                  className="h-full rounded-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${updateProgress.percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Downloaded / Restart Prompt Modal (English UI) */}
      {showDownloadedModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 glass">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] animate-fade-in">
            <div className="flex items-center gap-4 border-b border-[#e3e9f1] pb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#18212f]">System Update Available</h3>
                <p className="mt-0.5 text-xs font-bold text-[#2563eb]">Ready to install</p>
              </div>
            </div>

            <div className="space-y-3 py-6">
              <p className="text-sm font-semibold leading-relaxed text-[#334155]">
                A new version of the KODIFY System has been successfully downloaded in the background.
              </p>
              <p className="text-xs leading-relaxed text-[#64748b]">
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
                className="flex-1 rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)] transition-colors hover:bg-[#1d4ed8] active:translate-y-px"
              >
                Restart Now
              </button>
              <button 
                onClick={() => setShowDownloadedModal(false)}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-5 py-2.5 text-sm font-bold text-[#64748b] transition-colors hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb]"
              >
                Install Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Error Notification Toast */}
      {updateStatus === 'error' && updateError && (
        <div className={`fixed bottom-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} z-[9999] max-w-sm rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] animate-fade-in`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#dc2626]">Update Error</div>
              <p className="mt-0.5 truncate text-[11px] font-semibold text-[#334155]">{updateError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
