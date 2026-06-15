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
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <h3 className="font-semibold text-[#111111]">
              {language === 'ar' ? 'معاينة الوصل' : 'Receipt Preview'}
            </h3>
            <div className="flex items-center gap-2">
              {onPrint && (
                <button
                  onClick={onPrint}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-teal-100"
                  title={language === 'ar' ? 'طباعة' : 'Print'}
                >
                  <Printer size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="flex-1 bg-slate-200 flex justify-center p-4 overflow-hidden relative">
            <div className="w-full h-full bg-white shadow-sm flex flex-col overflow-hidden max-w-[290px] rounded" style={{ height: 'calc(100vh - 200px)', maxHeight: '600px' }}>
              {receiptHtml ? (
                <iframe
                  srcDoc={receiptHtml}
                  className="w-full h-full border-0 bg-white"
                  title="Receipt Preview"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 border-r-2 border-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
