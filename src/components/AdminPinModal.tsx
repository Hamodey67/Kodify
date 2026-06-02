import React, { useEffect, useMemo, useState } from 'react';
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
    <div className="fixed inset-0 glass z-50 flex items-center justify-center p-4" dir={dir}>
      <div className={`bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in ${shouldShake ? 'animate-shake' : ''}`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-200">{t.enterSupervisorPin}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center">
            <p className="text-xs text-slate-400">{t.pleaseEnter4DigitPin}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {pinSlots.map((slot) => (
              <div
                key={slot}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xl ${
                  pin.length > slot ? 'border-teal-500 text-teal-400' : 'border-slate-700 text-slate-600'
                }`}
              >
                {pin.length > slot ? '•' : ''}
              </div>
            ))}
          </div>

          {isLocked ? (
            <p className="text-xs text-center text-amber-400">
              {t.pinLockedTryIn.replace('{seconds}', String(lockSecondsLeft))}
            </p>
          ) : errorMessage ? (
            <p className="text-xs text-center text-rose-400">{errorMessage}</p>
          ) : (
            <p className="text-xs text-center text-slate-500">{t.itemPriceProtected}</p>
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
            <button onClick={clearPin} disabled={isLocked || isSubmitting} className="numpad-btn text-sm disabled:opacity-40">{t.clear}</button>
            <button onClick={() => appendDigit('0')} disabled={isLocked || isSubmitting} className="numpad-btn disabled:opacity-40">0</button>
            <button onClick={removeDigit} disabled={isLocked || isSubmitting} className="numpad-btn text-sm disabled:opacity-40">{t.delete}</button>
          </div>

          <button
            onClick={submitPin}
            disabled={isLocked || isSubmitting || pin.length !== 4}
            className="w-full bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? t.verifying : t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

