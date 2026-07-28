import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, Printer, FileText, ExternalLink } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { useSettingsStore } from '../store/settingsStore';
import { InvoiceDetailsModal } from './InvoiceDetailsModal';

interface DashboardInvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: 'today' | 'week' | 'month';
}

export const DashboardInvoicesModal: React.FC<DashboardInvoicesModalProps> = ({
  isOpen,
  onClose,
  period,
}) => {
  const { language } = useLanguageStore();
  const { getSetting } = useSettingsStore();
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const startOfPeriod = new Date();
      if (period === 'today') {
        startOfPeriod.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        startOfPeriod.setDate(startOfPeriod.getDate() - 7);
        startOfPeriod.setHours(0, 0, 0, 0);
      } else if (period === 'month') {
        startOfPeriod.setMonth(startOfPeriod.getMonth() - 1);
        startOfPeriod.setHours(0, 0, 0, 0);
      }

      const sales = await window.api.getSales({
        startDate: startOfPeriod.toISOString(),
        endDate: endOfDay.toISOString()
      });

      // Filter only completed sales and sort by date descending
      const completedSales = (sales || [])
        .filter((s: any) => s.status === 'completed')
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setInvoices(completedSales);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    } else {
      setInvoices([]);
    }
  }, [isOpen, period]);

  const handlePrint = async (sale: any) => {
    try {
      const items = await window.api.getSaleItems(sale.id);
      const receiptData = {
        storeName: getSetting('store_name', 'Kodify POS'),
        storeAddress: getSetting('store_address', ''),
        storePhone: getSetting('store_phone', ''),
        storeTaxNumber: getSetting('store_tax_number', ''),
        invoiceNumber: sale.invoiceNumber,
        cashierName: sale.cashierName || 'Admin',
        customerName: sale.customerName || (language === 'ar' ? 'عميل سفري' : 'Walk-in Customer'),
        paymentMethod: sale.paymentMethod === 'cash' || sale.paymentMethod === 'كاش' ? 'Cash' : 
                       sale.paymentMethod === 'card' || sale.paymentMethod === 'بطاقة' ? 'Card' : 'Split',
        items: items.map((item: any) => ({
          name: language === 'ar' ? item.nameAr : item.nameEn,
          qty: item.quantity,
          price: item.unitPrice,
          total: item.totalPrice,
          originalPrice: item.unitPrice,
          discount: item.discountAmount || 0,
        })),
        subtotal: sale.totalAmount - (sale.taxAmount || 0) + (sale.discountAmount || 0),
        taxAmount: sale.taxAmount || 0,
        discountAmount: sale.discountAmount || 0,
        total: sale.totalAmount,
        cashReceived: sale.cashReceived || 0,
        cashReturned: sale.cashReturned || 0,
        date: new Date(sale.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'),
      };

      await window.api.printReceipt(receiptData, {
        mockMode: getSetting('hardware_mock_mode', 'true') === 'true',
        printerType: 'windows',
        connectionPath: getSetting('hardware_printer_ip', 'POSPrinter POS80')
      });
    } catch (err) {
      console.error('Failed to print invoice:', err);
    }
  };

  const openDetails = (sale: any) => {
    setSelectedInvoice(sale);
    setIsDetailsModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
          className="relative w-full max-w-4xl bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#e3e9f1] bg-[#f4f7fb] shrink-0">
            <div>
              <h3 className="text-sm font-extrabold text-[#18212f] flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Receipt size={18} />
                </span>
                <span>
                  {language === 'ar' ? 'تفاصيل العمليات (الفواتير)' : 'Transactions Details (Invoices)'}
                </span>
              </h3>
              <p className="text-xs font-medium text-[#64748b] mt-1.5 ml-11">
                {language === 'ar' 
                  ? `عرض تفاصيل الفواتير للفترة: ${period === 'today' ? 'اليوم' : period === 'week' ? 'الأسبوع' : 'الشهر'}` 
                  : `Viewing invoices for period: ${period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* List of Invoices */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3 bg-[#fbfcfe]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#64748b] gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2563eb] border-r-2 border-[#e3e9f1]"></div>
                <p className="text-sm">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-20 text-[#94a3b8]">
                {language === 'ar' ? 'لا توجد فواتير في هذه الفترة' : 'No invoices found for this period'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {invoices.map((sale) => (
                  <div key={sale.id} className="bg-[#fbfcfe] border border-[#e3e9f1] hover:border-[#bfdbfe] p-4 rounded-xl flex flex-col gap-3 transition-colors shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs border border-[#bfdbfe]">
                        #{sale.invoiceNumber}
                      </span>
                      <span className="text-xs text-[#64748b] font-mono">
                        {new Date(sale.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="text-xs text-[#64748b]">
                          {language === 'ar' ? 'الكاشير: ' : 'Cashier: '}
                          <span className="text-[#334155]">{sale.cashierName || 'Admin'}</span>
                        </div>
                        <div className="text-xs text-[#64748b]">
                          {language === 'ar' ? 'طريقة الدفع: ' : 'Payment: '}
                          <span className="text-[#334155] capitalize">{sale.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-[#94a3b8] mb-0.5">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                        <span className="font-mono font-extrabold text-[#18212f] text-lg">
                          {Math.round(sale.totalAmount).toLocaleString()} <span className="text-[10px] text-[#94a3b8]">{getSetting('store_currency', 'SAR')}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-[#e8edf4] mt-1">
                      <button
                        onClick={() => openDetails(sale)}
                        className="flex-1 py-1.5 bg-[#fbfcfe] hover:bg-[#eff6ff] text-[#64748b] hover:text-[#2563eb] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#e3e9f1] hover:border-[#bfdbfe]"
                      >
                        <ExternalLink size={14} />
                        <span>{language === 'ar' ? 'التفاصيل والمنتجات' : 'Details & Items'}</span>
                      </button>
                      <button
                        onClick={() => handlePrint(sale)}
                        className="p-1.5 bg-[#fbfcfe] hover:bg-[#eff6ff] text-[#64748b] hover:text-[#2563eb] rounded-lg transition-colors border border-[#e3e9f1] hover:border-[#bfdbfe]"
                        title={language === 'ar' ? 'طباعة إيصال' : 'Print Receipt'}
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Invoice Details Modal */}
      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sale={selectedInvoice}
        onItemReturned={() => {
          fetchInvoices();
        }}
      />
    </AnimatePresence>
  );
};
