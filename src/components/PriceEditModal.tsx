import React, { useEffect, useState } from 'react';

interface PriceEditModalProps {
  isOpen: boolean;
  itemName: string;
  currentPrice: number;
  onClose: () => void;
  onSave: (newPrice: number, reason?: string) => Promise<boolean>;
}

const REASONS = ['خصم', 'تصحيح سعر', 'سعر خاص', 'أخرى'];

export const PriceEditModal: React.FC<PriceEditModalProps> = ({
  isOpen,
  itemName,
  currentPrice,
  onClose,
  onSave,
}) => {
  const [newPrice, setNewPrice] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewPrice(String(currentPrice));
      setReason('');
      setIsSaving(false);
    }
  }, [isOpen, currentPrice]);

  if (!isOpen) return null;

  const save = async () => {
    const parsed = Number(newPrice);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setIsSaving(true);
    const ok = await onSave(parsed, reason || undefined);
    if (!ok) setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 glass z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-200">تعديل سعر الصنف</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-right">
            <p className="text-xs text-slate-500 mb-1">الصنف</p>
            <p className="text-sm font-bold text-slate-200">{itemName}</p>
            <p className="text-xs text-slate-400 mt-1">السعر الحالي: {Math.round(currentPrice).toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">السعر الجديد</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">سبب التعديل (اختياري)</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-sm"
            >
              <option value="">اختر السبب</option>
              {REASONS.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="flex-1 bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
