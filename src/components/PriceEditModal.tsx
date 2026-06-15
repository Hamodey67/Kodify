import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';

interface PriceEditModalProps {
  isOpen: boolean;
  itemName: string;
  currentPrice: number;
  onClose: () => void;
  onSave: (newPrice: number, reason?: string) => Promise<boolean>;
}

export const PriceEditModal: React.FC<PriceEditModalProps> = ({
  isOpen,
  itemName,
  currentPrice,
  onClose,
  onSave,
}) => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  const REASONS = [t.discountReason, t.priceCorrection, t.specialPrice, t.otherReason];

  const [newPrice, setNewPrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('0');
  const [reason, setReason] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewPrice(String(currentPrice));
      setDiscountPercent('0');
      setReason('');
      setIsSaving(false);
    }
  }, [isOpen, currentPrice]);

  if (!isOpen) return null;

  const handleDiscountPercentChange = (val: string) => {
    setDiscountPercent(val);
    if (val === '') {
      setNewPrice('');
      return;
    }
    const pct = Number(val);
    if (!Number.isNaN(pct) && pct >= 0 && pct <= 100) {
      const calculatedPrice = currentPrice * (1 - pct / 100);
      setNewPrice(String(Math.round(calculatedPrice)));
      if (!reason || reason === '') {
        setReason(t.discountReason);
      }
    }
  };

  const handleNewPriceChange = (val: string) => {
    setNewPrice(val);
    if (val === '') {
      setDiscountPercent('');
      return;
    }
    const priceVal = Number(val);
    if (!Number.isNaN(priceVal) && priceVal >= 0 && currentPrice > 0) {
      const calculatedPct = ((currentPrice - priceVal) / currentPrice) * 100;
      setDiscountPercent(String(Math.max(0, Math.round(calculatedPct * 100) / 100)));
    } else {
      setDiscountPercent('');
    }
  };

  const save = async () => {
    const parsed = Number(newPrice);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setIsSaving(true);
    const ok = await onSave(parsed, reason || undefined);
    if (!ok) setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 glass z-[100] flex items-center justify-center p-4" dir={dir}>
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-200">{t.editItemPrice}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className={`bg-slate-900/60 border border-slate-700 rounded-xl p-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <p className="text-xs text-slate-500 mb-1">{t.item}</p>
            <p className="text-sm font-bold text-slate-200">{itemName}</p>
            <p className="text-xs text-slate-400 mt-1">{t.currentPrice}: {Math.round(currentPrice).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">{t.discountPercentage}</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={discountPercent}
                  onChange={(e) => handleDiscountPercentChange(e.target.value)}
                  className={`w-full bg-slate-900 border border-slate-700 text-slate-200 py-2 rounded-xl text-sm outline-none focus:border-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${dir === 'rtl' ? 'pl-8 pr-3' : 'pr-8 pl-3'}`}
                  placeholder="0"
                />
                <span className={`absolute text-slate-500 font-bold text-xs pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                  %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">{t.newPrice}</label>
              <input
                type="number"
                min={0}
                step="any"
                value={newPrice}
                onChange={(e) => handleNewPriceChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">{t.reasonForEdit}</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-teal-500"
            >
              <option value="">{t.chooseReason}</option>
              {REASONS.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="flex-1 bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {isSaving ? t.saving : t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
