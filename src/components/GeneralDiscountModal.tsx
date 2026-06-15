import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { Percent, DollarSign } from 'lucide-react';

interface GeneralDiscountModalProps {
  isOpen: boolean;
  currentDiscount: number;
  currentDiscountType: 'percent' | 'flat';
  itemsTotal: number;
  onClose: () => void;
  onSave: (discount: number, type: 'percent' | 'flat') => void;
}

export const GeneralDiscountModal: React.FC<GeneralDiscountModalProps> = ({
  isOpen,
  currentDiscount,
  currentDiscountType,
  itemsTotal,
  onClose,
  onSave,
}) => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  // Local translations fallback if keys don't exist in translations.ts yet
  const localT = {
    ar: {
      generalDiscount: 'الخصم العام للفاتورة',
      discountType: 'نوع الخصم',
      percent: 'نسبة مئوية (%)',
      flat: 'مبلغ ثابت (د.ع)',
      discountValue: 'قيمة الخصم',
      calculatedDiscount: 'قيمة الخصم المحسوبة',
      newTotal: 'المجموع بعد الخصم',
      originalTotal: 'المجموع قبل الخصم',
      enterValue: 'أدخل القيمة...',
    },
    en: {
      generalDiscount: 'General Invoice Discount',
      discountType: 'Discount Type',
      percent: 'Percentage (%)',
      flat: 'Flat Amount (IQD)',
      discountValue: 'Discount Value',
      calculatedDiscount: 'Calculated Discount',
      newTotal: 'Total After Discount',
      originalTotal: 'Total Before Discount',
      enterValue: 'Enter value...',
    },
    ku: {
      generalDiscount: 'داشکاندنی گشتی پسوولە',
      discountType: 'جۆری داشکاندن',
      percent: 'ڕێژەی داشکاندن (%)',
      flat: 'بڕی داشکاندن (د.ع)',
      discountValue: 'نرخی داشکاندن',
      calculatedDiscount: 'داشکاندنی ئەژمارکراو',
      newTotal: 'کۆی گشتی نوێ',
      originalTotal: 'کۆی گشتی پێش داشکاندن',
      enterValue: 'نرخ بنووسە...',
    }
  }[language] || {
    generalDiscount: 'General Invoice Discount',
    discountType: 'Discount Type',
    percent: 'Percentage (%)',
    flat: 'Flat Amount (IQD)',
    discountValue: 'Discount Value',
    calculatedDiscount: 'Calculated Discount',
    newTotal: 'Total After Discount',
    originalTotal: 'Total Before Discount',
    enterValue: 'Enter value...',
  };

  const [discountVal, setDiscountVal] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');

  useEffect(() => {
    if (isOpen) {
      setDiscountVal(currentDiscount > 0 ? String(currentDiscount) : '');
      setDiscountType(currentDiscountType || 'percent');
    }
  }, [isOpen, currentDiscount, currentDiscountType]);

  if (!isOpen) return null;

  const numVal = Number(discountVal) || 0;

  // Live calculations
  let calculatedDiscountAmount = 0;
  if (discountType === 'percent') {
    calculatedDiscountAmount = (itemsTotal * Math.min(100, Math.max(0, numVal))) / 100;
  } else {
    calculatedDiscountAmount = Math.min(itemsTotal, Math.max(0, numVal));
  }
  const finalTotal = Math.max(0, itemsTotal - calculatedDiscountAmount);

  const handleSave = () => {
    const finalVal = Math.max(0, Number(discountVal) || 0);
    if (discountType === 'percent') {
      onSave(Math.min(100, finalVal), 'percent');
    } else {
      onSave(Math.min(itemsTotal, finalVal), 'flat');
    }
  };

  return (
    <div className="fixed inset-0 glass z-[100] flex items-center justify-center p-4" dir={dir}>
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-200">{localT.generalDiscount}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          
          {/* Summary Box */}
          <div className={`bg-slate-900/60 border border-slate-700 rounded-xl p-3 space-y-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{localT.originalTotal}:</span>
              <span className="font-bold text-slate-300 font-mono">{Math.round(itemsTotal).toLocaleString()} {t.currency}</span>
            </div>
            {calculatedDiscountAmount > 0 && (
              <div className="flex justify-between text-xs text-rose-400">
                <span>{localT.calculatedDiscount}:</span>
                <span className="font-bold font-mono">-{Math.round(calculatedDiscountAmount).toLocaleString()} {t.currency}</span>
              </div>
            )}
            <div className="border-t border-slate-700/60 my-1 pt-1.5 flex justify-between text-sm font-extrabold text-teal-400">
              <span>{localT.newTotal}:</span>
              <span className="font-mono">{Math.round(finalTotal).toLocaleString()} {t.currency}</span>
            </div>
          </div>

          {/* Type Selector (Tabs) */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold">{localT.discountType}</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  discountType === 'percent'
                    ? 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Percent size={12} />
                <span>{localT.percent}</span>
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('flat')}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  discountType === 'flat'
                    ? 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <DollarSign size={12} />
                <span>{localT.flat}</span>
              </button>
            </div>
          </div>

          {/* Value Input */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold">{localT.discountValue}</label>
            <div className="relative flex items-center">
              <input
                type="number"
                min={0}
                max={discountType === 'percent' ? 100 : itemsTotal}
                step="any"
                value={discountVal}
                onChange={(e) => setDiscountVal(e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700 text-slate-200 py-2.5 rounded-xl text-sm outline-none focus:border-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${dir === 'rtl' ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
                placeholder={localT.enterValue}
                autoFocus
              />
              <span className={`absolute text-slate-500 font-bold text-xs pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`}>
                {discountType === 'percent' ? '%' : t.currency}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 rounded-xl text-xs font-bold transition-all glow-teal"
            >
              {t.save}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
