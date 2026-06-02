import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { translations } from '../utils/translations';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Sparkles,
  TrendingDown,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Inventory: React.FC = () => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];
  const { user } = useAuthStore();

  // State lists
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);

  // Product Form variables
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameKu, setNameKu] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const list = await window.api.getProducts();
      setProducts(list || []);
      setFilteredProducts(list || []);
      
      // Load categories
      const cats: string[] = ['All'];
      list?.forEach((p: any) => {
        if (p.category && !cats.includes(p.category)) {
          cats.push(p.category);
        }
      });
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by search and category
  useEffect(() => {
    let result = products;

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        (p.nameKu && p.nameKu.toLowerCase().includes(q))
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, categoryFilter, products]);

  // Open modal for adding product
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setActiveProductId(null);
    setBarcode('');
    setSku(`PRD-${Date.now().toString().slice(-6)}`); // auto generate SKU prefix
    setNameAr('');
    setNameEn('');
    setNameKu('');
    setCategory('General');
    setPrice(0);
    setCost(0);
    setStock(0);
    setMinStock(0);
    setTaxRate(0);
    setErrorMsg('');
    setIsOpen(true);
  };

  // Open modal for editing product
  const handleOpenEdit = (p: any) => {
    setIsEditMode(true);
    setActiveProductId(p.id);
    setBarcode(p.barcode || '');
    setSku(p.sku || '');
    setNameAr(p.nameAr);
    setNameEn(p.nameEn);
    setNameKu(p.nameKu || '');
    setCategory(p.category || 'General');
    setPrice(p.price);
    setCost(p.cost);
    setStock(p.stock);
    setMinStock(p.minStock);
    setTaxRate(p.taxRate);
    setErrorMsg('');
    setIsOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedAr = nameAr.trim();
    const trimmedEn = nameEn.trim();
    const trimmedKu = nameKu.trim();

    if (!trimmedAr && !trimmedEn && !trimmedKu) {
      setErrorMsg(language === 'ar' ? 'يجب إدخال اسم المنتج بلغة واحدة على الأقل' : 'At least one product name language is required');
      return;
    }

    const finalNameAr = trimmedAr || trimmedEn || trimmedKu;
    const finalNameEn = trimmedEn || trimmedAr || trimmedKu;
    const finalNameKu = trimmedKu || null;

    let finalPrice = Number(price);
    let finalCost = Number(cost);

    // Business rule validation: Sales Price should cover cost
    if (user?.role === 'admin' && finalPrice <= finalCost) {
      setErrorMsg(language === 'ar' ? 'يجب أن يكون سعر البيع أكبر من سعر التكلفة' : 'Selling price must be greater than cost price');
      return;
    }

    const payload = {
      barcode: barcode || null,
      sku: sku || null,
      nameAr: finalNameAr,
      nameEn: finalNameEn,
      nameKu: finalNameKu,
      category,
      price: finalPrice,
      cost: finalCost,
      stock: Number(stock),
      minStock: Number(minStock),
      taxRate: Number(taxRate),
    };

    try {
      let result;
      if (isEditMode && activeProductId) {
        result = await window.api.updateProduct(activeProductId, payload);
      } else {
        result = await window.api.addProduct(payload);
      }

      if (result) {
        setIsOpen(false);
        fetchProducts(); // refresh table
      } else {
        setErrorMsg(language === 'ar' ? 'فشلت العملية، الباركود أو الرمز قد يكون مكرراً' : 'Operation failed. Barcode/SKU might be duplicated.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      language === 'ar' 
        ? 'هل أنت متأكد من حذف هذا المنتج نهائياً؟ سيتم إلغاؤه من قوائم العرض.' 
        : 'Are you sure you want to delete this product? Historical sales logs will remain unaffected.'
    );
    if (!confirmDelete) return;

    try {
      const success = await window.api.deleteProduct(id);
      if (success) {
        fetchProducts();
      } else {
        alert(t.error);
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-pos-bg text-slate-300/70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-400 border-r-2 border-white/10 mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  // Calculate inventory metrics
  const totalCostValue = products.reduce((sum, p) => sum + ((p.cost || 0) * (p.stock || 0)), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const totalExpectedProfit = totalRetailValue - totalCostValue;

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
          <h1 className="text-2xl font-black gradient-text">{t.inventory}</h1>
          <p className="text-sm text-slate-300/70 mt-1">
            {language === 'ar' ? 'إدارة وتعديل المنتجات ومستويات المخازن' : 'Manage retail product catalog and stock levels'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl text-xs font-extrabold text-white border border-white/10 btn-primary btn-shimmer inline-flex items-center gap-2 active:scale-[0.98]"
        >
          <Plus size={14} />
          <span>{t.addProduct}</span>
        </button>
      </div>

      {/* Inventory KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
        {/* Total Cost Value (Capital) */}
        <div className="glass-card p-5 rounded-xl border border-white/8 flex items-center justify-between shadow-glass relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'ar' ? 'رأس المال (قيمة الشراء)' : 'Total Capital (Cost Value)'}
            </span>
            <div className="text-xl font-bold text-amber-400 font-mono">
              {Math.round(totalCostValue).toLocaleString()} <span className="text-xs">{t.currency}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              <span>{language === 'ar' ? 'مجموع تكلفة البضائع المتوفرة' : 'Total cost of goods in stock'}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <TrendingDown size={18} />
          </div>
        </div>

        {/* Total Retail Value (Selling) */}
        <div className="glass-card p-5 rounded-xl border border-white/8 flex items-center justify-between shadow-glass relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'ar' ? 'القيمة البيعية للمخزون' : 'Total Retail Value (Selling)'}
            </span>
            <div className="text-xl font-bold text-teal-400 font-mono">
              {Math.round(totalRetailValue).toLocaleString()} <span className="text-xs">{t.currency}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              <span>{language === 'ar' ? 'مجموع سعر بيع البضائع المتوفرة' : 'Total selling price of goods'}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
            <Plus size={18} />
          </div>
        </div>

        {/* Total Expected Net Profit */}
        <div className="glass-card p-5 rounded-xl border border-white/8 flex items-center justify-between shadow-glass relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
          <div className="space-y-1 relative">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'ar' ? 'الأرباح الصافية المتوقعة' : 'Expected Net Profit'}
            </span>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {Math.round(totalExpectedProfit).toLocaleString()} <span className="text-xs">{t.currency}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              <span>{language === 'ar' ? 'صافي الربح المتوقع عند بيع المخزون' : 'Expected net profit on sell-out'}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-glow-emerald relative">
            <Plus size={18} />
          </div>
        </div>
      </div>

      {/* Search & Category Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 glass-card p-4 rounded-2xl border border-white/8 shrink-0 shadow-glass">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}
            className="w-full bg-slate-800/90 border border-white/8 focus:border-indigo-400/35 text-slate-100 pl-11 pr-4 py-3 rounded-2xl text-sm transition-all outline-none focus:ring-1 focus:ring-indigo-500/20"
          />
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-slate-300/70 ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
        </div>

        {/* Category Selector */}
        <div className="w-full sm:w-48 shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}
            className="w-full bg-slate-800/90 border border-white/8 text-slate-100 px-4 py-3 rounded-2xl text-sm focus:border-indigo-400/35 outline-none focus:ring-1 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-slate-100">{t.allCategories}</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat} className="bg-slate-900 text-slate-100">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-2xl border border-white/8 overflow-hidden shadow-glass">
        <div className="overflow-x-auto custom-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-300/60 text-sm">
              {language === 'ar' ? 'لا توجد منتجات مسجلة في المخزن تطابق الفلترة' : 'No items match your criteria.'}
            </div>
          ) : (
            <table className="w-full text-sm text-slate-200/90 select-text">
              <thead className="bg-white/3 border-b border-white/8 text-slate-300/70 font-extrabold">
                <tr>
                  <th className="p-3.5 text-center w-12">#</th>
                  <th className={`p-3.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.productName}</th>
                  <th className="p-3.5 text-center">{t.barcode}</th>
                  <th className="p-3.5 text-center">{t.category}</th>
                  <th className="p-3.5 text-center">{t.stockCount}</th>
                  <th className="p-3.5 text-center">{t.cost}</th>
                  <th className="p-3.5 text-center">{t.price}</th>
                  <th className="p-3.5 text-center">{language === 'ar' ? 'الربح الصافي' : language === 'ku' ? 'قازانجی سافی' : 'Net Profit'}</th>
                  <th className="p-3.5 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {filteredProducts.map((p, idx) => {
                  const profit = (p.price || 0) - (p.cost || 0);
                  
                  return (
                    <tr key={p.id} className={`hover:bg-white/3 transition-colors ${idx % 2 === 0 ? 'bg-white/[0.015]' : ''}`}>
                      <td className="p-3.5 text-center text-slate-300/50 font-mono">{idx + 1}</td>
                      <td className={`p-3.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-100">
                            {language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn}
                          </span>
                          <span className="text-[11px] text-slate-300/50 mt-0.5">
                            {language === 'ar' ? p.nameEn : p.nameAr}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-300/70">{p.barcode || '-'}</td>
                      <td className="p-3.5 text-center">
                        <span className="bg-white/3 border border-white/8 px-2.5 py-1 rounded-full text-[11px] text-slate-100/80 font-bold">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`font-mono font-bold px-2.5 py-1 rounded-full text-[11px] ${p.stock <= p.minStock ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-slate-800/80 text-slate-200 border border-white/6'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-amber-200">
                        {Math.round(p.cost || 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-teal-200">
                        {Math.round(p.price || 0).toLocaleString()}
                      </td>
                      <td className={`p-3.5 text-center font-mono font-black ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {Math.round(profit).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center shrink-0">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 bg-white/3 border border-white/8 text-slate-100/70 hover:text-white rounded-xl hover:bg-white/6 transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 bg-rose-500/10 border border-rose-400/20 text-rose-200/80 hover:text-rose-100 rounded-xl hover:bg-rose-500/15 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 glass z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-white/10 shadow-glass w-full max-w-lg flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-white/8 flex justify-between items-center bg-white/3">
              <h3 className="font-black text-slate-100 text-sm flex items-center gap-1.5">
                <Sparkles size={16} className="text-cyan-200" />
                <span>{isEditMode ? t.editProduct : t.addProduct}</span>
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-300/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Error alerts */}
            {errorMsg && (
              <div className="mx-5 mt-4 bg-rose-500/10 border border-rose-400/20 text-rose-200 text-xs py-2.5 px-3 rounded-2xl flex items-center gap-2">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              
              {/* Row 1: Barcode & SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">{t.barcode} (GTIN)</label>
                  <input
                    type="text"
                    autoFocus
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500"
                    placeholder="e.g. 6281000..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">{t.sku} / الرمز</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono"
                    placeholder="PRD-001"
                  />
                </div>
              </div>

              {/* Row 2: Name Arabic */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400">{t.productName} (بالعربية)</label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500"
                />
              </div>

              {/* Row 3: Name English */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Product Name (English)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500"
                />
              </div>

              {/* Row 3b: Name Kurdish */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  {language === 'ar' ? 'اسم المنتج (بالكردية)' : language === 'ku' ? 'ناوی کاڵا (بەکوردی)' : 'Product Name (Kurdish)'}
                </label>
                <input
                  type="text"
                  value={nameKu}
                  onChange={(e) => setNameKu(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500"
                />
              </div>

              {/* Row 4: Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400">{t.category}</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500"
                  placeholder="e.g. Dairy / ألبان"
                  required
                />
              </div>

              {/* Row 5: Pricing (Cost & Selling Price) */}
              <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-3 rounded-lg border border-slate-700">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">{t.cost} (Cost Price)</label>
                  <input
                    type="number"
                    step="any"
                    value={cost || ''}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 text-amber-400 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono font-bold"
                    required
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">{t.priceWithTax} (Selling Price)</label>
                  <input
                    type="number"
                    step="any"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 text-teal-400 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono font-bold"
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Row 6: Stock & Min Stock Alert */}
              <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-3 rounded-lg border border-slate-700">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">{t.stockCount} (Stock Qty)</label>
                  <input
                    type="number"
                    step="any"
                    value={stock || ''}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono"
                    required
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">{t.stockMin} (Min Stock Alert)</label>
                  <input
                    type="number"
                    step="any"
                    value={minStock || ''}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono"
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-700 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 py-2.5 rounded-lg text-xs font-bold transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 rounded-lg text-xs font-bold transition-all hover-scale shadow-lg glow-teal"
                >
                  {t.save}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};
