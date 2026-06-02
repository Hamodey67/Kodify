import React, { useState } from 'react';
import { ShieldAlert, KeyRound, Copy, Check, Power } from 'lucide-react';
import { Logo } from '../components/Logo';

interface ActivationProps {
  machineId: string;
  onActivated: () => void;
}

export const Activation: React.FC<ActivationProps> = ({ machineId, onActivated }) => {
  const [activationKey, setActivationKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(machineId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationKey.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await window.api.activateLicense(activationKey.trim());
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onActivated();
        }, 1500);
      } else {
        setError(res.error || 'رمز التفعيل غير صحيح. يرجى مراجعة الموزع المعتمد.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع أثناء عملية التفعيل.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-900 font-sans p-6 overflow-y-auto">
      <div className="w-full max-w-lg glass-card border border-slate-700 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative overflow-hidden">
        {/* Background glow lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 blur-sm"></div>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size={55} className="glow-teal-strong shadow-lg rounded-2xl" />
          <h1 className="text-2xl font-black tracking-wider text-slate-100 mt-2">نظام كوديفاي | Kodify System</h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            <ShieldAlert size={12} />
            <span>تفعيل رخصة التشغيل | System Activation Required</span>
          </div>
        </div>

        <p className="text-slate-400 text-xs text-center leading-relaxed max-w-md mx-auto">
          مرحباً بك! هذا النظام محمي بموجب حقوق الملكية ويجب تفعيله للعمل على هذا الجهاز تحديداً. يرجى نسخ "معرف الجهاز" أدناه وإرساله للموزع المعتمد للحصول على مفتاح التفعيل.
        </p>

        {/* Machine ID Display Box */}
        <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl flex flex-col gap-2 relative">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            معرّف الجهاز الفريد | Unique Machine ID
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-black font-mono text-teal-400 tracking-widest uppercase select-all">
              {machineId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 bg-slate-900 border border-slate-700 hover:border-teal-500/40 text-slate-400 hover:text-teal-400 rounded-lg transition-all duration-200 shrink-0 flex items-center gap-1.5 active:scale-95 text-xs font-bold"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 text-[10px]">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span className="text-[10px]">نسخ | Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Activation Input Form */}
        <form onSubmit={handleActivate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              أدخل مفتاح التفعيل | Enter Activation Key
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                required
                disabled={isSubmitting || success}
                placeholder="ACT-XXXX-XXXX-XXXX-XXXX"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl py-3.5 pr-11 pl-4 text-center font-mono font-bold text-slate-200 tracking-wider placeholder-slate-600 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="shrink-0 mt-0.5" size={16} />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5">
              <Check className="shrink-0" size={16} />
              <span className="font-semibold">تم التفعيل بنجاح! جاري تشغيل النظام...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || success || !activationKey.trim()}
            className="w-full bg-primary hover:bg-primary/95 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700 text-primary-foreground font-black text-sm py-4 rounded-xl shadow-lg hover:shadow-primary/10 transition-all duration-200 flex items-center justify-center gap-2.5 glow-teal border border-teal-500/20 active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary-foreground border-r-2 border-slate-500"></div>
            ) : (
              <>
                <Power size={16} />
                <span>تفعيل ترخيص النظام | Activate System License</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Details */}
        <div className="text-center text-[10px] text-slate-500 flex flex-col gap-0.5 mt-2 border-t border-slate-800 pt-4">
          <span>&copy; {new Date().getFullYear()} نظام كوديفاي لنقاط البيع. جميع الحقوق محفوظة.</span>
          <span className="font-mono text-slate-600">Secure DRM Version 1.0.0</span>
        </div>
      </div>
    </div>
  );
};
