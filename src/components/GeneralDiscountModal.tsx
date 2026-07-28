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
      <div className="bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-md overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e3e9f1] bg-[#f4f7fb] flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#18212f] flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Percent size={16} />
            </span>
            <span>{localT.generalDiscount}</span>
          </h3>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Summary Box */}
          <div className={`bg-[#f4f7fb] border border-[#e3e9f1] rounded-xl p-3 space-y-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="flex justify-between text-xs text-[#64748b]">
              <span>{localT.originalTotal}:</span>
              <span className="font-bold text-[#334155] font-mono">{Math.round(itemsTotal).toLocaleString()} {t.currency}</span>
            </div>
            {calculatedDiscountAmount > 0 && (
              <div className="flex justify-between text-xs text-[#dc2626]">
                <span>{localT.calculatedDiscount}:</span>
                <span className="font-bold font-mono">-{Math.round(calculatedDiscountAmount).toLocaleString()} {t.currency}</span>
              </div>
            )}
            <div className="border-t border-[#e3e9f1] my-1 pt-1.5 flex justify-between text-sm font-extrabold text-[#2563eb]">
              <span>{localT.newTotal}:</span>
              <span className="font-mono">{Math.round(finalTotal).toLocaleString()} {t.currency}</span>
            </div>
          </div>

          {/* Type Selector (Tabs) */}
          <div className="space-y-2">
            <label className="text-xs text-[#64748b] font-bold">{localT.discountType}</label>
            <div className="grid grid-cols-2 gap-2 bg-[#f4f7fb] p-1 rounded-xl border border-[#e3e9f1]">
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  discountType === 'percent'
                    ? 'bg-[#fbfcfe] border border-[#bfdbfe] text-[#2563eb] shadow-[0_1px_2px_rgba(16,24,40,0.04)]'
                    : 'border border-transparent text-[#64748b] hover:text-[#18212f]'
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
                    ? 'bg-[#fbfcfe] border border-[#bfdbfe] text-[#2563eb] shadow-[0_1px_2px_rgba(16,24,40,0.04)]'
                    : 'border border-transparent text-[#64748b] hover:text-[#18212f]'
                }`}
              >
                <DollarSign size={12} />
                <span>{localT.flat}</span>
              </button>
            </div>
          </div>

          {/* Value Input */}
          <div className="space-y-2">
            <label className="text-xs text-[#64748b] font-bold">{localT.discountValue}</label>
            <div className="relative flex items-center">
              <input
                type="number"
                min={0}
                max={discountType === 'percent' ? 100 : itemsTotal}
                step="any"
                value={discountVal}
                onChange={(e) => setDiscountVal(e.target.value)}
                className={`w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] py-2.5 text-sm outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${dir === 'rtl' ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
                placeholder={localT.enterValue}
                autoFocus
              />
              <span className={`absolute text-[#94a3b8] font-bold text-xs pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`}>
                {discountType === 'percent' ? '%' : t.currency}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 -mx-5 -mb-5 mt-2 px-5 py-4 border-t border-[#e3e9f1] bg-[#f4f7fb]">
            <button
              onClick={onClose}
              className="flex-1 bg-[#fbfcfe] border border-[#e3e9f1] hover:border-[#bfdbfe] hover:bg-[#eff6ff] text-[#64748b] hover:text-[#2563eb] py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-[#2563eb] text-white hover:bg-[#1d4ed8] py-2.5 rounded-xl text-xs font-bold transition-all active:translate-y-px"
            >
              {t.save}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
