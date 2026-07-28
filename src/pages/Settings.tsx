import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../utils/translations';
import { 
  Building, 
  Printer, 
  Save,
  Smartphone,
  Wifi,
  Copy,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  Database,
  FolderOpen,
  HardDriveDownload,
  Globe
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

  // Supabase Online Store Configuration
  const [supabaseEnabled, setSupabaseEnabled] = useState('true');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; message: string } | null>(null);

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

      setSupabaseEnabled(settings['supabase_enabled'] || 'true');
      setSupabaseUrl(settings['supabase_url'] || 'https://zutqverlqobsrmodlqwq.supabase.co');
      setSupabaseKey(settings['supabase_service_role_key'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dHF2ZXJscW9ic3Jtb2RscXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTAwNDM2MiwiZXhwIjoyMTAwNTgwMzYyfQ.w1Kq8xae0csl62hroWHD8BIXz4db9GLvRMSqGZu1NCM');
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
      'supabase_enabled': supabaseEnabled,
      'supabase_url': supabaseUrl,
      'supabase_service_role_key': supabaseKey,
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

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    try {
      if (window.api && window.api.testSupabaseConnection) {
        const res = await window.api.testSupabaseConnection(supabaseUrl, supabaseKey);
        setSupabaseTestResult(res);
      }
    } catch (err: any) {
      setSupabaseTestResult({ success: false, message: err?.message || 'تعذر الاتصال' });
    } finally {
      setTestingSupabase(false);
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

  const inputBase =
    'w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3 py-2.5 text-[#18212f] outline-none transition-all duration-150 placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]';
  const labelBase = 'font-bold text-[#334155]';
  const cardBase = 'rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]';
  const sectionHeading = 'mb-5 flex items-center gap-2 border-b border-[#e8edf4] pb-3 text-sm font-bold text-[#18212f]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#eef2f8] space-y-6"
    >
      
      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18212f]">{t.settings}</h1>
          <p className="text-xs font-medium text-[#64748b] mt-1">
            {language === 'ar' ? 'إعدادات النظام وأجهزة الطابعات الخاصة بالمتجر' : 'Configure POS terminals, printers and store information'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* STORE PROFILE SETTINGS */}
        <div className={cardBase}>
          <h3 className={sectionHeading}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building size={16} />
            </span>
            <span>{t.storeSettings}</span>
          </h3>

          <form id="settings-form" onSubmit={handleStoreSettingsSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>{t.storeNameEn}</label>
                <input
                  type="text"
                  value={storeNameEn}
                  onChange={(e) => setStoreNameEn(e.target.value)}
                  className={inputBase}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>{t.phone}</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className={`${inputBase} font-mono`}
                  required
                />
              </div>
            </div>

            <div className="border-t border-[#e8edf4] my-4"></div>
            
            <h4 className="font-bold text-[#334155] text-xs flex items-center gap-1.5 mb-2">
              <Printer size={13} className="text-blue-600" />
              <span>{t.printerSettings}</span>
            </h4>

            <div className="grid grid-cols-1 gap-4 bg-[#f4f7fb] p-4 rounded-xl border border-[#e3e9f1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>{t.mockHardwareMode}</label>
                <select
                  value={mockHardware}
                  onChange={(e) => setMockHardware(e.target.value)}
                  className={`${inputBase} cursor-pointer`}
                >
                  <option value="true">{language === 'ar' ? 'نعم (محاكاة وحفظ كملف نصي)' : 'Yes (Mock - Save receipt as text)'}</option>
                  <option value="false">{language === 'ar' ? 'لا (طابعة فعلية ESC/POS)' : 'No (Connect to physical ESC/POS)'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>{t.printerConnection} (IP address)</label>
                <input
                  type="text"
                  value={printerConnection}
                  onChange={(e) => setPrinterConnection(e.target.value)}
                  className={`${inputBase} font-mono`}
                  placeholder="192.168.1.100"
                />
              </div>
            </div>
          </form>
        </div>

        {/* MOBILE APP TUNNEL SETTINGS */}
        <div className={`${cardBase} flex flex-col gap-4`}>
          <h3 className={`${sectionHeading} justify-between mb-1`}>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Smartphone size={16} />
              </span>
              <span>{t.mobileAppAccess}</span>
            </div>
            
            {tunnelStatus && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ring-1 ${tunnelStatus.running ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-rose-50 text-rose-600 ring-rose-200'}`}>
                {tunnelStatus.running ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {tunnelStatus.running ? t.tunnelRunning : t.tunnelStopped}
              </div>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>{t.enableMobileApp}</label>
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
                  className={`${inputBase} cursor-pointer text-xs`}
                  form="settings-form"
                >
                  <option value="false">{language === 'ar' ? 'معطل' : (language === 'ku' ? 'ناچالاک' : 'Disabled')}</option>
                  <option value="true">{language === 'ar' ? 'مفعل' : (language === 'ku' ? 'چالاک' : 'Enabled')}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>{t.managerPort}</label>
                <input
                  type="text"
                  value={tunnelPort}
                  onChange={(e) => setTunnelPort(e.target.value)}
                  className={`${inputBase} font-mono text-xs`}
                  placeholder="8787"
                  form="settings-form"
                />
              </div>
            </div>

            {(tunnelStatus?.url && tunnelStatus?.running) && (
              <div className="bg-[#f4f7fb] border border-[#e3e9f1] p-3 rounded-xl flex flex-col gap-2 mt-4">
                <label className={`${labelBase} flex items-center gap-1`}>
                  <Wifi size={12} className="text-blue-600" />
                  {t.tunnelUrl}
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={tunnelStatus.url}
                    className="bg-[#fbfcfe] border border-[#e3e9f1] text-[#2563eb] px-3 py-2 rounded-xl font-mono flex-1 outline-none text-xs"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(tunnelStatus.url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-[#fbfcfe] border border-[#e3e9f1] hover:border-[#bfdbfe] hover:bg-[#eff6ff] p-2 rounded-xl transition-colors"
                    title="Copy URL"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} className="text-[#64748b]" />}
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center mt-3 bg-[#fbfcfe] border border-[#e3e9f1] p-2 rounded-xl self-center shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tunnelStatus.url)}`} alt="QR Code" width={150} height={150} className="rounded-md" />
                  <span className="text-[#334155] text-[10px] font-bold mt-1">امسح الكود بهاتفك</span>
                </div>
              </div>
            )}
            
            {tunnelStatus?.error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-[11px] font-semibold">
                {tunnelStatus.error}
              </div>
            )}

            {/* Manual Tunnel Control */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                disabled={isConnecting}
                onClick={toggleTunnelState}
                className={`py-2 px-4 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ring-1 ${
                  tunnelStatus?.running 
                    ? 'bg-rose-50 text-rose-600 ring-rose-200 hover:bg-rose-100' 
                    : 'bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100'
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

      {/* ONLINE STORE SYNC */}
      <div className={cardBase}>
        <h3 className={sectionHeading}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Globe size={16} />
          </span>
          <span>ربط المتجر الإلكتروني</span>
        </h3>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>حالة الربط أونلاين</label>
              <select
                value={supabaseEnabled}
                onChange={(e) => setSupabaseEnabled(e.target.value)}
                className={`${inputBase} cursor-pointer text-xs`}
                form="settings-form"
              >
                <option value="true">مفعل (تلقي الطلبات أونلاين 🌐)</option>
                <option value="false">معطل</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>عنوان الخادم السحابي</label>
              <input
                type="password"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className={`${inputBase} font-mono dir-ltr text-left text-xs`}
                placeholder="••••••••••••••••"
                form="settings-form"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>مفتاح الوصول</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className={`${inputBase} font-mono dir-ltr text-left text-xs`}
              placeholder="••••••••••••••••"
              form="settings-form"
            />
          </div>

          {supabaseTestResult && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ring-1 ${
                supabaseTestResult.success
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                  : 'bg-rose-50 text-rose-600 ring-rose-200'
              }`}
            >
              {supabaseTestResult.success ? (
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <XCircle size={16} className="text-rose-600 flex-shrink-0" />
              )}
              <span>{supabaseTestResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              disabled={testingSupabase}
              onClick={handleTestSupabase}
              className="py-2 px-4 bg-[#fbfcfe] hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] border border-[#e3e9f1] rounded-xl font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {testingSupabase ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                  <span>جاري اختبار الاتصال...</span>
                </>
              ) : (
                <>
                  <Wifi size={14} />
                  <span>اختبار الاتصال</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DATA BACKUP */}
      <div className={cardBase}>
        <h3 className={sectionHeading}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Database size={16} />
          </span>
          <span>{t.dataBackup}</span>
        </h3>

        <p className="text-xs text-[#64748b] mb-5">{t.dataBackupDesc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">{t.autoBackupEnabled}</p>
            <p className="mt-2 text-sm font-bold text-emerald-700">{t.autoBackupInterval}</p>
          </div>
          <div className="rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">{t.lastAutoBackup}</p>
            <p className="mt-2 text-sm font-semibold text-[#18212f]">{formatBackupDate(backupStatus?.lastAutoBackupAt ?? null)}</p>
          </div>
          <div className="rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">{t.lastManualBackup}</p>
            <p className="mt-2 text-sm font-semibold text-[#18212f]">{formatBackupDate(backupStatus?.lastManualBackupAt ?? null)}</p>
          </div>
          <div className="rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">{t.totalBackups}</p>
            <p className="mt-2 text-sm font-semibold text-[#18212f]">{backupStatus?.totalBackups ?? 0}</p>
          </div>
        </div>

        {backupStatus?.backupDir && (
          <div className="mb-5 rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-1">{t.backupFolder}</p>
            <p className="text-[11px] font-mono text-[#2563eb] break-all">{backupStatus.backupDir}</p>
          </div>
        )}

        {backupMessage && (
          <div className={`mb-4 rounded-xl border px-3 py-2 text-xs font-semibold ${
            backupMessage === t.backupSuccess
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-600'
          }`}>
            {backupMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 px-5 rounded-xl font-bold transition-all duration-150 active:translate-y-px shadow-[0_8px_20px_rgba(37,99,235,0.24)] flex items-center gap-2 text-xs disabled:bg-[#cbd5e1] disabled:shadow-none"
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
            className="py-2.5 px-5 rounded-xl font-bold transition-colors border border-[#e3e9f1] bg-[#fbfcfe] text-[#64748b] hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] flex items-center gap-2 text-xs"
          >
            <FolderOpen size={14} />
            <span>{t.openBackupFolder}</span>
          </button>
        </div>

        {backupStatus?.recentBackups?.length > 0 && (
          <div className="mt-6 border-t border-[#e8edf4] pt-4">
            <h4 className="text-xs font-bold text-[#334155] mb-3">{t.recentBackups}</h4>
            <div className="space-y-2">
              {backupStatus.recentBackups.slice(0, 5).map((file: any) => (
                <div
                  key={file.fullPath}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] px-3 py-2 text-[11px]"
                >
                  <span className="font-mono text-[#334155] truncate">{file.fileName}</span>
                  <div className="flex items-center gap-3 shrink-0 text-[#94a3b8]">
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
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 px-8 rounded-xl font-bold transition-all duration-150 active:translate-y-px shadow-[0_8px_20px_rgba(37,99,235,0.24)] flex items-center justify-center gap-1.5"
        >
          <Save size={14} />
          <span>{t.save}</span>
        </button>
      </div>

    </motion.div>
  );
};
