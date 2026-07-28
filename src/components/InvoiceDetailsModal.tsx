import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Undo2, AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { AdminPinModal } from './AdminPinModal';

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
  onItemReturned: () => void;
}

export const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
  isOpen,
  onClose,
  sale,
  onItemReturned
}) => {
  const { language, dir } = useLanguageStore();
  const { user } = useAuthStore();
  
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [returnItemTarget, setReturnItemTarget] = useState<any>(null);
  const [returnQty, setReturnQty] = useState(1);
  
  // PIN Verification
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);
  const isPinLocked = !!lockedUntil && lockedUntil > Date.now();

  useEffect(() => {
    if (!lockedUntil) {
      setLockSecondsLeft(0);
      return undefined;
    }
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockSecondsLeft(remaining);
      if (remaining <= 0) {
        setLockedUntil(null);
        setPinError('');
        setFailedAttempts(0);
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [lockedUntil]);

  const loadItems = async () => {
    if (!sale) return;
    setIsLoading(true);
    try {
      const fetchedItems = await window.api.getSaleItems(sale.id);
      setItems(fetchedItems);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && sale) {
      loadItems();
      setReturnItemTarget(null);
      setReturnQty(1);
    }
  }, [isOpen, sale]);

  const handleInitiateReturn = (item: any) => {
    setReturnItemTarget(item);
    setReturnQty(1);
  };

  const cancelReturn = () => {
    setReturnItemTarget(null);
    setReturnQty(1);
  };

  const confirmReturn = () => {
    if (!returnItemTarget) return;
    if (returnQty < 1 || returnQty > returnItemTarget.quantity) {
      alert(language === 'ar' ? 'الكمية غير صحيحة' : 'Invalid quantity');
      return;
    }
    
    if (user?.role === 'admin') {
      executeReturn();
    } else {
      setPinError('');
      setIsPinModalOpen(true);
    }
  };

  const executeReturn = async () => {
    if (!sale || !returnItemTarget) return;
    
    try {
      const result = await window.api.returnSaleItem(sale.id, returnItemTarget.id, returnQty);
      if (result.success) {
        alert(language === 'ar' ? 'تم استرجاع المنتج بنجاح' : 'Item returned successfully');
        onItemReturned(); // Trigger refresh in parent
        setReturnItemTarget(null);
        loadItems(); // Refresh items in this modal
      } else {
        alert((language === 'ar' ? 'خطأ: ' : 'Error: ') + result.error);
      }
    } catch (err: any) {
      console.error('Failed to return item:', err);
      alert((language === 'ar' ? 'خطأ: ' : 'Error: ') + err.message);
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    if (isPinLocked) {
      setPinError(language === 'ar' ? 'تم قفل الإدخال مؤقتاً' : 'Entry locked temporarily');
      return false;
    }

    const valid = await window.api.verifyAdminPin(pin);
    if (valid) {
      setPinError('');
      setFailedAttempts(0);
      setIsPinModalOpen(false);
      executeReturn();
      return true;
    }

    const nextFailedAttempts = failedAttempts + 1;
    setFailedAttempts(nextFailedAttempts);
    setPinError(language === 'ar' ? 'رمز PIN غير صحيح' : 'Incorrect PIN');

    if (nextFailedAttempts >= 3) {
      setLockedUntil(Date.now() + 30_000);
      setPinError(
        language === 'ar'
          ? 'تم تجاوز الحد المسموح. المحاولة متاحة بعد 30 ثانية'
          : 'Too many attempts. Try again in 30 seconds'
      );
    }

    return false;
  };

  if (!isOpen || !sale) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#fbfcfe] rounded-2xl shadow-[0_24px_60px_rgba(15,23,42,0.12)] border border-[#e3e9f1] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#e3e9f1] bg-[#f4f7fb] shrink-0">
            <div>
              <h3 className="text-sm font-extrabold text-[#18212f] flex items-center gap-2">
                <span>{language === 'ar' ? 'تفاصيل الفاتورة' : 'Invoice Details'}</span>
                <span className="font-mono text-blue-600">#{sale.invoiceNumber}</span>
              </h3>
              <p className="text-xs font-medium text-[#64748b] mt-1">
                {language === 'ar' ? 'إدارة واسترجاع المنتجات من هذه الفاتورة' : 'Manage and return items from this invoice'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-[#fbfcfe]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#64748b] gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2563eb] border-r-2 border-[#e3e9f1]"></div>
                <p className="text-sm">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-[#94a3b8]">
                {language === 'ar' ? 'لا توجد منتجات في هذه الفاتورة' : 'No items found in this invoice'}
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="bg-[#fbfcfe] border border-[#e3e9f1] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#18212f]">
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#64748b]">
                        <span className="bg-[#f4f7fb] px-2 py-0.5 rounded border border-[#e3e9f1]">
                          {language === 'ar' ? 'الكمية:' : 'Qty:'} <span className="font-bold text-[#18212f]">{item.quantity}</span>
                        </span>
                        <span>
                          {language === 'ar' ? 'سعر الوحدة:' : 'Unit Price:'} <span className="font-mono">{Math.round(item.unitPrice).toLocaleString()}</span>
                        </span>
                        <span className="font-medium text-blue-600">
                          {language === 'ar' ? 'الإجمالي:' : 'Total:'} <span className="font-mono font-bold">{Math.round(item.totalPrice).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 border-t border-[#e8edf4] sm:border-0 pt-3 sm:pt-0">
                      {returnItemTarget?.id === item.id ? (
                        <div className="flex items-center gap-2 bg-[#f4f7fb] p-1.5 rounded-lg border border-[#bfdbfe]">
                          <input
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={returnQty}
                            onChange={(e) => setReturnQty(Math.min(item.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-16 bg-[#fbfcfe] text-center text-[#18212f] rounded p-1.5 text-sm font-mono border border-[#e3e9f1] focus:outline-none focus:border-[#2563eb]"
                          />
                          <button
                            onClick={confirmReturn}
                            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors active:translate-y-px"
                          >
                            {language === 'ar' ? 'تأكيد الاسترجاع' : 'Confirm Return'}
                          </button>
                          <button
                            onClick={cancelReturn}
                            className="bg-[#fbfcfe] border border-[#e3e9f1] hover:bg-[#eef2f7] text-[#64748b] p-1.5 rounded transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleInitiateReturn(item)}
                          disabled={sale.status === 'refunded' || item.quantity <= 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-[#dc2626] hover:bg-rose-100 border border-rose-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Undo2 size={14} />
                          <span>{language === 'ar' ? 'استرجاع' : 'Return'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onVerify={verifyPin}
        isLocked={isPinLocked}
        lockSecondsLeft={lockSecondsLeft}
        errorMessage={pinError}
      />
    </AnimatePresence>
  );
};
