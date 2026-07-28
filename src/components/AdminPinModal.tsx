import React, { useEffect, useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => Promise<boolean>;
  isLocked: boolean;
  lockSecondsLeft: number;
  errorMessage: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  isLocked,
  lockSecondsLeft,
  errorMessage,
}) => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setIsSubmitting(false);
      setShouldShake(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (errorMessage) {
      setShouldShake(true);
      const timer = window.setTimeout(() => setShouldShake(false), 350);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [errorMessage]);

  const pinSlots = useMemo(() => [0, 1, 2, 3], []);

  if (!isOpen) return null;

  const appendDigit = (digit: string) => {
    if (isLocked || isSubmitting) return;
    setPin((prev) => (prev.length >= 4 ? prev : prev + digit));
  };

  const removeDigit = () => {
    if (isLocked || isSubmitting) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const clearPin = () => {
    if (isLocked || isSubmitting) return;
    setPin('');
  };

  const submitPin = async () => {
    if (isLocked || isSubmitting || pin.length !== 4) return;
    setIsSubmitting(true);
    const ok = await onVerify(pin);
    if (!ok) {
      setPin('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 glass z-[100] flex items-center justify-center p-4" dir={dir}>
      <div className={`bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-sm overflow-hidden animate-fade-in ${shouldShake ? 'animate-shake' : ''}`}>
        <div className="px-5 py-4 border-b border-[#e3e9f1] bg-[#f4f7fb] flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#18212f] flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Lock size={16} />
            </span>
            <span>{t.enterSupervisorPin}</span>
          </h3>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] transition-colors">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <p className="text-xs font-medium text-[#64748b]">{t.pleaseEnter4DigitPin}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {pinSlots.map((slot) => (
              <div
                key={slot}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xl ${
                  pin.length > slot ? 'border-[#2563eb] text-[#2563eb] bg-blue-50' : 'border-[#e3e9f1] text-[#cbd5e1] bg-[#fbfcfe]'
                }`}
              >
                {pin.length > slot ? '•' : ''}
              </div>
            ))}
          </div>

          {isLocked ? (
            <p className="text-xs text-center font-semibold text-[#b45309]">
              {t.pinLockedTryIn.replace('{seconds}', String(lockSecondsLeft))}
            </p>
          ) : errorMessage ? (
            <p className="text-xs text-center font-semibold text-[#dc2626]">{errorMessage}</p>
          ) : (
            <p className="text-xs text-center text-[#94a3b8]">{t.itemPriceProtected}</p>
          )}

          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => appendDigit(digit)}
                disabled={isLocked || isSubmitting}
                className="numpad-btn disabled:opacity-40"
              >
                {digit}
              </button>
            ))}
            <button onClick={clearPin} disabled={isLocked || isSubmitting} className="numpad-btn text-sm !border-rose-200 !bg-rose-50 !text-[#dc2626] hover:!border-rose-300 hover:!bg-rose-100 disabled:opacity-40">{t.clear}</button>
            <button onClick={() => appendDigit('0')} disabled={isLocked || isSubmitting} className="numpad-btn disabled:opacity-40">0</button>
            <button onClick={removeDigit} disabled={isLocked || isSubmitting} className="numpad-btn text-sm !border-rose-200 !bg-rose-50 !text-[#dc2626] hover:!border-rose-300 hover:!bg-rose-100 disabled:opacity-40">{t.delete}</button>
          </div>

          <button
            onClick={submitPin}
            disabled={isLocked || isSubmitting || pin.length !== 4}
            className="w-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] py-2.5 rounded-xl text-xs font-bold transition-all active:translate-y-px disabled:bg-[#cbd5e1] disabled:pointer-events-none"
          >
            {isSubmitting ? t.verifying : t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

