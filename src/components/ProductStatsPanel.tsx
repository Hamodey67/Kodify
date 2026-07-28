import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Package, AlertTriangle, Activity, Printer } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { useSettingsStore } from '../store/settingsStore';

interface Product {
  id: number;
  barcode: string | null;
  sku: string | null;
  nameAr: string;
  nameEn: string;
  nameKu: string | null;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  taxRate: number;
  image?: string | null;
  color?: string | null;
}

interface ProductStatsPanelProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface StatsData {
  totalUnitsSold: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;
}

export const ProductStatsPanel: React.FC<ProductStatsPanelProps> = ({ product, isOpen, onClose }) => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    if (!product) return;
    setIsPrinting(true);
    try {
      const getSetting = useSettingsStore.getState().getSetting;
      const config = {
        mockMode: getSetting('hardware_mock_mode', 'true') === 'true',
        printerType: 'windows',
        connectionPath: getSetting('hardware_printer_ip', 'POSPrinter POS80')
      };

      const reportData = {
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        nameKu: product.nameKu || null,
        barcode: product.barcode,
        sku: product.sku,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: product.minStock,
        totalUnitsSold: stats?.totalUnitsSold || 0,
        totalRevenue: stats?.totalRevenue || 0,
        totalCost: stats?.totalCost || 0,
        netProfit: stats?.netProfit || 0,
        profitMargin: stats?.profitMargin || 0,
      };

      await window.api.printProductReport(reportData, config);
    } catch (error) {
      console.error('Failed to print product report:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    if (product && isOpen) {
      const fetchStats = async () => {
        setLoading(true);
        try {
          const data = await window.api.getProductStats(product.id);
          setStats(data);
        } catch (error) {
          console.error('Error fetching product stats:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    } else {
      setStats(null);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const isLowStock = product.stock <= product.minStock;
  const productName = language === 'ar' ? product.nameAr : language === 'ku' ? (product.nameKu || product.nameAr) : product.nameEn;
  const secondaryName = language === 'ar' ? product.nameEn : product.nameAr;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Panel */}
      <motion.div
        initial={{ x: dir === 'rtl' ? -320 : 320, opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: dir === 'rtl' ? -320 : 320, opacity: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ width: '320px', borderTopColor: product.color || undefined, borderTopWidth: product.color ? '3px' : undefined }}
        className="fixed lg:relative inset-y-0 right-0 lg:inset-auto h-full z-50 lg:z-0 bg-[#fbfcfe] border-l border-[#e3e9f1] flex flex-col shadow-[0_24px_60px_rgba(15,23,42,0.12)] lg:shadow-none select-text shrink-0"
        dir={dir}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e3e9f1] flex justify-between items-center bg-[#f4f7fb]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={16} />
            </span>
            <h3 className="font-extrabold text-sm text-[#18212f]">{t.productStats}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              disabled={isPrinting || loading}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title={t.printProductDetails}
            >
              {isPrinting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#2563eb] border-r-2 border-[#e3e9f1]" />
              ) : (
                <Printer size={16} />
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 bg-[#fbfcfe]">
          {/* Title & Category Badge */}
          <div className="space-y-2">
            {product.image && (
              <div className="w-full h-32 rounded-xl overflow-hidden border border-[#e3e9f1] bg-[#f4f7fb] mb-3">
                <img src={product.image} alt={productName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-black text-base text-[#18212f] leading-tight">{productName}</span>
                {secondaryName && (
                  <span className="text-xs text-[#64748b] mt-1">{secondaryName}</span>
                )}
              </div>
            </div>
            <div className="inline-block bg-blue-50 border border-[#bfdbfe] text-blue-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
              {product.category}
            </div>
          </div>

          {/* Pricing Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#fbfcfe] border border-[#e3e9f1] p-3 rounded-xl flex flex-col gap-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <span className="text-[10px] font-bold text-[#64748b]">{t.cost}</span>
              <span className="text-sm font-bold text-[#b45309] font-mono">
                {Math.round(product.cost).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
              </span>
            </div>
            <div className="bg-[#fbfcfe] border border-[#e3e9f1] p-3 rounded-xl flex flex-col gap-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <span className="text-[10px] font-bold text-[#64748b]">{t.priceWithTax}</span>
              <span className="text-sm font-bold text-[#2563eb] font-mono">
                {Math.round(product.price).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
              </span>
            </div>
          </div>

          {/* Stock Level Card */}
          <div className={`border p-4 rounded-xl flex flex-col gap-2 ${isLowStock ? 'bg-rose-50 border-rose-200' : 'bg-[#fbfcfe] border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)]'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#334155] flex items-center gap-1.5">
                <Package size={14} className="text-[#64748b]" />
                <span>{t.currentStock}</span>
              </span>
              <span className={`font-mono font-black text-base ${isLowStock ? 'text-[#dc2626]' : 'text-[#18212f]'}`}>
                {product.stock}
              </span>
            </div>

            {isLowStock && (
              <div className="mt-1 flex items-center gap-1.5 bg-rose-100/60 border border-rose-200 text-[#dc2626] text-[10px] py-1.5 px-2.5 rounded-lg font-bold">
                <AlertTriangle size={12} className="shrink-0" />
                <span>{t.lowStockWarning} ({t.minStock}: {product.minStock})</span>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-4 pt-4 border-t border-[#e8edf4]">
            <h4 className="text-xs font-black text-[#64748b] tracking-wider uppercase">
              {language === 'ar' ? 'أداء المبيعات' : 'Sales Performance'}
            </h4>

            {loading ? (
              <div className="flex py-10 justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#2563eb] border-r-2 border-[#e3e9f1]"></div>
              </div>
            ) : !stats || stats.totalUnitsSold === 0 ? (
              <div className="text-center py-8 bg-[#f4f7fb] border border-dashed border-[#e3e9f1] rounded-xl">
                <p className="text-xs text-[#64748b] font-bold">{t.noSalesRecorded}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Units Sold */}
                <div className="flex items-center justify-between p-3 bg-[#fbfcfe] border border-[#e3e9f1] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <span className="text-xs font-bold text-[#334155]">{t.totalUnitsSold}</span>
                  <span className="font-mono font-black text-sm text-[#18212f]">{stats.totalUnitsSold}</span>
                </div>

                {/* Revenue */}
                <div className="flex items-center justify-between p-3 bg-[#fbfcfe] border border-[#e3e9f1] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <span className="text-xs font-bold text-[#334155]">{t.totalRevenue}</span>
                  <span className="font-mono font-black text-sm text-[#2563eb]">
                    {Math.round(stats.totalRevenue).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
                  </span>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between p-3 bg-[#fbfcfe] border border-[#e3e9f1] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <span className="text-xs font-bold text-[#334155]">{t.totalCost}</span>
                  <span className="font-mono font-black text-sm text-[#b45309]">
                    {Math.round(stats.totalCost).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
                  </span>
                </div>

                {/* Net Profit */}
                <div className="flex items-center justify-between p-3 bg-[#fbfcfe] border border-[#e3e9f1] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <span className="text-xs font-bold text-[#334155]">{t.todayProfit}</span>
                  <span className={`font-mono font-black text-sm ${stats.netProfit >= 0 ? 'text-[#047857]' : 'text-[#dc2626]'}`}>
                    {Math.round(stats.netProfit).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
                  </span>
                </div>

                {/* Margin */}
                <div className="flex items-center justify-between p-3 bg-[#fbfcfe] border border-[#e3e9f1] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <span className="text-xs font-bold text-[#334155]">{t.profitMargin}</span>
                  <div className="flex items-center gap-1.5">
                    {stats.netProfit >= 0 ? (
                      <TrendingUp size={14} className="text-emerald-500" />
                    ) : (
                      <TrendingDown size={14} className="text-[#dc2626]" />
                    )}
                    <span className={`font-mono font-black text-sm ${stats.netProfit >= 0 ? 'text-[#047857]' : 'text-[#dc2626]'}`}>
                      {stats.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              onClick={handlePrint}
              disabled={isPrinting || loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:translate-y-px text-white font-extrabold text-xs shadow-[0_8px_20px_rgba(37,99,235,0.28)] transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
            >
              {isPrinting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-r-2 border-white/30" />
                  <span>{language === 'ar' ? 'جاري الطباعة...' : language === 'ku' ? 'چاپ دەکرێت...' : 'Printing...'}</span>
                </>
              ) : (
                <>
                  <Printer size={15} />
                  <span>{t.printProductDetails}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
