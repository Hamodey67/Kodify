import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: any;
  onPrint?: () => void;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  isOpen,
  onClose,
  receiptData,
  onPrint
}) => {
  const { language } = useLanguageStore();
  const [receiptHtml, setReceiptHtml] = useState<string>('');

  useEffect(() => {
    if (isOpen && receiptData) {
      window.api.previewReceipt(receiptData).then((html: string) => {
        setReceiptHtml(html);
      }).catch((err: any) => {
        console.error('Failed to get receipt HTML', err);
        setReceiptHtml('<div style="color:red; padding:20px;">Failed to load receipt preview.</div>');
      });
    } else {
      setReceiptHtml('');
    }
  }, [isOpen, receiptData]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e9f1] bg-[#f4f7fb] shrink-0">
            <h3 className="font-extrabold text-sm text-[#18212f] flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Printer size={16} />
              </span>
              <span>{language === 'ar' ? 'معاينة الوصل' : 'Receipt Preview'}</span>
            </h3>
            <div className="flex items-center gap-2">
              {onPrint && (
                <button
                  onClick={onPrint}
                  className="p-2 text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors border border-[#bfdbfe]"
                  title={language === 'ar' ? 'طباعة' : 'Print'}
                >
                  <Printer size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="flex-1 bg-[#e8edf4] flex justify-center p-4 overflow-hidden relative">
            <div className="w-full h-full bg-[#fbfcfe] border border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)] flex flex-col overflow-hidden max-w-[290px] rounded-lg" style={{ height: 'calc(100vh - 200px)', maxHeight: '600px' }}>
              {receiptHtml ? (
                <iframe
                  srcDoc={receiptHtml}
                  className="w-full h-full border-0 bg-[#fbfcfe]"
                  title="Receipt Preview"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#94a3b8]">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2563eb] border-r-2 border-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
