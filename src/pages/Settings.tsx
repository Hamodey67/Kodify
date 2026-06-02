import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../utils/translations';
import { 
  Building, 
  Printer, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Settings: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language];
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

  useEffect(() => {
    fetchSettings();
  }, []);

  // Sync settings when loaded
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setStoreNameAr(settings['store_name_ar'] || '');
      setStoreNameEn(settings['store_name_en'] || '');
      setStoreAddress(settings['store_address'] || '');
      setStorePhone(settings['store_phone'] || '');
      setStoreTaxNumber(settings['store_tax_number'] || '');
      setMockHardware(settings['hardware_mock_mode'] || 'true');
      setPrinterConnection(settings['hardware_printer_ip'] || '192.168.1.100');
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
    };

    const success = await saveSettings(payload);
    if (success) {
      alert(t.success);
    } else {
      alert(t.error);
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

      {/* STORE PROFILE SETTINGS */}
      <div className="glass-card p-6 rounded-xl border border-slate-800 max-w-2xl animate-fade-in">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-700/60 pb-3 mb-5">
          <Building size={15} className="text-indigo-400" />
          <span>{t.storeSettings}</span>
        </h3>

        <form onSubmit={handleStoreSettingsSubmit} className="space-y-4 text-xs">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-700">
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

          {user?.role === 'admin' && (
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-teal-400 py-3 px-6 rounded-xl font-bold transition-all hover-scale glow-teal active:scale-95 flex items-center justify-center gap-1"
            >
              <Sparkles size={14} />
              <span>{t.save}</span>
            </button>
          )}
        </form>
      </div>

    </motion.div>
  );
};
