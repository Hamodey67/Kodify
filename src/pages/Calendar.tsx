import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  List,
  Grid,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Calendar: React.FC = () => {
  const { language, dir } = useLanguageStore();
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

  const emptyCells = Array(firstDayIndex).fill(null);
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = [...emptyCells, ...dayCells];

  // Calculate maximum sales in a single day for heatmap opacity scale
  const maxDaySales = Math.max(...Object.values(dailySales), 1);

  // Filter sales for the selected day
  const selectedDaySales = monthlySalesList.filter(s => {
    if (selectedDay === null) return false;
    const date = new Date(s.createdAt);
    return date.getDate() === selectedDay && s.status === 'completed';
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-pos-bg space-y-6"
    >
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/6 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <CalendarIcon className="text-cyan-200" size={24} />
            <span>{language === 'ar' ? 'تقويم المبيعات اليومية' : 'Daily Sales Calendar'}</span>
          </h1>
          <p className="text-sm text-slate-300/70 mt-1">
            {language === 'ar' 
              ? 'متابعة إجمالي مبيعات المتجر اليومية والافتراضية مرتبة حسب أيام الشهر' 
              : 'Monitor store checkout revenue aggregated daily across month days'}
          </p>
        </div>
      </div>

      {/* Calendar Controls & View Toggler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        {/* Month Selector Panel */}
        <div className="md:col-span-2 glass-card p-3 rounded-2xl border border-white/8 flex items-center justify-between shadow-glass">
          <button
            onClick={dir === 'rtl' ? handleNextMonth : handlePrevMonth}
            className="p-2 bg-slate-800/90 border border-white/8 hover:border-indigo-400/30 text-slate-200/70 hover:text-slate-100 rounded-xl transition-all duration-200 active:scale-95"
          >
            {dir === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <div className="flex items-center gap-2">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}
              className="bg-slate-800/90 border border-white/8 text-slate-100 px-4 py-2 rounded-xl text-sm font-extrabold focus:border-indigo-400/30 focus:outline-none cursor-pointer"
            >
              {(language === 'ar' ? monthsAr : monthsEn).map((m, idx) => (
                <option key={idx} value={idx} className="bg-slate-900 text-slate-100">{m}</option>
              ))}
            </select>

            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}
              className="bg-slate-800/90 border border-white/8 text-slate-100 px-4 py-2 rounded-xl text-sm font-extrabold focus:border-indigo-400/30 focus:outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-slate-100">{y}</option>
              ))}
            </select>
          </div>

          <button
            onClick={dir === 'rtl' ? handlePrevMonth : handleNextMonth}
            className="p-2 bg-slate-800/90 border border-white/8 hover:border-indigo-400/30 text-slate-200/70 hover:text-slate-100 rounded-xl transition-all duration-200 active:scale-95"
          >
            {dir === 'rtl' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="glass-card p-1 rounded-2xl border border-white/8 flex items-center justify-around md:col-span-1 shadow-glass">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'grid' ? 'bg-[linear-gradient(135deg,rgba(99,102,241,0.30),rgba(6,182,212,0.22))] text-white shadow-glow-indigo border border-white/10' : 'text-slate-300/70 hover:text-slate-100'
            }`}
          >
            <Grid size={14} />
            <span>{language === 'ar' ? 'التقويم' : 'Calendar'}</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'list' ? 'bg-[linear-gradient(135deg,rgba(99,102,241,0.30),rgba(6,182,212,0.22))] text-white shadow-glow-indigo border border-white/10' : 'text-slate-300/70 hover:text-slate-100'
            }`}
          >
            <List size={14} />
            <span>{language === 'ar' ? 'قائمة المبيعات' : 'List View'}</span>
          </button>
        </div>

        {/* Monthly Total KPI Card */}
        <div className="glass-card border border-white/8 px-4 py-3 rounded-2xl flex items-center justify-between shadow-glass relative overflow-hidden md:col-span-1">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(6,182,212,0.18),transparent_55%)]" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
              {language === 'ar' ? 'مجموع مبيعات الشهر' : 'Month Total'}
            </span>
            <span className="text-base font-black text-cyan-200 font-mono mt-0.5">
              {Math.round(monthlyTotal).toLocaleString()} <span className="text-[10px] font-sans font-normal text-slate-400">{t.currency}</span>
            </span>
          </div>
          <div className="p-2 bg-cyan-500/10 text-cyan-200 rounded-xl border border-cyan-400/20 shadow-glow-cyan relative">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid or List View (Left/Main Panel) */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/8 overflow-hidden shadow-glass p-4">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 border-r-2 border-slate-700"></div>
              <p className="text-xs">{t.loading}</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-4">
              {/* Weekdays Header */}
              <div className="grid grid-cols-7 gap-2 text-center text-slate-400 text-[10px] font-bold py-1 border-b border-slate-800">
                {(language === 'ar' ? weekDaysAr : weekDaysEn).map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7 gap-2">
                {totalCells.map((day, cellIdx) => {
                  if (day === null) {
                    return (
                      <div 
                        key={`empty-${cellIdx}`} 
                        className="bg-slate-800/5 border border-transparent rounded-xl h-20"
                      />
                    );
                  }

                  const daySales = dailySales[day] || 0;
                  const isToday = 
                    now.getDate() === day && 
                    now.getMonth() === currentMonth && 
                    now.getFullYear() === currentYear;
                  
                  const isSelected = selectedDay === day;

                  // Sales Heatmap calculation
                  const opacity = daySales > 0 ? Math.min(0.22, (daySales / maxDaySales) * 0.22) : 0;
                  const cellStyle = daySales > 0 ? {
                    backgroundColor: `rgba(20, 184, 166, ${0.05 + opacity})`,
                  } : {};

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      style={cellStyle}
                      className={`p-2 flex flex-col justify-between h-20 rounded-xl transition-all duration-200 text-right group border ${
                        isSelected 
                          ? 'border-teal-500 ring-2 ring-teal-500/20 scale-102 z-10' 
                          : isToday 
                            ? 'border-teal-500/60 bg-slate-800/50' 
                            : 'border-slate-800/60 bg-slate-800/20 hover:border-slate-700'
                      }`}
                    >
                      {/* Day Number */}
                      <span className={`text-[10px] font-bold font-mono ${
                        isToday 
                          ? 'text-white bg-teal-500 w-4 h-4 rounded-full flex items-center justify-center' 
                          : isSelected 
                            ? 'text-teal-400' 
                            : 'text-slate-500'
                      }`}>
                        {day}
                      </span>

                      {/* Sales Total */}
                      {daySales > 0 ? (
                        <div className="flex flex-col text-left w-full">
                          <span className="text-[10px] font-extrabold text-teal-400 font-mono leading-none">
                            {Math.round(daySales).toLocaleString()}
                          </span>
                          <span className="text-[7px] text-slate-500 leading-none mt-0.5">
                            {t.currency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-700 font-mono">-</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List View mode */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300">
                <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold">
                  <tr>
                    <th className="p-3 text-center">{language === 'ar' ? 'اليوم' : 'Day'}</th>
                    <th className="p-3 text-center">{language === 'ar' ? 'عدد العمليات' : 'Tx Count'}</th>
                    <th className="p-3 text-center">{language === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {dayCells
                    .filter(day => (dailySales[day] || 0) > 0)
                    .map(day => {
                      const dayTxCount = monthlySalesList.filter(s => {
                        const d = new Date(s.createdAt);
                        return d.getDate() === day && s.status === 'completed';
                      }).length;

                      return (
                        <tr 
                          key={day} 
                          onClick={() => { setSelectedDay(day); setViewMode('grid'); }}
                          className="hover:bg-slate-700/30 cursor-pointer transition-colors"
                        >
                          <td className="p-3 text-center font-bold text-slate-200">
                            {language === 'ar' ? `يوم ${day}` : `Day ${day}`}
                          </td>
                          <td className="p-3 text-center text-slate-400 font-mono">
                            {dayTxCount}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-teal-400">
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
        <div className="glass-card rounded-2xl border border-slate-800/80 p-4 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-teal-400" />
              <span>
                {selectedDay !== null 
                  ? (language === 'ar' ? `تفاصيل مبيعات يوم ${selectedDay}` : `Sales of Day ${selectedDay}`) 
                  : (language === 'ar' ? 'اختر يوماً للتفاصيل' : 'Select a Day for Details')
                }
              </span>
            </h3>
            {selectedDay !== null && (
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                {language === 'ar' ? 'إلغاء التحديد' : 'Deselect'}
              </button>
            )}
          </div>

          {selectedDay === null ? (
            <div className="py-24 text-center text-slate-500 text-xs italic space-y-2">
              <Info size={20} className="mx-auto text-slate-600" />
              <p>{language === 'ar' ? 'اضغط على أي يوم يحتوي مبيعات لعرض تفاصيل الفواتير والعمليات.' : 'Click any calendar day to inspect detailed customer invoices.'}</p>
            </div>
          ) : selectedDaySales.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs italic">
              {language === 'ar' ? 'لا توجد مبيعات في هذا اليوم' : 'No invoices on this day.'}
            </div>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-1">
              {selectedDaySales.map((sale: any) => (
                <div 
                  key={sale.id}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-3 rounded-xl space-y-2 transition-all"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono font-bold text-teal-400">#{sale.invoiceNumber}</span>
                    <span className="text-slate-500">{new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold truncate max-w-[120px]">{sale.customerName || (language === 'ar' ? 'عميل سفري' : 'Walk-in')}</span>
                    <span className="font-mono font-black text-teal-400">{Math.round(sale.totalAmount).toLocaleString()} {t.currency}</span>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1 border-t border-slate-800/40">
                    <span>{language === 'ar' ? 'طريقة الدفع:' : 'Payment:'} {sale.paymentMethod}</span>
                    <span className="text-slate-500">{sale.cashierName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </motion.div>
  );
};
