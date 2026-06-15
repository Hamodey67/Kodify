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
        className="fixed lg:relative inset-y-0 right-0 lg:inset-auto h-full z-50 lg:z-0 bg-slate-900 border-l border-white/10 flex flex-col shadow-2xl lg:shadow-none select-text shrink-0"
        dir={dir}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/8 flex justify-between items-center bg-white/3">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-teal-400 animate-pulse" />
            <h3 className="font-extrabold text-sm text-slate-100">{t.productStats}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              disabled={isPrinting || loading}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title={t.printProductDetails}
            >
              {isPrinting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-teal-400 border-r-2 border-white/10" />
              ) : (
                <Printer size={16} />
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
          {/* Title & Category Badge */}
          <div className="space-y-2">
            {product.image && (
              <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-slate-950/50 mb-3 shadow-inner">
                <img src={product.image} alt={productName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-black text-base text-slate-100 leading-tight">{productName}</span>
                {secondaryName && (
                  <span className="text-xs text-slate-400 mt-1">{secondaryName}</span>
                )}
              </div>
            </div>
            <div className="inline-block bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
              {product.category}
            </div>
          </div>

          {/* Pricing Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/3 border border-white/6 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400">{t.cost}</span>
              <span className="text-sm font-bold text-amber-300 font-mono">
                {Math.round(product.cost).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
              </span>
            </div>
            <div className="bg-white/3 border border-white/6 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400">{t.priceWithTax}</span>
              <span className="text-sm font-bold text-teal-300 font-mono">
                {Math.round(product.price).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
              </span>
            </div>
          </div>

          {/* Stock Level Card */}
          <div className={`border p-4 rounded-xl flex flex-col gap-2 ${isLowStock ? 'bg-rose-500/5 border-rose-500/20' : 'bg-white/3 border-white/6'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                <Package size={14} className="text-slate-400" />
                <span>{t.currentStock}</span>
              </span>
              <span className={`font-mono font-black text-base ${isLowStock ? 'text-rose-400' : 'text-slate-100'}`}>
                {product.stock}
              </span>
            </div>

            {isLowStock && (
              <div className="mt-1 flex items-center gap-1.5 bg-rose-500/10 border border-rose-400/20 text-rose-300 text-[10px] py-1.5 px-2.5 rounded-lg font-bold">
                <AlertTriangle size={12} className="shrink-0" />
                <span>{t.lowStockWarning} ({t.minStock}: {product.minStock})</span>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-4 pt-4 border-t border-white/8">
            <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">
              {language === 'ar' ? 'أداء المبيعات' : 'Sales Performance'}
            </h4>

            {loading ? (
              <div className="flex py-10 justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-teal-400 border-r-2 border-white/10"></div>
              </div>
            ) : !stats || stats.totalUnitsSold === 0 ? (
              <div className="text-center py-8 bg-white/2 border border-dashed border-white/8 rounded-xl">
                <p className="text-xs text-slate-400 font-bold">{t.noSalesRecorded}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Units Sold */}
                <div className="flex items-center justify-between p-3 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-xs font-bold text-slate-300">{t.totalUnitsSold}</span>
                  <span className="font-mono font-black text-sm text-slate-100">{stats.totalUnitsSold}</span>
                </div>

                {/* Revenue */}
                <div className="flex items-center justify-between p-3 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-xs font-bold text-slate-300">{t.totalRevenue}</span>
                  <span className="font-mono font-black text-sm text-teal-300">
                    {Math.round(stats.totalRevenue).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
                  </span>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between p-3 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-xs font-bold text-slate-300">{t.totalCost}</span>
                  <span className="font-mono font-black text-sm text-amber-300">
                    {Math.round(stats.totalCost).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
                  </span>
                </div>

                {/* Net Profit */}
                <div className="flex items-center justify-between p-3 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-xs font-bold text-slate-300">{t.todayProfit}</span>
                  <span className={`font-mono font-black text-sm ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.round(stats.netProfit).toLocaleString()} <span className="text-[10px] font-medium">{t.currency}</span>
                  </span>
                </div>

                {/* Margin */}
                <div className="flex items-center justify-between p-3 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-xs font-bold text-slate-300">{t.profitMargin}</span>
                  <div className="flex items-center gap-1.5">
                    {stats.netProfit >= 0 ? (
                      <TrendingUp size={14} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={14} className="text-rose-400" />
                    )}
                    <span className={`font-mono font-black text-sm ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-900/20 transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPrinting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-r-2 border-white/10" />
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
