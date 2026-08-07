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
  TrendingDown,
  Info,
  Camera,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductStatsPanel } from '../components/ProductStatsPanel';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProductTransferModal } from '../components/ProductTransferModal';
import { CategoryTransferModal } from '../components/CategoryTransferModal';

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

  // Transfer modal state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [productToTransfer, setProductToTransfer] = useState<any | null>(null);
  const [isCategoryTransferModalOpen, setIsCategoryTransferModalOpen] = useState(false);

  const handleOpenTransfer = (p: any) => {
    setProductToTransfer(p);
    setIsTransferModalOpen(true);
  };

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
      <div className="flex h-full w-full items-center justify-center bg-[#eef2f8] text-[#64748b]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-[#e3e9f1] border-t-[#2563eb]" />
          <p className="text-sm font-semibold">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Calculate inventory metrics
  const totalCostValue = products.reduce((sum, p) => sum + ((p.cost || 0) * (p.stock || 0)), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const totalExpectedProfit = totalRetailValue - totalCostValue;

  return (
    <div className="flex h-full w-full bg-[#eef2f8] overflow-hidden" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
      >
        
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 shrink-0 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#18212f]">{t.inventory}</h1>
            <p className="mt-1 text-xs font-medium text-[#64748b]">
              {language === 'ar' ? 'إدارة وتعديل المنتجات ومستويات المخازن' : 'Manage retail product catalog and stock levels'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCategoryTransferModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-5 py-3 text-xs font-bold text-[#64748b] shadow-sm transition-all duration-150 hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] active:translate-y-px"
            >
              <Globe size={14} />
              <span>{language === 'ar' ? 'مزامنة قسم للموقع' : 'Sync Category to Web'}</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)] transition-all duration-150 hover:bg-[#1d4ed8] active:translate-y-px"
            >
              <Plus size={14} />
              <span>{t.addProduct}</span>
            </button>
          </div>
        </div>

      {/* Search & Category Filter bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] shrink-0 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className={`w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] py-3 text-sm font-medium text-[#18212f] outline-none transition-all duration-150 placeholder:font-normal placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${dir === 'rtl' ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
          />
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-[#94a3b8] ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
        </div>

        {/* Category Selector */}
        <div className="w-full sm:w-48 shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-4 py-3 text-sm font-medium text-[#18212f] outline-none transition-all duration-150 focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
          >
            <option value="All">{t.allCategories}</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto custom-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-[#94a3b8] text-sm font-semibold">
              {language === 'ar' ? 'لا توجد منتجات مسجلة في المخزن تطابق الفلترة' : 'No items match your criteria.'}
            </div>
          ) : (
            <table className="w-full text-sm text-[#334155] select-text">
              <thead className="bg-[#f4f7fb] border-b border-[#e3e9f1] text-[#64748b] font-bold">
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
              <tbody className="divide-y divide-[#e8edf4]">
                {filteredProducts.slice(0, 50).map((p, idx) => {
                  const profit = (p.price || 0) - (p.cost || 0);
                  
                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsStatsOpen(true);
                      }}
                      className={`cursor-pointer hover:bg-[#f4f7fb] transition-colors ${selectedProduct?.id === p.id ? 'bg-[#eff6ff] hover:bg-[#eff6ff]' : ''}`}
                    >
                      <td className="p-3.5 text-center text-[#94a3b8] font-mono">{idx + 1}</td>
                      <td className={`p-3.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} className="w-9 h-9 rounded-lg object-cover border border-[#e3e9f1] shrink-0 shadow-sm" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg border border-dashed border-[#e3e9f1] bg-[#f4f7fb] flex items-center justify-center text-[#94a3b8] shrink-0" style={{ borderTopColor: p.color || undefined, borderTopWidth: p.color ? '2px' : undefined }}>
                              <Camera size={14} />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-[#18212f]">
                              {language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn}
                            </span>
                            <span className="text-[11px] text-[#94a3b8] mt-0.5">
                              {language === 'ar' ? p.nameEn : p.nameAr}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-mono text-[#64748b]">{p.barcode || '-'}</td>
                      <td className="p-3.5 text-center">
                        <span className="bg-[#f4f7fb] border border-[#e3e9f1] px-2.5 py-1 rounded-md text-[11px] text-[#334155] font-bold">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`font-mono font-bold px-2.5 py-1 rounded-full text-[11px] ring-1 ${p.stock <= p.minStock ? 'bg-rose-50 text-rose-600 ring-rose-200' : 'bg-[#f4f7fb] text-[#334155] ring-[#e3e9f1]'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-amber-600">
                        {Math.round(p.cost || 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#2563eb]">
                        {Math.round(p.price || 0).toLocaleString()}
                      </td>
                      <td className={`p-3.5 text-center font-mono font-black ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {Math.round(profit).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center shrink-0">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTransfer(p);
                            }}
                            title={language === 'ar' ? 'مزامنة إلى الموقع' : 'Sync to website'}
                            className="p-2 bg-[#fbfcfe] border border-[#e3e9f1] text-[#64748b] rounded-lg hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors"
                          >
                            <Globe size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(p);
                            }}
                            className="p-2 bg-[#fbfcfe] border border-[#e3e9f1] text-[#64748b] rounded-lg hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p.id);
                            }}
                            className="p-2 bg-[#fbfcfe] border border-[#e3e9f1] text-[#64748b] rounded-lg hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
            <div className="text-center py-4 text-[#64748b] text-sm font-medium">
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

      {/* Product Sync/Transfer Modal */}
      <ProductTransferModal
        isOpen={isTransferModalOpen}
        product={productToTransfer}
        onClose={() => {
          setIsTransferModalOpen(false);
          setProductToTransfer(null);
        }}
        onSuccess={fetchProducts}
      />

      {/* Category Sync/Transfer Modal */}
      <CategoryTransferModal
        isOpen={isCategoryTransferModalOpen}
        localCategories={categories}
        products={products}
        onClose={() => {
          setIsCategoryTransferModalOpen(false);
        }}
        onSuccess={fetchProducts}
      />
    </div>
  );
};
