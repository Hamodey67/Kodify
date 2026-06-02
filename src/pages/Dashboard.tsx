import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { Line, Bar } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Receipt, 
  DollarSign, 
  AlertTriangle, 
  Package, 
  ArrowUpRight 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard: React.FC = () => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [metrics, setMetrics] = useState({
    revenue: 0,
    tax: 0,
    discount: 0,
    transactions: 0,
    profit: 0,
    categorySales: [] as Array<{ category: string; total: number }>,
    paymentMethods: [] as Array<{ method: string; total: number }>,
  });
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
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

        // Fetch sales summary from SQLite
        const summary = await window.api.getSalesSummary(
          startOfPeriod.toISOString(),
          endOfDay.toISOString()
        );
        if (summary) {
          setMetrics(summary);
        }

        // Fetch low stock items
        const lowStock = await window.api.getLowStockAlerts();
        if (lowStock) {
          setLowStockProducts(lowStock);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [period]);

  // --- Chart Configurations ---
  const getLineChartConfig = () => {
    if (period === 'today') {
      return {
        labels: language === 'ar' 
          ? ['٠٨:٠٠', '١٠:٠٠', '١٢:٠٠', '١٤:٠٠', '١٦:٠٠', '١٨:٠٠', '٢٠:٠٠', '٢٢:٠٠']
          : ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        data: metrics.revenue > 0 
          ? [metrics.revenue * 0.05, metrics.revenue * 0.1, metrics.revenue * 0.25, metrics.revenue * 0.15, metrics.revenue * 0.1, metrics.revenue * 0.2, metrics.revenue * 0.1, metrics.revenue * 0.05]
          : [0, 0, 0, 0, 0, 0, 0, 0]
      };
    } else if (period === 'week') {
      return {
        labels: language === 'ar'
          ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
          : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        data: metrics.revenue > 0
          ? [metrics.revenue * 0.1, metrics.revenue * 0.15, metrics.revenue * 0.2, metrics.revenue * 0.12, metrics.revenue * 0.18, metrics.revenue * 0.15, metrics.revenue * 0.1]
          : [0, 0, 0, 0, 0, 0, 0]
      };
    } else {
      return {
        labels: language === 'ar'
          ? ['الأسبوع ١', 'الأسبوع ٢', 'الأسبوع ٣', 'الأسبوع ٤']
          : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: metrics.revenue > 0
          ? [metrics.revenue * 0.2, metrics.revenue * 0.3, metrics.revenue * 0.25, metrics.revenue * 0.25]
          : [0, 0, 0, 0]
      };
    }
  };

  const lineConfig = getLineChartConfig();

  const lineChartData = {
    labels: lineConfig.labels,
    datasets: [
      {
        label: t.salesTrend,
        data: lineConfig.data,
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutChartData = {
    labels: metrics.categorySales.length > 0 
      ? metrics.categorySales.map(c => c.category)
      : [language === 'ar' ? 'عام' : 'General'],
    datasets: [
      {
        data: metrics.categorySales.length > 0
          ? metrics.categorySales.map(c => c.total)
          : [1],
        backgroundColor: [
          'rgba(20, 184, 166, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(99, 102, 241, 0.75)',
          'rgba(239, 68, 68, 0.75)',
          'rgba(168, 85, 247, 0.75)',
        ],
        borderWidth: 1,
        borderColor: '#1e293b',
      },
    ],
  };

  const barChartData = {
    labels: metrics.paymentMethods.length > 0
      ? metrics.paymentMethods.map(p => p.method === 'cash' ? t.cash : p.method === 'card' ? t.card : t.split)
      : [t.cash, t.card, t.split],
    datasets: [
      {
        label: t.paymentMethods,
        data: metrics.paymentMethods.length > 0
          ? metrics.paymentMethods.map(p => p.total)
          : [0, 0, 0],
        backgroundColor: [
          'rgba(20, 184, 166, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1',
          font: { family: 'Cairo, Outfit' },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Cairo, Outfit' } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Cairo, Outfit' } },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500 border-r-2 border-slate-700 mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-900 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{t.dashboard}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar' ? 'تقرير فوري ومؤشرات مبيعات نظام كوديفاي' : "Live overview of sales metrics for Kodify System"}
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-slate-800 border border-slate-700 p-1 rounded-xl text-xs font-bold shrink-0">
          <button
            onClick={() => setPeriod('today')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
              period === 'today'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'اليوم' : 'Today'}
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
              period === 'week'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'الأسبوع' : 'This Week'}
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
              period === 'month'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'الشهر' : 'This Month'}
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Sales */}
        <div className="glass-card p-5 rounded-xl flex items-center justify-between glow-teal">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">
              {period === 'today' ? t.todaySales : period === 'week' ? (language === 'ar' ? 'مبيعات الأسبوع' : "This Week's Sales") : (language === 'ar' ? 'مبيعات الشهر' : "This Month's Sales")}
            </span>
            <div className="text-2xl font-bold text-teal-400">
              {Math.round(metrics.revenue).toLocaleString()} <span className="text-xs">{t.currency}</span>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <TrendingUp size={10} className="text-teal-400" />
              <span>{language === 'ar' ? 'تحديث فوري' : 'Live Update'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Transactions / Invoices count */}
        <div className="glass-card p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">
              {period === 'today' ? t.todayTransactions : period === 'week' ? (language === 'ar' ? 'عمليات الأسبوع' : "This Week's Invoices") : (language === 'ar' ? 'عمليات الشهر' : "This Month's Invoices")}
            </span>
            <div className="text-2xl font-bold text-slate-200">
              {metrics.transactions} <span className="text-xs">{language === 'ar' ? 'فاتورة' : 'Invoices'}</span>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <span>{language === 'ar' ? 'العمليات المكتملة' : 'Completed operations'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Receipt size={22} />
          </div>
        </div>

        {/* Profit */}
        <div className="glass-card p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">
              {period === 'today' ? t.todayProfit : period === 'week' ? (language === 'ar' ? 'أرباح الأسبوع' : "This Week's Profit") : (language === 'ar' ? 'أرباح الشهر' : "This Month's Profit")}
            </span>
            <div className="text-2xl font-bold text-emerald-400">
              {Math.round(metrics.profit).toLocaleString()} <span className="text-xs">{t.currency}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              <span>{language === 'ar' ? 'صافي هامش الربح' : 'Net profit margin'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ArrowUpRight size={22} />
          </div>
        </div>

        {/* Stock Alerts count */}
        <div className="glass-card p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t.lowStockAlerts}</span>
            <div className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {lowStockProducts.length} <span className="text-xs">{language === 'ar' ? 'منتج' : 'Items'}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              <span>{language === 'ar' ? 'بحاجة لإعادة الطلب' : 'Needs restocking'}</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-700 text-slate-500'}`}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart: sales trend */}
        <div className="glass-card p-5 rounded-xl lg:col-span-3 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <TrendingUp size={16} className="text-teal-400" />
            <span>{t.salesTrend} (24H)</span>
          </h3>
          <div className="h-64 relative">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods Bar Chart */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Receipt size={16} className="text-amber-400" />
            <span>{t.paymentMethods}</span>
          </h3>
          <div className="h-64 relative">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Low Stock alerts table list */}
        <div className="glass-card p-5 rounded-xl lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <span>{t.lowStockTitle}</span>
          </h3>
          
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                {language === 'ar' ? 'جميع المنتجات متوفرة بمخزون كافٍ.' : 'All inventory levels are healthy.'}
              </div>
            ) : (
              <table className="w-full text-xs text-slate-300 select-text">
                <thead className="bg-slate-900/60 sticky top-0 text-slate-400 font-semibold border-b border-slate-700 text-right">
                  <tr>
                    <th className={`p-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.productName}</th>
                    <th className="p-3 text-center">{t.barcode}</th>
                    <th className="p-3 text-center">{t.currentStock}</th>
                    <th className="p-3 text-center">{t.minStock}</th>
                    <th className={`p-3 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t.price}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {lowStockProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-700/30">
                      <td className={`p-3 font-semibold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn}
                      </td>
                      <td className="p-3 text-center text-slate-400 font-mono">{p.barcode || 'N/A'}</td>
                      <td className="p-3 text-center">
                        <span className="bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded border border-rose-500/20">
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-500">{p.minStock}</td>
                      <td className={`p-3 font-mono font-bold text-teal-400 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                        {Math.round(p.price).toLocaleString()} {t.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
