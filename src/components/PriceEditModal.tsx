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
      <div className="bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-md overflow-hidden animate-fade-in">
        <div className="px-5 py-4 border-b border-[#e3e9f1] bg-[#f4f7fb] flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#18212f] flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-base">$</span>
            <span>{t.editItemPrice}</span>
          </h3>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] transition-colors">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className={`bg-[#f4f7fb] border border-[#e3e9f1] rounded-xl p-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-[#94a3b8] mb-1">{t.item}</p>
            <p className="text-sm font-bold text-[#18212f]">{itemName}</p>
            <p className="text-xs text-[#64748b] mt-1">{t.currentPrice}: {Math.round(currentPrice).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b]">{t.discountPercentage}</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={discountPercent}
                  onChange={(e) => handleDiscountPercentChange(e.target.value)}
                  className={`w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] py-2 text-sm outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${dir === 'rtl' ? 'pl-8 pr-3' : 'pr-8 pl-3'}`}
                  placeholder="0"
                />
                <span className={`absolute text-[#94a3b8] font-bold text-xs pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                  %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b]">{t.newPrice}</label>
              <input
                type="number"
                min={0}
                step="any"
                value={newPrice}
                onChange={(e) => handleNewPriceChange(e.target.value)}
                className="w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-sm outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748b]">{t.reasonForEdit}</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-sm outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
            >
              <option value="">{t.chooseReason}</option>
              {REASONS.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 -mx-5 -mb-5 mt-2 px-5 py-4 border-t border-[#e3e9f1] bg-[#f4f7fb]">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 bg-[#fbfcfe] border border-[#e3e9f1] hover:border-[#bfdbfe] hover:bg-[#eff6ff] text-[#64748b] hover:text-[#2563eb] py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="flex-1 bg-[#2563eb] text-white hover:bg-[#1d4ed8] py-2.5 rounded-xl text-xs font-bold transition-all active:translate-y-px disabled:bg-[#cbd5e1] disabled:opacity-100"
            >
              {isSaving ? t.saving : t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
