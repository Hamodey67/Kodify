import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { Line, Bar } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Receipt, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
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

import { DashboardInvoicesModal } from '../components/DashboardInvoicesModal';

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

  // Modal State
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false);

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
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.10)',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fbfcfe',
        pointBorderWidth: 2,
        pointRadius: 4,
        borderWidth: 3,
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
          '#2563eb',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#06b6d4',
        ],
        borderWidth: 2,
        borderColor: '#fbfcfe',
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
          '#10b981',
          '#2563eb',
          '#f59e0b',
        ],
        borderRadius: 8,
        maxBarThickness: 56,
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
          color: '#475569',
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 16,
          font: { family: 'Cairo, IBM Plex Sans', weight: 600 as const },
        },
      },
      tooltip: {
        backgroundColor: '#18212f',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Cairo, IBM Plex Sans' },
        bodyFont: { family: 'Cairo, IBM Plex Sans' },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#64748b', font: { family: 'Cairo, IBM Plex Sans' } },
      },
      y: {
        grid: { color: '#e8edf4' },
        border: { display: false },
        ticks: { color: '#64748b', font: { family: 'Cairo, IBM Plex Sans' } },
      },
    },
  };

  const periodOptions: Array<{ id: 'today' | 'week' | 'month'; label: string }> = [
    { id: 'today', label: language === 'ar' ? 'اليوم' : 'Today' },
    { id: 'week', label: language === 'ar' ? 'الأسبوع' : 'This Week' },
    { id: 'month', label: language === 'ar' ? 'الشهر' : 'This Month' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#eef2f8] text-[#64748b]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-[#e3e9f1] border-t-[#2563eb]" />
          <p className="text-sm font-semibold">{t.loading}</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      key: 'revenue',
      label:
        period === 'today'
          ? t.todaySales
          : period === 'week'
            ? language === 'ar' ? 'مبيعات الأسبوع' : "This Week's Sales"
            : language === 'ar' ? 'مبيعات الشهر' : "This Month's Sales",
      value: `${Math.round(metrics.revenue).toLocaleString()}`,
      unit: t.currency,
      hint: language === 'ar' ? 'تحديث فوري' : 'Live update',
      icon: DollarSign,
      accent: '#2563eb',
      chip: 'bg-blue-50 text-blue-600',
      valueClass: 'text-[#1d4ed8]',
      onClick: undefined as undefined | (() => void),
    },
    {
      key: 'transactions',
      label:
        period === 'today'
          ? t.todayTransactions
          : period === 'week'
            ? language === 'ar' ? 'عمليات الأسبوع' : "This Week's Invoices"
            : language === 'ar' ? 'عمليات الشهر' : "This Month's Invoices",
      value: `${metrics.transactions}`,
      unit: language === 'ar' ? 'فاتورة' : 'Invoices',
      hint: language === 'ar' ? 'اضغط لعرض التفاصيل' : 'Click to view details',
      icon: Receipt,
      accent: '#06b6d4',
      chip: 'bg-cyan-50 text-cyan-600',
      valueClass: 'text-[#18212f]',
      onClick: () => setIsInvoicesModalOpen(true),
    },
    {
      key: 'profit',
      label:
        period === 'today'
          ? t.todayProfit
          : period === 'week'
            ? language === 'ar' ? 'أرباح الأسبوع' : "This Week's Profit"
            : language === 'ar' ? 'أرباح الشهر' : "This Month's Profit",
      value: `${Math.round(metrics.profit).toLocaleString()}`,
      unit: t.currency,
      hint: language === 'ar' ? 'صافي هامش الربح' : 'Net profit margin',
      icon: ArrowUpRight,
      accent: '#10b981',
      chip: 'bg-emerald-50 text-emerald-600',
      valueClass: 'text-[#047857]',
      onClick: undefined,
    },
    {
      key: 'stock',
      label: t.lowStockAlerts,
      value: `${lowStockProducts.length}`,
      unit: language === 'ar' ? 'منتج' : 'Items',
      hint: language === 'ar' ? 'بحاجة لإعادة الطلب' : 'Needs restocking',
      icon: AlertTriangle,
      accent: lowStockProducts.length > 0 ? '#f59e0b' : '#94a3b8',
      chip: lowStockProducts.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400',
      valueClass: lowStockProducts.length > 0 ? 'text-[#b45309]' : 'text-[#94a3b8]',
      onClick: undefined,
    },
  ];

  return (
    <div className="flex-1 space-y-6 overflow-y-auto bg-[#eef2f8] p-6 custom-scrollbar">
      
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18212f]">{t.dashboard}</h1>
          <p className="mt-1 text-xs font-medium text-[#64748b]">
            {language === 'ar' ? 'تقرير فوري ومؤشرات مبيعات نظام كوديفاي' : "Live overview of sales metrics for Kodify System"}
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex shrink-0 rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] p-1 text-xs font-bold shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {periodOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setPeriod(option.id)}
              className={`rounded-lg px-4 py-2 transition-colors duration-150 ${
                period === option.id
                  ? 'bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(37,99,235,0.25)]'
                  : 'text-[#64748b] hover:bg-[#eef2f7] hover:text-[#18212f]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
          return (
            <div
              key={card.key}
              onClick={card.onClick}
              className={`group relative overflow-hidden rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-150 ${
                card.onClick
                  ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#bfdbfe] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]'
                  : ''
              }`}
            >
              <span
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: card.accent }}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                  <span className="block text-xs font-bold text-[#64748b]">{card.label}</span>
                  <div className={`text-[26px] font-extrabold leading-none tracking-tight ${card.valueClass}`}>
                    {card.value}{' '}
                    <span className="text-xs font-bold text-[#94a3b8]">{card.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#94a3b8]">
                    {card.key === 'revenue' && <TrendingUp size={11} className="text-emerald-500" />}
                    <span>{card.hint}</span>
                    {card.onClick && (
                      <Chevron size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </div>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.chip}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales trend */}
      <div className="space-y-4 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#18212f]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp size={16} />
            </span>
            <span>{t.salesTrend}</span>
          </h3>
          <span className="rounded-lg bg-[#eef2f7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            {periodOptions.find((o) => o.id === period)?.label}
          </span>
        </div>
        <div className="relative h-64">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Methods Bar Chart */}
        <div className="space-y-4 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#18212f]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Receipt size={16} />
            </span>
            <span>{t.paymentMethods}</span>
          </h3>
          <div className="relative h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Low Stock alerts table list */}
        <div className="space-y-4 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#18212f]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle size={16} />
              </span>
              <span>{t.lowStockTitle}</span>
            </h3>
            {lowStockProducts.length > 0 && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                {lowStockProducts.length}
              </span>
            )}
          </div>
          
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center text-xs font-semibold text-[#94a3b8]">
                {language === 'ar' ? 'جميع المنتجات متوفرة بمخزون كافٍ.' : 'All inventory levels are healthy.'}
              </div>
            ) : (
              <table className="w-full select-text text-xs text-[#334155]">
                <thead className="sticky top-0 border-b border-[#e3e9f1] bg-[#f4f7fb] font-bold text-[#64748b]">
                  <tr>
                    <th className={`p-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.productName}</th>
                    <th className="p-3 text-center">{t.barcode}</th>
                    <th className="p-3 text-center">{t.currentStock}</th>
                    <th className="p-3 text-center">{t.minStock}</th>
                    <th className={`p-3 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t.price}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8edf4]">
                  {lowStockProducts.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-[#f4f7fb]">
                      <td className={`p-3 font-bold text-[#18212f] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn}
                      </td>
                      <td className="p-3 text-center font-mono text-[#64748b]">{p.barcode || 'N/A'}</td>
                      <td className="p-3 text-center">
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 font-bold text-rose-600 ring-1 ring-rose-200">
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3 text-center text-[#94a3b8]">{p.minStock}</td>
                      <td className={`p-3 font-mono font-bold text-[#1d4ed8] ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
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

      <DashboardInvoicesModal
        isOpen={isInvoicesModalOpen}
        onClose={() => setIsInvoicesModalOpen(false)}
        period={period}
      />

    </div>
  );
};
