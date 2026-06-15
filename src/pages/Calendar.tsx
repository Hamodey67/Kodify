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

  const [previewReceiptData, setPreviewReceiptData] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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
      
      if (saleToDelete) {
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
    { text: 'text-rose-600', bg: 'bg-rose-50/70 border-rose-100' },     // Sun
    { text: 'text-blue-600', bg: 'bg-blue-50/70 border-blue-100' },     // Mon
    { text: 'text-emerald-600', bg: 'bg-emerald-50/70 border-emerald-100' }, // Tue
    { text: 'text-indigo-600', bg: 'bg-indigo-50/70 border-indigo-100' }, // Wed
    { text: 'text-amber-600', bg: 'bg-amber-50/70 border-amber-100' },   // Thu
    { text: 'text-violet-600', bg: 'bg-violet-50/70 border-violet-100' }, // Fri
    { text: 'text-pink-600', bg: 'bg-pink-50/70 border-pink-100' }      // Sat
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

  // Filter sales for the selected day
  const selectedDaySales = monthlySalesList.filter(s => {
    if (selectedDay === null) return false;
    const date = new Date(s.createdAt);
    return date.getDate() === selectedDay && s.status === 'completed';
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
        setSaleToDelete(sale);
        setDeletePinError('');
        setIsDeletePinModalOpen(true);
      }
    } catch (err: any) {
      console.error('Failed to refund sale:', err);
      alert(t.error + ': ' + err.message);
    }
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
      className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-pos-bg space-y-4"
    >
      
      {/* Page Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <CalendarIcon className="text-teal-400" size={24} />
            <span>{language === 'ar' ? 'تقويم المبيعات اليومية' : 'Daily Sales Calendar'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar' 
              ? 'متابعة إجمالي مبيعات المتجر اليومية والافتراضية مرتبة حسب أيام الشهر' 
              : 'Monitor store checkout revenue aggregated daily across month days'}
          </p>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month/Year Navigation */}
          <div className="flex items-center bg-slate-800/20 border border-white/5 p-1 rounded-xl gap-2">
            <button
              onClick={dir === 'rtl' ? handleNextMonth : handlePrevMonth}
              className="p-1.5 hover:bg-slate-800 hover:text-slate-100 text-slate-400 rounded-lg transition-colors"
            >
              {dir === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <div className="flex items-center gap-1">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}
                className="bg-transparent text-slate-100 px-2 py-1 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border border-transparent hover:border-white/5"
              >
                {(language === 'ar' ? monthsAr : monthsEn).map((m, idx) => (
                  <option key={idx} value={idx} className="bg-slate-900 text-slate-100">{m}</option>
                ))}
              </select>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}
                className="bg-transparent text-slate-100 px-2 py-1 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border border-transparent hover:border-white/5"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-slate-900 text-slate-100">{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={dir === 'rtl' ? handlePrevMonth : handleNextMonth}
              className="p-1.5 hover:bg-slate-800 hover:text-slate-100 text-slate-400 rounded-lg transition-colors"
            >
              {dir === 'rtl' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* View Mode Segmented Control */}
          <div className="flex items-center bg-slate-800/20 border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Grid size={14} />
              <span>{language === 'ar' ? 'التقويم' : 'Calendar'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'list' 
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <List size={14} />
              <span>{language === 'ar' ? 'قائمة المبيعات' : 'List View'}</span>
            </button>
          </div>

          {/* Month Total Card on the Right */}
          <div className="flex items-center bg-slate-800/30 border border-white/5 px-3 py-1.5 rounded-xl gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                {language === 'ar' ? 'مجموع مبيعات الشهر' : 'Month Total'}
              </span>
              <span className="text-base font-bold text-teal-400 font-mono mt-0.5">
                {Math.round(monthlyTotal).toLocaleString()} <span className="text-[10px] font-sans font-normal text-slate-400">{t.currency}</span>
              </span>
            </div>
            <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
              <TrendingUp size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Two-column layout (65% calendar / 35% detail panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4">
        
        {/* Calendar Grid or List View (Left/Main Panel) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 border-r-2 border-slate-700"></div>
              <p className="text-xs">{t.loading}</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-4">
              {/* Weekdays Header: Colored badges to distinguish each day of the week */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold py-1 border-b border-slate-100 pb-3">
                {(language === 'ar' ? weekDaysAr : weekDaysEn).map((day, idx) => {
                  const color = weekdayColors[idx];
                  return (
                    <div 
                      key={day} 
                      className={`py-1.5 rounded-lg border ${color.bg} ${color.text} font-bold`}
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
                        className="relative p-3 flex flex-col justify-start h-20 rounded-xl border border-slate-100 bg-slate-50/40 opacity-40 select-none"
                      >
                        <span className="text-[13px] font-bold font-mono text-slate-400 w-6 h-6 rounded flex items-center justify-center">
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
                  const intensity = hasSales ? Math.min(1, daySales / maxDaySales) : 0;
                  
                  // Heatmap bg & border using subtle teal accents on white background
                  const heatBg = hasSales ? `rgba(13, 148, 136, ${0.03 + (intensity * 0.12)})` : '';
                  const heatBorder = hasSales ? `rgba(13, 148, 136, ${0.15 + (intensity * 0.25)})` : 'border-slate-200/60';

                  return (
                    <motion.button
                      key={`day-${day}`}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      style={!isSelected && hasSales ? { backgroundColor: heatBg, borderColor: heatBorder } : {}}
                      className={`relative p-3 flex flex-col justify-between h-20 rounded-xl transition-all duration-200 text-start group border ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50/40' 
                          : isToday 
                            ? 'border-teal-500 border-l-[3px] bg-teal-50/20 hover:border-slate-300' 
                            : 'border-slate-200/60 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Day Number */}
                      <div className="flex justify-between items-start w-full">
                        <span className={`text-[13px] font-semibold font-mono w-6 h-6 rounded flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'text-indigo-600 bg-indigo-100/50 font-bold' 
                            : isToday 
                              ? 'text-teal-600 bg-teal-100/50 font-bold' 
                              : 'text-slate-600 group-hover:text-slate-800'
                        }`}>
                          {day}
                        </span>
                        
                        {hasSales && !isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        )}
                      </div>

                      {/* Sales Total */}
                      <div className="flex flex-col text-start w-full mt-auto">
                        {hasSales ? (
                          <div className="flex flex-col">
                            <span className={`text-[18px] font-bold leading-none tracking-tight ${isSelected ? 'text-indigo-600' : 'text-teal-600 group-hover:text-teal-700'}`}>
                              {Math.round(daySales).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 uppercase mt-0.5 font-medium">
                              {t.currency}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[13px] text-slate-300 font-mono font-medium">—</span>
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
              <table className="w-full text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="p-3 text-center font-medium">{language === 'ar' ? 'اليوم' : 'Day'}</th>
                    <th className="p-3 text-center font-medium">{language === 'ar' ? 'عدد العمليات' : 'Tx Count'}</th>
                    <th className="p-3 text-center font-medium">{language === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
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
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="p-3 text-center font-semibold text-slate-800">
                            {language === 'ar' ? `يوم ${day}` : `Day ${day}`}
                          </td>
                          <td className="p-3 text-center text-slate-500 font-mono">
                            {dayTxCount}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-teal-600">
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
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 flex flex-col h-fit sticky top-6 self-start shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-[15px] font-medium text-slate-800 flex items-center gap-2">
              <CalendarIcon size={16} className="text-teal-500" />
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
                className="text-xs px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors border border-slate-200"
              >
                {language === 'ar' ? 'إلغاء' : 'Clear'}
              </button>
            )}
          </div>

          {selectedDay === null ? (
            <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 text-xs italic space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-1">
                <CalendarIcon size={20} className="text-slate-300" />
              </div>
              <p className="max-w-[200px] leading-relaxed">
                {language === 'ar' ? 'اضغط على أي يوم في التقويم لعرض تفاصيل الفواتير وتقارير المبيعات.' : 'Click any calendar day to inspect detailed customer invoices and reports.'}
              </p>
            </div>
          ) : selectedDaySales.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 text-xs italic space-y-2">
              <Info size={20} className="text-slate-300" />
              <p>{language === 'ar' ? 'لا توجد مبيعات مسجلة في هذا اليوم' : 'No invoices recorded on this day.'}</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {/* Daily KPI Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-500">{language === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
                  <span className="text-[15px] font-bold text-teal-600 font-mono mt-1">
                    {Math.round(selectedDaySales.reduce((sum, s) => sum + s.totalAmount, 0)).toLocaleString()} <span className="text-[9px] font-sans text-slate-400">{t.currency}</span>
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-500">{language === 'ar' ? 'عدد الفواتير' : 'Invoices'}</span>
                  <span className="text-[15px] font-bold text-teal-600 font-mono mt-1">
                    {selectedDaySales.length}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePrint(true)}
                  className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText size={14} className="text-slate-400" />
                  <span>{language === 'ar' ? 'طباعة ملخص' : 'Print Summary'}</span>
                </button>
                <button 
                  onClick={() => handlePrint(false)}
                  className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer size={14} className="text-slate-400" />
                  <span>{language === 'ar' ? 'طباعة كامل' : 'Print Full'}</span>
                </button>
              </div>

              {/* Invoices List */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                {selectedDaySales.map((sale: any) => (
                  <div 
                    key={sale.id}
                    onClick={() => handlePreviewInvoice(sale)}
                    className="bg-slate-100 border border-slate-200 hover:border-teal-300 hover:shadow-md p-3 rounded-xl flex flex-col gap-2 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-[10px] border border-teal-100">
                        #{sale.invoiceNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={(e) => handlePrintInvoice(sale, e)}
                          className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors border border-slate-200"
                          title={language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
                        >
                          <Printer size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSale(sale, e)}
                          className="p-1 rounded bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors border border-slate-200 hover:border-rose-200"
                          title={language === 'ar' ? 'حذف الفاتورة' : 'Delete Invoice'}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span>{language === 'ar' ? 'الدفع:' : 'Payment:'}</span>
                        <span className="text-slate-700 capitalize font-medium">{sale.paymentMethod}</span>
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="font-mono font-bold text-slate-800 text-[12px]">
                          {Math.round(sale.totalAmount).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-slate-500">{t.currency}</span>
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

    </motion.div>
  );
};
