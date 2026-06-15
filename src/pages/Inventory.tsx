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
  Info,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductStatsPanel } from '../components/ProductStatsPanel';
import { ProductFormModal } from '../components/ProductFormModal';

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
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);

  // Side stats panel state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

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
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEdit = (p: any) => {
    setProductToEdit(p);
    setIsProductModalOpen(true);
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
    <div className="flex h-full w-full bg-pos-bg overflow-hidden" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
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
                {filteredProducts.slice(0, 50).map((p, idx) => {
                  const profit = (p.price || 0) - (p.cost || 0);
                  
                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsStatsOpen(true);
                      }}
                      className={`cursor-pointer hover:bg-white/3 transition-colors ${selectedProduct?.id === p.id ? 'bg-indigo-500/10 hover:bg-indigo-500/15 border-l-2 border-indigo-500' : (idx % 2 === 0 ? 'bg-white/[0.015]' : '')}`}
                    >
                      <td className="p-3.5 text-center text-slate-300/50 font-mono">{idx + 1}</td>
                      <td className={`p-3.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0 shadow-sm" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg border border-dashed border-white/10 bg-white/3 flex items-center justify-center text-slate-500 shrink-0" style={{ borderTopColor: p.color || undefined, borderTopWidth: p.color ? '2px' : undefined }}>
                              <Camera size={14} />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-100">
                              {language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn}
                            </span>
                            <span className="text-[11px] text-slate-300/50 mt-0.5">
                              {language === 'ar' ? p.nameEn : p.nameAr}
                            </span>
                          </div>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(p);
                            }}
                            className="p-2 bg-white/3 border border-white/8 text-slate-100/70 hover:text-white rounded-xl hover:bg-white/6 transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p.id);
                            }}
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
          {filteredProducts.length > 50 && (
            <div className="text-center py-4 text-slate-400 text-sm font-medium">
              {language === 'ar' ? `يتم عرض أول 50 نتيجة من أصل ${filteredProducts.length}. يرجى تحسين البحث لرؤية المزيد.` : `Showing top 50 results out of ${filteredProducts.length}. Please refine your search.`}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL DIALOG */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        product={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={fetchProducts}
      />

      </motion.div>

      {/* Product Stats Side Panel */}
      <ProductStatsPanel
        product={selectedProduct}
        isOpen={isStatsOpen}
        onClose={() => {
          setIsStatsOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};
