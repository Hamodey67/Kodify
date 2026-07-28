import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../utils/translations';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  List,
  Grid,
  Info,
  Printer,
  FileText,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminPinModal } from '../components/AdminPinModal';
import { ReceiptPreviewModal } from '../components/ReceiptPreviewModal';
import { InvoiceDetailsModal } from '../components/InvoiceDetailsModal';

export const Calendar: React.FC = () => {
  const { language, dir } = useLanguageStore();
  const { user } = useAuthStore();
  const { getSetting } = useSettingsStore();
  const t = translations[language];

  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [dailySales, setDailySales] = useState<Record<number, number>>({});
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [monthlySalesList, setMonthlySalesList] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  // Void invoice verification state
  const [isDeletePinModalOpen, setIsDeletePinModalOpen] = useState(false);
  const [deletePinError, setDeletePinError] = useState('');
  const [deleteFailedAttempts, setDeleteFailedAttempts] = useState(0);
  const [deleteLockedUntil, setDeleteLockedUntil] = useState<number | null>(null);
  const [deleteLockSecondsLeft, setDeleteLockSecondsLeft] = useState(0);
  const [saleToDelete, setSaleToDelete] = useState<any>(null);
  type PinDeleteMode = 'invoice' | 'day' | 'month';
  const [pinDeleteMode, setPinDeleteMode] = useState<PinDeleteMode>('invoice');

  const [previewReceiptData, setPreviewReceiptData] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSaleForDetails, setSelectedSaleForDetails] = useState<any>(null);

  const isDeletePinLocked = !!deleteLockedUntil && deleteLockedUntil > Date.now();

  useEffect(() => {
    if (!deleteLockedUntil) {
      setDeleteLockSecondsLeft(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deleteLockedUntil - Date.now()) / 1000));
      setDeleteLockSecondsLeft(remaining);
      if (remaining <= 0) {
        setDeleteLockedUntil(null);
        setDeletePinError('');
        setDeleteFailedAttempts(0);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [deleteLockedUntil]);

  const verifyDeletePin = async (pin: string): Promise<boolean> => {
    if (isDeletePinLocked) {
      setDeletePinError(language === 'ar' ? 'تم قفل الإدخال مؤقتاً' : 'Entry locked temporarily');
      return false;
    }

    const valid = await window.api.verifyAdminPin(pin);
    if (valid) {
      setDeletePinError('');
      setDeleteFailedAttempts(0);
      setIsDeletePinModalOpen(false);

      if (pinDeleteMode === 'invoice' && saleToDelete) {
        try {
          const result = await window.api.refundSale(saleToDelete.id);
          if (result.success) {
            alert(language === 'ar' ? 'تم إلغاء الفاتورة بنجاح وتعديل المخزون والوردية.' : 'Invoice voided/refunded successfully.');
            await fetchMonthlySales();
          } else {
            alert(t.error + ': ' + (result.error || 'Unknown error'));
          }
        } catch (err: any) {
          console.error('Failed to refund sale:', err);
          alert(t.error + ': ' + err.message);
        } finally {
          setSaleToDelete(null);
        }
      } else if (pinDeleteMode === 'day') {
        await deleteAllDaySales();
      } else if (pinDeleteMode === 'month') {
        await clearAllMonthSales();
      }

      return true;
    }

    const nextFailedAttempts = deleteFailedAttempts + 1;
    setDeleteFailedAttempts(nextFailedAttempts);
    setDeletePinError(language === 'ar' ? 'رمز PIN غير صحيح' : 'Incorrect PIN');

    if (nextFailedAttempts >= 3) {
      setDeleteLockedUntil(Date.now() + 30_000);
      setDeletePinError(
        language === 'ar'
          ? 'تم تجاوز الحد المسموح. المحاولة متاحة بعد 30 ثانية'
          : 'Too many attempts. Try again in 30 seconds'
      );
    }

    return false;
  };

  const monthsAr = [
    'كانون الثاني (يناير)', 'شباط (فبراير)', 'آذار (مارس)', 'نيسان (أبريل)', 
    'أيار (مايو)', 'حزيران (يونيو)', 'تموز (يوليو)', 'آب (أغسطس)', 
    'أيلول (سبتمبر)', 'تشرين الأول (أكتوبر)', 'تشرين الثاني (نوفمبر)', 'كانون الأول (ديسمبر)'
  ];

  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDaysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekdayColors = [
    { text: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
    { text: 'text-[#64748b]', bg: 'bg-[#f4f7fb] border-[#e3e9f1]' },
    { text: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { text: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { text: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { text: 'text-[#64748b]', bg: 'bg-[#f4f7fb] border-[#e3e9f1]' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - 5 + i);

  const fetchMonthlySales = async () => {
    setIsLoading(true);
    try {
      const start = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
      const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      
      const sales = await window.api.getSales({
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });

      const aggregated: Record<number, number> = {};
      let total = 0;

      sales?.forEach((sale: any) => {
        if (sale.status === 'completed') {
          const saleDate = new Date(sale.createdAt);
          if (saleDate.getFullYear() !== currentYear || saleDate.getMonth() !== currentMonth) return;
          const day = saleDate.getDate();
          aggregated[day] = (aggregated[day] || 0) + sale.totalAmount;
          total += sale.totalAmount;
        }
      });

      setDailySales(aggregated);
      setMonthlyTotal(total);
      setMonthlySalesList(sales || []);
      setSelectedDay(null); // Reset selection on month change
    } catch (err) {
      console.error('Failed to fetch calendar sales:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySales();
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper values for rendering calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const emptyCells = Array.from({ length: firstDayIndex }, (_, i) => {
    return { day: prevMonthDays - firstDayIndex + i + 1, isCurrentMonth: false };
  });
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    return { day: i + 1, isCurrentMonth: true };
  });

  // Calculate remaining cells to complete the grid row
  const rowsNeeded = Math.ceil((emptyCells.length + dayCells.length) / 7);
  const totalCellsCount = rowsNeeded * 7;
  const trailingCellsCount = totalCellsCount - (emptyCells.length + dayCells.length);

  const trailingCells = Array.from({ length: trailingCellsCount }, (_, i) => {
    return { day: i + 1, isCurrentMonth: false };
  });

  const totalCells = [...emptyCells, ...dayCells, ...trailingCells];

  // Calculate maximum sales in a single day for heatmap opacity scale
  const maxDaySales = Math.max(...Object.values(dailySales), 1);

  // Graded blue tints for the sales heatmap
  const getHeatColor = (daySales: number): string | null => {
    if (daySales <= 0) return null;
    const intensity = daySales / maxDaySales;
    if (intensity <= 0.25) return '#eff6ff';
    if (intensity <= 0.5) return '#dbeafe';
    if (intensity <= 0.75) return '#bfdbfe';
    return '#93c5fd';
  };

  // Filter sales for the selected day
  const selectedDaySales = monthlySalesList.filter(s => {
    if (selectedDay === null) return false;
    const date = new Date(s.createdAt);
    return (
      date.getDate() === selectedDay &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear &&
      s.status === 'completed'
    );
  });

  const handlePrint = async (isSummaryOnly: boolean) => {
    if (selectedDay === null || selectedDaySales.length === 0) return;

    let totalCash = 0;
    let totalCard = 0;
    let totalSales = 0;

    const mappedTransactions = selectedDaySales.map(sale => {
      if (sale.paymentMethod === 'cash' || sale.paymentMethod === 'كاش') totalCash += sale.totalAmount;
      if (sale.paymentMethod === 'card' || sale.paymentMethod === 'بطاقة') totalCard += sale.totalAmount;
      totalSales += sale.totalAmount;

      return {
        invoiceNumber: sale.invoiceNumber,
        time: new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: sale.customerName || (language === 'ar' ? 'عميل سفري' : 'Walk-in'),
        method: sale.paymentMethod,
        total: sale.totalAmount
      };
    });

    const reportDateStr = new Date(currentYear, currentMonth, selectedDay).toLocaleDateString(
      language === 'ar' ? 'ar-EG' : 'en-US', 
      { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
    );

    const reportData = {
      reportDate: reportDateStr,
      generatedAt: new Date().toLocaleString(),
      generatedBy: user?.name || user?.username || 'Admin',
      totalTransactions: selectedDaySales.length,
      totalSales,
      totalCash,
      totalCard,
      isSummaryOnly,
      transactions: mappedTransactions
    };

    try {
      const result = await window.api.printDailyReport(reportData, {
        mockMode: getSetting('hardware_mock_mode', 'true') === 'true',
        printerType: 'windows',
        connectionPath: getSetting('hardware_printer_ip', 'POSPrinter POS80')
      });
      if (result.success) {
        console.log('Daily report printed:', result.path || 'Success');
      } else {
        console.error('Print failed:', result.error);
      }
    } catch (err) {
      console.error('Print exception:', err);
    }
  };

  const handlePrintInvoice = async (sale: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const items = await window.api.getSaleItems(sale.id);
      
      const receiptData = {
        storeName: getSetting('store_name', 'Kodify POS'),
        storeAddress: getSetting('store_address', ''),
        storePhone: getSetting('store_phone', ''),
        storeTaxNumber: getSetting('store_tax_number', ''),
        invoiceNumber: sale.invoiceNumber,
        cashierName: sale.cashierName || user?.name || user?.username || 'Admin',
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
      console.error('Failed to print individual invoice:', err);
    }
  };

  const handleDeleteSale = async (sale: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmMsg = language === 'ar'
      ? `هل أنت متأكد من إلغاء وحذف الفاتورة #${sale.invoiceNumber}؟ سيتم إرجاع المنتجات للمخزن وخصم القيمة من إجمالي اليوم.`
      : `Are you sure you want to void/refund invoice #${sale.invoiceNumber}? This will return items to stock and adjust totals.`;
      
    if (!window.confirm(confirmMsg)) return;

    try {
      const isAdmin = user?.role === 'admin';
      if (isAdmin) {
        const result = await window.api.refundSale(sale.id);
        if (result.success) {
          alert(language === 'ar' ? 'تم إلغاء الفاتورة بنجاح وتعديل المخزون والوردية.' : 'Invoice voided/refunded successfully.');
          await fetchMonthlySales();
        } else {
          alert(t.error + ': ' + (result.error || 'Unknown error'));
        }
      } else {
        setPinDeleteMode('invoice');
        setSaleToDelete(sale);
        setDeletePinError('');
        setIsDeletePinModalOpen(true);
      }
    } catch (err: any) {
      console.error('Failed to refund sale:', err);
      alert(t.error + ': ' + err.message);
    }
  };

  const deleteAllDaySales = async () => {
    const toDelete = selectedDaySales.slice();
    let successCount = 0;
    for (const sale of toDelete) {
      try {
        const result = await window.api.refundSale(sale.id);
        if (result.success) successCount++;
      } catch (err) {
        console.error('Failed to refund sale:', err);
      }
    }
    alert(
      language === 'ar'
        ? `تم حذف ${successCount} من ${toDelete.length} فاتورة ليوم ${selectedDay}.`
        : `Deleted ${successCount} of ${toDelete.length} invoices for day ${selectedDay}.`
    );
    await fetchMonthlySales();
  };

  const handleDeleteDaySales = async () => {
    if (selectedDay === null || selectedDaySales.length === 0) return;

    const confirmMsg =
      language === 'ar'
        ? `هل أنت متأكد من حذف جميع مبيعات يوم ${selectedDay}؟ (${selectedDaySales.length} فاتورة)`
        : `Delete all ${selectedDaySales.length} invoices from day ${selectedDay}?`;

    if (!window.confirm(confirmMsg)) return;

    if (user?.role === 'admin') {
      await deleteAllDaySales();
    } else {
      setPinDeleteMode('day');
      setDeletePinError('');
      setIsDeletePinModalOpen(true);
    }
  };

  const clearAllMonthSales = async () => {
    const toDelete = monthlySalesList.filter(s => s.status === 'completed');
    let successCount = 0;
    for (const sale of toDelete) {
      try {
        const result = await window.api.refundSale(sale.id);
        if (result.success) successCount++;
      } catch (err) {
        console.error('Failed to refund sale:', err);
      }
    }
    alert(
      language === 'ar'
        ? `تم مسح ${successCount} من ${toDelete.length} فاتورة للشهر.`
        : `Cleared ${successCount} of ${toDelete.length} monthly invoices.`
    );
    await fetchMonthlySales();
  };

  const handleClearMonthSales = async () => {
    const completedSales = monthlySalesList.filter(s => s.status === 'completed');
    if (completedSales.length === 0) {
      alert(language === 'ar' ? 'لا توجد مبيعات في هذا الشهر.' : 'No sales this month.');
      return;
    }

    const confirmMsg =
      language === 'ar'
        ? `هل أنت متأكد من مسح جميع مبيعات الشهر؟ (${completedSales.length} فاتورة) لا يمكن التراجع عن هذه العملية.`
        : `Clear ALL ${completedSales.length} sales from this month? This cannot be undone.`;

    if (!window.confirm(confirmMsg)) return;

    if (user?.role === 'admin') {
      await clearAllMonthSales();
    } else {
      setPinDeleteMode('month');
      setDeletePinError('');
      setIsDeletePinModalOpen(true);
    }
  };

  const handleViewDetails = (sale: any) => {
    setSelectedSaleForDetails(sale);
    setIsDetailsModalOpen(true);
  };

  const handlePreviewInvoice = async (sale: any) => {
    try {
      const items = await window.api.getSaleItems(sale.id);
      
      const receiptData = {
        storeName: getSetting('store_name', 'Kodify POS'),
        storeAddress: getSetting('store_address', ''),
        storePhone: getSetting('store_phone', ''),
        storeTaxNumber: getSetting('store_tax_number', ''),
        invoiceNumber: sale.invoiceNumber,
        cashierName: sale.cashierName || user?.name || user?.username || 'Admin',
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

      setPreviewReceiptData(receiptData);
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error('Failed to preview invoice:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#eef2f8] space-y-4"
    >
      
      {/* Page Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e3e9f1] pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18212f] flex items-center gap-3">
            <CalendarIcon className="text-blue-600" size={24} />
            <span>{language === 'ar' ? 'تقويم المبيعات اليومية' : 'Daily Sales Calendar'}</span>
          </h1>
          <p className="text-xs font-medium text-[#64748b] mt-1">
            {language === 'ar' 
              ? 'متابعة إجمالي مبيعات المتجر اليومية والافتراضية مرتبة حسب أيام الشهر' 
              : 'Monitor store checkout revenue aggregated daily across month days'}
          </p>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month/Year Navigation */}
          <div className="flex items-center bg-[#fbfcfe] border border-[#e3e9f1] p-1 rounded-xl gap-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <button
              onClick={dir === 'rtl' ? handleNextMonth : handlePrevMonth}
              className="p-1.5 hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] rounded-lg transition-colors"
            >
              {dir === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <div className="flex items-center gap-1">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="bg-transparent text-[#18212f] px-2 py-1 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border border-transparent hover:border-[#e3e9f1]"
              >
                {(language === 'ar' ? monthsAr : monthsEn).map((m, idx) => (
                  <option key={idx} value={idx} className="bg-[#fbfcfe] text-[#18212f]">{m}</option>
                ))}
              </select>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="bg-transparent text-[#18212f] px-2 py-1 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border border-transparent hover:border-[#e3e9f1]"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-[#fbfcfe] text-[#18212f]">{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={dir === 'rtl' ? handlePrevMonth : handleNextMonth}
              className="p-1.5 hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] rounded-lg transition-colors"
            >
              {dir === 'rtl' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* View Mode Segmented Control */}
          <div className="flex items-center bg-[#fbfcfe] border border-[#e3e9f1] p-1 rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(37,99,235,0.25)]' 
                  : 'text-[#64748b] hover:bg-[#eef2f7] hover:text-[#18212f] border border-transparent'
              }`}
            >
              <Grid size={14} />
              <span>{language === 'ar' ? 'التقويم' : 'Calendar'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'list' 
                  ? 'bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(37,99,235,0.25)]' 
                  : 'text-[#64748b] hover:bg-[#eef2f7] hover:text-[#18212f] border border-transparent'
              }`}
            >
              <List size={14} />
              <span>{language === 'ar' ? 'قائمة المبيعات' : 'List View'}</span>
            </button>
          </div>

          {/* Clear Month Button */}
          <button
            onClick={handleClearMonthSales}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#fff1f2] hover:bg-rose-100 text-[#dc2626] border border-rose-200 hover:border-rose-300 transition-all"
            title={language === 'ar' ? 'مسح كل مبيعات الشهر' : 'Clear All Month Sales'}
          >
            <Trash2 size={13} />
            <span>{language === 'ar' ? 'مسح الشهر' : 'Clear Month'}</span>
          </button>

          {/* Month Total Card on the Right */}
          <div className="flex items-center bg-[#fbfcfe] border border-[#e3e9f1] px-3 py-1.5 rounded-xl gap-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-[#94a3b8] font-medium uppercase tracking-wider">
                {language === 'ar' ? 'مجموع مبيعات الشهر' : 'Month Total'}
              </span>
              <span className="text-base font-bold text-[#1d4ed8] font-mono mt-0.5">
                {Math.round(monthlyTotal).toLocaleString()} <span className="text-[10px] font-sans font-normal text-[#94a3b8]">{t.currency}</span>
              </span>
            </div>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <TrendingUp size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Two-column layout (65% calendar / 35% detail panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4">
        
        {/* Calendar Grid or List View (Left/Main Panel) */}
        <div className="rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center text-[#64748b] gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-[#e3e9f1] border-t-[#2563eb]"></div>
              <p className="text-xs font-semibold">{t.loading}</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-4">
              {/* Weekdays Header: Colored badges to distinguish each day of the week */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold py-1 border-b border-[#e8edf4] pb-3">
                {(language === 'ar' ? weekDaysAr : weekDaysEn).map((day, idx) => {
                  const color = weekdayColors[idx];
                  return (
                    <div 
                      key={day} 
                      className={`py-1.5 rounded-md border ${color.bg} ${color.text} font-bold`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7 gap-2">
                {totalCells.map((cellObj, cellIdx) => {
                  const { day, isCurrentMonth } = cellObj;

                  if (!isCurrentMonth) {
                    return (
                      <div 
                        key={`empty-${cellIdx}`} 
                        className="relative p-3 flex flex-col justify-start h-20 rounded-xl border border-[#e8edf4] bg-[#f4f7fb] opacity-50 select-none"
                      >
                        <span className="text-[13px] font-bold font-mono text-[#94a3b8] w-6 h-6 rounded flex items-center justify-center">
                          {day}
                        </span>
                      </div>
                    );
                  }

                  const daySales = dailySales[day] || 0;
                  const isToday = 
                    now.getDate() === day && 
                    now.getMonth() === currentMonth && 
                    now.getFullYear() === currentYear;
                  
                  const isSelected = selectedDay === day;

                  // Dynamic styling for days with sales
                  const hasSales = daySales > 0;
                  const heatColor = getHeatColor(daySales);

                  return (
                    <motion.button
                      key={`day-${day}`}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      style={!isSelected && heatColor ? { backgroundColor: heatColor } : {}}
                      className={`relative p-3 flex flex-col justify-between h-20 rounded-xl transition-all duration-200 text-start group border ${
                        isSelected 
                          ? 'border-[#2563eb] bg-[#2563eb]' 
                          : isToday 
                            ? 'border-[#e8edf4] ring-2 ring-[#2563eb] hover:border-[#bfdbfe]' 
                            : hasSales
                              ? 'border-[#bfdbfe] hover:border-[#93c5fd]'
                              : 'border-[#e8edf4] bg-[#fbfcfe] hover:border-[#bfdbfe] hover:bg-[#f4f7fb]'
                      }`}
                    >
                      {/* Day Number */}
                      <div className="flex justify-between items-start w-full">
                        <span className={`text-[13px] font-semibold font-mono w-6 h-6 rounded flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'text-white bg-white/20 font-bold' 
                            : isToday 
                              ? 'text-[#2563eb] bg-blue-50 font-bold' 
                              : 'text-[#18212f] group-hover:text-[#18212f]'
                        }`}>
                          {day}
                        </span>
                        
                        {hasSales && !isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                        )}
                      </div>

                      {/* Sales Total */}
                      <div className="flex flex-col text-start w-full mt-auto">
                        {hasSales ? (
                          <div className="flex flex-col">
                            <span className={`text-[18px] font-bold leading-none tracking-tight ${isSelected ? 'text-white' : 'text-[#1d4ed8]'}`}>
                              {Math.round(daySales).toLocaleString()}
                            </span>
                            <span className={`text-[9px] uppercase mt-0.5 font-medium ${isSelected ? 'text-blue-100' : 'text-[#94a3b8]'}`}>
                              {t.currency}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-[13px] font-mono font-medium ${isSelected ? 'text-blue-100' : 'text-[#94a3b8]'}`}>—</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List View mode */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-[#334155] border-collapse">
                <thead className="bg-[#f4f7fb] border-b border-[#e3e9f1] text-[#64748b] font-bold">
                  <tr>
                    <th className="p-3 text-center font-medium">{language === 'ar' ? 'اليوم' : 'Day'}</th>
                    <th className="p-3 text-center font-medium">{language === 'ar' ? 'عدد العمليات' : 'Tx Count'}</th>
                    <th className="p-3 text-center font-medium">{language === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8edf4]">
                  {dayCells
                    .filter(cell => (dailySales[cell.day] || 0) > 0)
                    .map(cell => {
                      const day = cell.day;
                      const dayTxCount = monthlySalesList.filter(s => {
                        const d = new Date(s.createdAt);
                        return d.getDate() === day && s.status === 'completed';
                      }).length;

                      return (
                        <tr 
                          key={day} 
                          onClick={() => { setSelectedDay(day); setViewMode('grid'); }}
                          className="hover:bg-[#f4f7fb] cursor-pointer transition-colors"
                        >
                          <td className="p-3 text-center font-semibold text-[#18212f]">
                            {language === 'ar' ? `يوم ${day}` : `Day ${day}`}
                          </td>
                          <td className="p-3 text-center text-[#64748b] font-mono">
                            {dayTxCount}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-[#1d4ed8]">
                            {Math.round(dailySales[day]).toLocaleString()} {t.currency}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Day Details Panel (Right Sidebar) */}
        <div className="rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-4 space-y-4 flex flex-col h-fit sticky top-6 self-start shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="border-b border-[#e8edf4] pb-3 flex justify-between items-center">
            <h3 className="text-[15px] font-bold text-[#18212f] flex items-center gap-2">
              <CalendarIcon size={16} className="text-blue-600" />
              <span>
                {selectedDay !== null 
                  ? (language === 'ar' ? `تفاصيل مبيعات ${selectedDay} ${monthsAr[currentMonth]}` : `Sales of ${monthsEn[currentMonth]} ${selectedDay}`) 
                  : (language === 'ar' ? 'اختر يوماً للتفاصيل' : 'Select a Day for Details')
                }
              </span>
            </h3>
            {selectedDay !== null && (
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-xs px-2 py-1 bg-[#fbfcfe] hover:bg-[#eff6ff] rounded-md text-[#64748b] hover:text-[#2563eb] transition-colors border border-[#e3e9f1] hover:border-[#bfdbfe]"
              >
                {language === 'ar' ? 'إلغاء' : 'Clear'}
              </button>
            )}
          </div>

          {selectedDay === null ? (
            <div className="py-16 flex flex-col items-center justify-center text-center text-[#94a3b8] text-xs italic space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#f4f7fb] flex items-center justify-center border border-[#e3e9f1] mb-1">
                <CalendarIcon size={20} className="text-[#94a3b8]" />
              </div>
              <p className="max-w-[200px] leading-relaxed">
                {language === 'ar' ? 'اضغط على أي يوم في التقويم لعرض تفاصيل الفواتير وتقارير المبيعات.' : 'Click any calendar day to inspect detailed customer invoices and reports.'}
              </p>
            </div>
          ) : selectedDaySales.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center text-[#94a3b8] text-xs italic space-y-2">
              <Info size={20} className="text-[#94a3b8]" />
              <p>{language === 'ar' ? 'لا توجد مبيعات مسجلة في هذا اليوم' : 'No invoices recorded on this day.'}</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {/* Daily KPI Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f4f7fb] border border-[#e3e9f1] rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-semibold text-[#64748b]">{language === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
                  <span className="text-[15px] font-bold text-[#1d4ed8] font-mono mt-1">
                    {Math.round(selectedDaySales.reduce((sum, s) => sum + s.totalAmount, 0)).toLocaleString()} <span className="text-[9px] font-sans text-[#94a3b8]">{t.currency}</span>
                  </span>
                </div>
                <div className="bg-[#f4f7fb] border border-[#e3e9f1] rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-semibold text-[#64748b]">{language === 'ar' ? 'عدد الفواتير' : 'Invoices'}</span>
                  <span className="text-[15px] font-bold text-[#18212f] font-mono mt-1">
                    {selectedDaySales.length}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePrint(true)}
                  className="flex-1 py-2 bg-[#fbfcfe] hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] border border-[#e3e9f1] hover:border-[#bfdbfe] rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText size={14} />
                  <span>{language === 'ar' ? 'طباعة ملخص' : 'Print Summary'}</span>
                </button>
                <button
                  onClick={() => handlePrint(false)}
                  className="flex-1 py-2 bg-[#fbfcfe] hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] border border-[#e3e9f1] hover:border-[#bfdbfe] rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer size={14} />
                  <span>{language === 'ar' ? 'طباعة كامل' : 'Print Full'}</span>
                </button>
              </div>

              {/* Delete All Day Sales Button */}
              <button
                onClick={handleDeleteDaySales}
                className="w-full py-2 bg-[#fff1f2] hover:bg-rose-100 text-[#dc2626] border border-rose-200 hover:border-rose-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} />
                <span>
                  {language === 'ar'
                    ? `حذف جميع مبيعات اليوم (${selectedDaySales.length})`
                    : `Delete All Day Sales (${selectedDaySales.length})`}
                </span>
              </button>

              {/* Invoices List */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                {selectedDaySales.map((sale: any) => (
                  <div 
                    key={sale.id}
                    onClick={() => handleViewDetails(sale)}
                    className="bg-[#f4f7fb] border border-[#e3e9f1] hover:border-[#bfdbfe] hover:bg-[#fbfcfe] p-3 rounded-xl flex flex-col gap-2 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[10px] ring-1 ring-blue-200">
                        #{sale.invoiceNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#94a3b8] font-mono">
                          {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={(e) => handlePrintInvoice(sale, e)}
                          className="p-1 rounded-md bg-[#fbfcfe] hover:bg-[#eff6ff] text-[#64748b] hover:text-[#2563eb] transition-colors border border-[#e3e9f1] hover:border-[#bfdbfe]"
                          title={language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
                        >
                          <Printer size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSale(sale, e)}
                          className="p-1 rounded-md bg-[#fbfcfe] hover:bg-rose-50 text-[#64748b] hover:text-[#dc2626] transition-colors border border-[#e3e9f1] hover:border-rose-200"
                          title={language === 'ar' ? 'حذف الفاتورة' : 'Delete Invoice'}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <div className="flex items-center gap-1.5 text-[#64748b]">
                        <span>{language === 'ar' ? 'الدفع:' : 'Payment:'}</span>
                        <span className="text-[#18212f] capitalize font-medium">{sale.paymentMethod}</span>
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="font-mono font-bold text-[#18212f] text-[12px]">
                          {Math.round(sale.totalAmount).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-[#94a3b8]">{t.currency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      <AdminPinModal
        isOpen={isDeletePinModalOpen}
        onClose={() => {
          setIsDeletePinModalOpen(false);
          setSaleToDelete(null);
        }}
        onVerify={verifyDeletePin}
        isLocked={isDeletePinLocked}
        lockSecondsLeft={deleteLockSecondsLeft}
        errorMessage={deletePinError}
      />

      <ReceiptPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        receiptData={previewReceiptData}
        onPrint={() => {
          if (previewReceiptData) {
            window.api.printReceipt(previewReceiptData, {
              mockMode: getSetting('hardware_mock_mode', 'true') === 'true',
              printerType: 'windows',
              connectionPath: getSetting('hardware_printer_ip', 'POSPrinter POS80')
            });
          }
        }}
      />

      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSaleForDetails(null);
        }}
        sale={selectedSaleForDetails}
        onItemReturned={() => {
          // Refresh monthly sales after return
          fetchMonthlySales();
        }}
      />

    </motion.div>
  );
};
