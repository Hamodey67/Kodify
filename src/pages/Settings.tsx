import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../utils/translations';
import { 
  Building, 
  Printer, 
  Sparkles,
  Smartphone,
  Wifi,
  Copy,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  Database,
  FolderOpen,
  HardDriveDownload
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Settings: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language] as any;
  const { user } = useAuthStore();
  const { settings, saveSettings, fetchSettings } = useSettingsStore();

  // Store profile configurations
  const [storeNameAr, setStoreNameAr] = useState('');
  const [storeNameEn, setStoreNameEn] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeTaxNumber, setStoreTaxNumber] = useState('');
  const [mockHardware, setMockHardware] = useState('true');
  const [printerConnection, setPrinterConnection] = useState('192.168.1.100');

  // Mobile App Access (Tunnel) Configurations
  const [tunnelEnabled, setTunnelEnabled] = useState('false');
  const [tunnelPort, setTunnelPort] = useState('8787');
  const [tunnelStatus, setTunnelStatus] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [backupStatus, setBackupStatus] = useState<any>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const loadBackupStatus = async () => {
    if (!window.api?.getBackupStatus) return;
    const status = await window.api.getBackupStatus();
    setBackupStatus(status);
  };

  useEffect(() => {
    fetchSettings();
    loadBackupStatus();
    
    // Fetch initial tunnel status
    if (window.api && window.api.getManagerTunnelStatus) {
      window.api.getManagerTunnelStatus().then(setTunnelStatus);
      
      // Listen for tunnel status changes
      const unsubscribe = window.api.onManagerTunnelStatusChanged(setTunnelStatus);
      return () => unsubscribe();
    }
  }, []);

  // Sync settings when loaded
  useEffect(() => {
    if (tunnelStatus) {
      setIsConnecting(false);
    }
  }, [tunnelStatus]);

  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setStoreNameAr(settings['store_name_ar'] || '');
      setStoreNameEn(settings['store_name_en'] || '');
      setStoreAddress(settings['store_address'] || '');
      setStorePhone(settings['store_phone'] || '');
      setStoreTaxNumber(settings['store_tax_number'] || '');
      setMockHardware(settings['hardware_mock_mode'] || 'true');
      setPrinterConnection(settings['hardware_printer_ip'] || '192.168.1.100');
      
      setTunnelEnabled(settings['mobile_tunnel_enabled'] || 'false');
      setTunnelPort(settings['mobile_manager_port'] || '8787');
    }
  }, [settings]);

  const handleStoreSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      'store_name_ar': storeNameAr,
      'store_name_en': storeNameEn,
      'store_address': storeAddress,
      'store_phone': storePhone,
      'store_tax_number': storeTaxNumber,
      'hardware_mock_mode': mockHardware,
      'hardware_printer_ip': printerConnection,
      'mobile_tunnel_enabled': tunnelEnabled,
      'mobile_manager_port': tunnelPort,
    };

    const success = await saveSettings(payload);
    if (success) {
      alert(t.success);
      // Automatically manage tunnel based on state
      if (window.api && window.api.startManagerTunnel && window.api.stopManagerTunnel) {
         if (tunnelEnabled === 'true') {
           window.api.startManagerTunnel();
         } else {
           window.api.stopManagerTunnel();
         }
      }
    } else {
      alert(t.error);
    }
  };

  const copyUrl = () => {
    if (tunnelStatus?.url) {
      navigator.clipboard.writeText(tunnelStatus.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleTunnelState = async () => {
    if (tunnelStatus?.running) {
      setIsConnecting(true);
      setTunnelEnabled('false');
      const payload = {
        'store_name_ar': storeNameAr,
        'store_name_en': storeNameEn,
        'store_address': storeAddress,
        'store_phone': storePhone,
        'store_tax_number': storeTaxNumber,
        'hardware_mock_mode': mockHardware,
        'hardware_printer_ip': printerConnection,
        'mobile_tunnel_enabled': 'false',
        'mobile_manager_port': tunnelPort,
      };
      await saveSettings(payload);
      window.api.stopManagerTunnel();
    } else {
      setIsConnecting(true);
      setTunnelEnabled('true');
      const payload = {
        'store_name_ar': storeNameAr,
        'store_name_en': storeNameEn,
        'store_address': storeAddress,
        'store_phone': storePhone,
        'store_tax_number': storeTaxNumber,
        'hardware_mock_mode': mockHardware,
        'hardware_printer_ip': printerConnection,
        'mobile_tunnel_enabled': 'true',
        'mobile_manager_port': tunnelPort,
      };
      await saveSettings(payload);
      window.api.startManagerTunnel();
    }
  };

  const formatBackupDate = (value: string | null) => {
    if (!value) return t.noBackupYet;
    return new Date(value).toLocaleString(language === 'ar' ? 'ar-IQ' : language === 'ku' ? 'ku' : 'en-US');
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 MB';
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleManualBackup = async () => {
    if (!window.api?.createBackup) return;
    setIsBackingUp(true);
    setBackupMessage(null);
    try {
      const result = await window.api.createBackup();
      if (result?.success) {
        setBackupMessage(t.backupSuccess);
        await loadBackupStatus();
      } else {
        setBackupMessage(t.backupFailed);
      }
    } catch {
      setBackupMessage(t.backupFailed);
    } finally {
      setIsBackingUp(false);
      window.setTimeout(() => setBackupMessage(null), 4000);
    }
  };

  const handleOpenBackupFolder = async () => {
    if (window.api?.openBackupFolder) {
      await window.api.openBackupFolder();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-pos-bg space-y-6"
    >
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/6 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black gradient-text">{t.settings}</h1>
          <p className="text-sm text-slate-300/70 mt-1">
            {language === 'ar' ? 'إعدادات النظام وأجهزة الطابعات الخاصة بالمتجر' : 'Configure POS terminals, printers and store information'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* STORE PROFILE SETTINGS */}
        <div className="glass-card p-6 rounded-xl border border-slate-800 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-700/60 pb-3 mb-5">
            <Building size={15} className="text-indigo-400" />
            <span>{t.storeSettings}</span>
          </h3>

          <form id="settings-form" onSubmit={handleStoreSettingsSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.storeNameEn}</label>
                <input
                  type="text"
                  value={storeNameEn}
                  onChange={(e) => setStoreNameEn(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.phone}</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg font-mono"
                  required
                />
              </div>
            </div>

            <div className="border-t border-slate-800 my-4"></div>
            
            <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5 mb-2">
              <Printer size={13} className="text-teal-400" />
              <span>{t.printerSettings}</span>
            </h4>

            <div className="grid grid-cols-1 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-700">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.mockHardwareMode}</label>
                <select
                  value={mockHardware}
                  onChange={(e) => setMockHardware(e.target.value)}
                  style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}
                  className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg"
                >
                  <option value="true">{language === 'ar' ? 'نعم (محاكاة وحفظ كملف نصي)' : 'Yes (Mock - Save receipt as text)'}</option>
                  <option value="false">{language === 'ar' ? 'لا (طابعة فعلية ESC/POS)' : 'No (Connect to physical ESC/POS)'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.printerConnection} (IP address)</label>
                <input
                  type="text"
                  value={printerConnection}
                  onChange={(e) => setPrinterConnection(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg font-mono"
                  placeholder="192.168.1.100"
                />
              </div>
            </div>
          </form>
        </div>

        {/* MOBILE APP TUNNEL SETTINGS */}
        <div className="glass-card p-6 rounded-xl border border-slate-800 animate-fade-in flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between border-b border-slate-700/60 pb-3 mb-1">
            <div className="flex items-center gap-1.5">
              <Smartphone size={15} className="text-pink-400" />
              <span>{t.mobileAppAccess}</span>
            </div>
            
            {tunnelStatus && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${tunnelStatus.running ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {tunnelStatus.running ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {tunnelStatus.running ? t.tunnelRunning : t.tunnelStopped}
              </div>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.enableMobileApp}</label>
                <select
                  value={tunnelEnabled}
                  onChange={async (e) => {
                    const val = e.target.value;
                    setTunnelEnabled(val);
                    const payload = {
                      'store_name_ar': storeNameAr,
                      'store_name_en': storeNameEn,
                      'store_address': storeAddress,
                      'store_phone': storePhone,
                      'store_tax_number': storeTaxNumber,
                      'hardware_mock_mode': mockHardware,
                      'hardware_printer_ip': printerConnection,
                      'mobile_tunnel_enabled': val,
                      'mobile_manager_port': tunnelPort,
                    };
                    await saveSettings(payload);
                    if (val === 'true') {
                      window.api.startManagerTunnel();
                    } else {
                      window.api.stopManagerTunnel();
                    }
                  }}
                  style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}
                  className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg"
                  form="settings-form"
                >
                  <option value="false">{language === 'ar' ? 'معطل' : (language === 'ku' ? 'ناچالاک' : 'Disabled')}</option>
                  <option value="true">{language === 'ar' ? 'مفعل' : (language === 'ku' ? 'چالاک' : 'Enabled')}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.managerPort}</label>
                <input
                  type="text"
                  value={tunnelPort}
                  onChange={(e) => setTunnelPort(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg font-mono"
                  placeholder="8787"
                  form="settings-form"
                />
              </div>
            </div>

            {(tunnelStatus?.url && tunnelStatus?.running) && (
              <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-lg flex flex-col gap-2 mt-4">
                <label className="font-semibold text-slate-400 flex items-center gap-1">
                  <Wifi size={12} className="text-blue-400" />
                  {t.tunnelUrl}
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={tunnelStatus.url}
                    className="bg-slate-950 border border-slate-800 text-blue-300 px-3 py-2 rounded-lg font-mono flex-1 outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(tunnelStatus.url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-300" />}
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center mt-3 bg-white p-2 rounded-xl self-center shadow-lg">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tunnelStatus.url)}`} alt="QR Code" width={150} height={150} className="rounded-md" />
                  <span className="text-slate-800 text-[10px] font-bold mt-1">امسح الكود بهاتفك</span>
                </div>
              </div>
            )}
            
            {tunnelStatus?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-[11px]">
                {tunnelStatus.error}
              </div>
            )}

            {/* Manual Tunnel Control */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                disabled={isConnecting}
                onClick={toggleTunnelState}
                className={`py-2 px-4 rounded-lg font-bold transition-all flex items-center gap-1.5 text-xs ${
                  tunnelStatus?.running 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                } ${isConnecting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {tunnelStatus?.running ? (
                  <>
                    <Square size={12} />
                    {language === 'ar' ? 'إيقاف البث' : (language === 'ku' ? 'وەستاندنی پەخش' : 'Stop Broadcast')}
                  </>
                ) : isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                    {language === 'ar' ? 'جاري بدء البث...' : (language === 'ku' ? 'پەخش دەستپێدەکات...' : 'Starting Broadcast...')}
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    {language === 'ar' ? 'بدء البث' : (language === 'ku' ? 'دەستپێکردنی پەخش' : 'Start Broadcast')}
                  </>
                )}
              </button>
            </div>
        </div>
      </div>

      {/* DATA BACKUP */}
      <div className="glass-card p-6 rounded-xl border border-slate-800 animate-fade-in">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-700/60 pb-3 mb-5">
          <Database size={15} className="text-cyan-300" />
          <span>{t.dataBackup}</span>
        </h3>

        <p className="text-xs text-slate-400 mb-5">{t.dataBackupDesc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{t.autoBackupEnabled}</p>
            <p className="mt-2 text-sm font-bold text-emerald-300">{t.autoBackupInterval}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{t.lastAutoBackup}</p>
            <p className="mt-2 text-sm font-semibold text-slate-200">{formatBackupDate(backupStatus?.lastAutoBackupAt ?? null)}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{t.lastManualBackup}</p>
            <p className="mt-2 text-sm font-semibold text-slate-200">{formatBackupDate(backupStatus?.lastManualBackupAt ?? null)}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{t.totalBackups}</p>
            <p className="mt-2 text-sm font-semibold text-slate-200">{backupStatus?.totalBackups ?? 0}</p>
          </div>
        </div>

        {backupStatus?.backupDir && (
          <div className="mb-5 rounded-xl border border-slate-700 bg-slate-900/50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">{t.backupFolder}</p>
            <p className="text-[11px] font-mono text-cyan-200 break-all">{backupStatus.backupDir}</p>
          </div>
        )}

        {backupMessage && (
          <div className={`mb-4 rounded-xl border px-3 py-2 text-xs font-semibold ${
            backupMessage === t.backupSuccess
              ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
              : 'border-rose-400/25 bg-rose-500/10 text-rose-200'
          }`}>
            {backupMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 px-5 rounded-xl font-bold transition-all hover-scale glow-teal active:scale-95 flex items-center gap-2 text-xs disabled:opacity-50"
          >
            {isBackingUp ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
                <span>{t.backingUp}</span>
              </>
            ) : (
              <>
                <HardDriveDownload size={14} />
                <span>{t.backupNow}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenBackupFolder}
            className="py-2.5 px-5 rounded-xl font-bold transition-all border border-white/10 bg-white/[0.04] text-slate-200 hover:border-cyan-400/30 hover:bg-cyan-500/10 flex items-center gap-2 text-xs"
          >
            <FolderOpen size={14} />
            <span>{t.openBackupFolder}</span>
          </button>
        </div>

        {backupStatus?.recentBackups?.length > 0 && (
          <div className="mt-6 border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-300 mb-3">{t.recentBackups}</h4>
            <div className="space-y-2">
              {backupStatus.recentBackups.slice(0, 5).map((file: any) => (
                <div
                  key={file.fullPath}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px]"
                >
                  <span className="font-mono text-slate-300 truncate">{file.fileName}</span>
                  <div className="flex items-center gap-3 shrink-0 text-slate-500">
                    <span>{formatFileSize(file.sizeBytes)}</span>
                    <span>{formatBackupDate(file.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-start pt-2">
        <button
          type="submit"
          form="settings-form"
          className="bg-primary text-primary-foreground hover:bg-teal-400 py-3 px-8 rounded-xl font-bold transition-all hover-scale glow-teal active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Sparkles size={14} />
          <span>{t.save}</span>
        </button>
      </div>

    </motion.div>
  );
};
