import React, { useRef, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { 
  RotateCw, 
  ExternalLink, 
  ShieldAlert,
  Loader2,
  Laptop
} from 'lucide-react';

export const WebAdmin: React.FC = () => {
  const { language, dir } = useLanguageStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const url = 'https://www.oneofonecosmetic.com/ar/admin/login';

  const handleRefresh = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank');
  };

  const handleOpenAppWindow = () => {
    if (window.api && window.api.openAdminWindow) {
      window.api.openAdminWindow(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#eef2f8]" dir={dir}>
      {/* Premium Glassmorphic Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#fbfcfe]/80 backdrop-blur-md border-b border-[#e3e9f1] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#18212f]">
              {language === 'ar' ? 'إدارة المتجر' : 'Store Admin'}
            </h1>
            <p className="text-[11px] font-medium text-[#64748b] font-mono">
              www.oneofonecosmetic.com/ar/admin/login
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            title={language === 'ar' ? 'إعادة تحميل' : 'Reload'}
            className="p-2.5 bg-[#fbfcfe] border border-[#e3e9f1] text-[#64748b] rounded-xl hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-all duration-150 active:translate-y-px"
          >
            <RotateCw size={16} />
          </button>

          <button
            onClick={handleOpenAppWindow}
            title={language === 'ar' ? 'فتح في نافذة تطبيق مستقلة' : 'Open in App Window'}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-all duration-150 text-xs font-bold shadow-[0_4px_12px_rgba(37,99,235,0.18)] active:translate-y-px"
          >
            <Laptop size={14} />
            <span>{language === 'ar' ? 'فتح في نافذة خاصة' : 'Open Dedicated Window'}</span>
          </button>
          
          <button
            onClick={handleOpenExternal}
            title={language === 'ar' ? 'فتح في المتصفح الخارجي' : 'Open in External Browser'}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#fbfcfe] border border-[#e3e9f1] text-[#64748b] rounded-xl hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-all duration-150 text-xs font-bold active:translate-y-px"
          >
            <ExternalLink size={14} />
            <span>{language === 'ar' ? 'فتح بالمتاصفح' : 'Open External'}</span>
          </button>
        </div>
      </div>

      {/* Main content frame with loader */}
      <div className="flex-1 w-full relative bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#eef2f8]/60 backdrop-blur-sm">
            <Loader2 size={36} className="text-[#2563eb] animate-spin" />
            <p className="mt-3 text-xs font-bold text-[#64748b]">
              {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading admin panel...'}
            </p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default WebAdmin;
