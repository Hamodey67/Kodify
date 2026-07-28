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
    <div className="flex h-screen w-screen items-center justify-center overflow-y-auto bg-[#eef2f8] p-6 font-sans">
      <div className="relative flex w-full max-w-lg flex-col gap-6 overflow-hidden rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(155deg,#0b2455_0%,#12408f_55%,#1d4ed8_100%)]" />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#e3e9f1] bg-[#f4f7fb]">
            <Logo size={40} />
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#18212f]">
            نظام كوديفاي | Kodify System
          </h1>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-[#fffbeb] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#b45309] ring-1 ring-amber-200">
            <ShieldAlert size={12} />
            <span>تفعيل رخصة التشغيل | System Activation Required</span>
          </div>
        </div>

        <p className="mx-auto max-w-md text-center text-xs leading-relaxed text-[#64748b]">
          مرحباً بك! هذا النظام محمي بموجب حقوق الملكية ويجب تفعيله للعمل على هذا الجهاز تحديداً. يرجى نسخ
          &quot;معرف الجهاز&quot; أدناه وإرساله للموزع المعتمد للحصول على مفتاح التفعيل.
        </p>

        <div className="relative flex flex-col gap-2 rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
            معرّف الجهاز الفريد | Unique Machine ID
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="select-all font-mono text-lg font-black uppercase tracking-widest text-[#2563eb]">
              {machineId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e3e9f1] bg-[#fbfcfe] p-2 text-xs font-bold text-[#64748b] transition-colors hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] active:translate-y-px"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-[10px] text-[#047857]">تم النسخ!</span>
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

        <form onSubmit={handleActivate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
              أدخل مفتاح التفعيل | Enter Activation Key
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
              <input
                type="text"
                required
                disabled={isSubmitting || success}
                placeholder="ACT-XXXX-XXXX-XXXX-XXXX"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                className="w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] py-3.5 pl-4 pr-11 text-center font-mono font-bold tracking-wider text-[#18212f] transition-all placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-[#fff1f2] px-4 py-3 text-xs text-[#dc2626]">
              <ShieldAlert className="mt-0.5 shrink-0" size={16} />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-[#ecfdf5] px-4 py-3 text-xs text-[#047857]">
              <Check className="shrink-0" size={16} />
              <span className="font-semibold">تم التفعيل بنجاح! جاري تشغيل النظام...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || success || !activationKey.trim()}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#2563eb] py-3.5 text-sm font-black text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)] transition-all hover:bg-[#1d4ed8] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#cbd5e1] disabled:text-white disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            ) : (
              <>
                <Power size={16} />
                <span>تفعيل ترخيص النظام | Activate System License</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-1 flex flex-col gap-0.5 border-t border-[#e3e9f1] pt-4 text-center text-[10px] text-[#94a3b8]">
          <span>&copy; {new Date().getFullYear()} نظام كوديفاي لنقاط البيع. جميع الحقوق محفوظة.</span>
          <span className="font-mono text-[#94a3b8]">SECURE DRM · v1.0.0</span>
        </div>
      </div>
    </div>
  );
};
