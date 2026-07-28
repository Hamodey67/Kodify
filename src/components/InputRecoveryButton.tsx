import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { recoverInputs } from '../utils/recoverInputs';

interface InputRecoveryButtonProps {
  focusSelector?: string;
  variant?: 'titlebar' | 'login' | 'modal';
  className?: string;
  onRecover?: () => void;
}

export const InputRecoveryButton: React.FC<InputRecoveryButtonProps> = ({
  focusSelector,
  variant = 'titlebar',
  className = '',
  onRecover,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [feedback, setFeedback] = useState(false);

  const handleRecover = () => {
    onRecover?.();
    recoverInputs(focusSelector);
    setFeedback(true);
    window.setTimeout(() => setFeedback(false), 2200);
  };

  const baseClasses =
    variant === 'titlebar'
      ? 'h-7 px-2.5 flex items-center gap-1.5 rounded-lg bg-white/[0.08] text-blue-200 hover:bg-white/[0.16] hover:text-white transition-colors'
      : variant === 'modal'
        ? 'inline-flex items-center gap-1.5 rounded-lg border border-[#e3e9f1] bg-[#fbfcfe] px-2.5 py-1.5 text-[10px] font-bold text-[#64748b] hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors'
        : 'inline-flex items-center gap-2 rounded-lg border border-[#e3e9f1] bg-[#fbfcfe] px-3 py-2 text-[11px] font-bold text-[#64748b] hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors';

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleRecover}
        title={t.refreshInputs}
        className={baseClasses}
      >
        <motion.span
          animate={feedback ? { rotate: -360 } : { rotate: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="inline-flex"
        >
          <RotateCcw size={variant === 'titlebar' ? 13 : variant === 'modal' ? 12 : 14} />
        </motion.span>
        {(variant === 'login' || variant === 'modal') && <span>{t.refreshInputs}</span>}
      </button>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg ${
              variant === 'titlebar'
                ? 'top-full mt-2 end-0'
                : variant === 'modal'
                  ? 'top-full mt-2 end-0'
                  : 'bottom-full mb-2 start-0'
            }`}
          >
            {t.inputsRefreshed}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
