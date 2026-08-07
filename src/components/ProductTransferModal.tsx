import React, { useEffect, useState } from 'react';
import { X, CloudLightning, Loader2 } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface ProductTransferModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductTransferModal: React.FC<ProductTransferModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { language, dir } = useLanguageStore();

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transfer Fields
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [webPrice, setWebPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<string>('');
  const [webStock, setWebStock] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !product) return;

    // Reset fields
    setWebPrice(product.price || 0);
    setWebStock(product.stock || 0);
    setCompareAtPrice('');
    setSelectedCategoryId('');
    setSelectedBrandId('');
    setError(null);
    setLoadingMetadata(true);

    const loadMetadata = async () => {
      try {
        const catRes = await window.api.getWebCategories();
        const brandRes = await window.api.getWebBrands();

        let loadedCats: any[] = [];
        let loadedBrands: any[] = [];

        if (catRes?.success) {
          loadedCats = catRes.categories || [];
          setCategories(loadedCats);
        }
        if (brandRes?.success) {
          loadedBrands = brandRes.brands || [];
          setBrands(loadedBrands);
        }

        // Try auto-matching Category
        if (product.category && loadedCats.length > 0) {
          const match = loadedCats.find(
            (c: any) =>
              c.slug?.toLowerCase() === product.category.toLowerCase() ||
              c.name?.en?.toLowerCase() === product.category.toLowerCase() ||
              c.name?.ar === product.category
          );
          if (match) {
            setSelectedCategoryId(match.id);
          } else {
            setSelectedCategoryId(loadedCats[0]?.id || '');
          }
        } else if (loadedCats.length > 0) {
          setSelectedCategoryId(loadedCats[0].id);
        }

        // Try auto-matching Brand (if product.brand exists, else default first or empty)
        const brandName = product.brand || '';
        if (brandName && loadedBrands.length > 0) {
          const match = loadedBrands.find(
            (b: any) =>
              b.slug?.toLowerCase() === brandName.toLowerCase() ||
              b.name?.en?.toLowerCase() === brandName.toLowerCase() ||
              b.name?.ar === brandName
          );
          if (match) {
            setSelectedBrandId(match.id);
          } else {
            setSelectedBrandId(loadedBrands[0]?.id || '');
          }
        } else if (loadedBrands.length > 0) {
          // Check if product name starts with a brand name (e.g. "CeraVe")
          const nameLower = (product.nameEn || '').toLowerCase();
          const match = loadedBrands.find((b: any) => nameLower.includes(b.slug?.toLowerCase() || ''));
          if (match) {
            setSelectedBrandId(match.id);
          } else {
            setSelectedBrandId(loadedBrands[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories/brands:', err);
        setError(language === 'ar' ? 'فشل تحميل بيانات الأقسام والبراندات' : 'Failed to load categories and brands');
      } finally {
        setLoadingMetadata(false);
      }
    };

    loadMetadata();
  }, [isOpen, product, language]);

  if (!isOpen || !product) return null;

  const handleTransfer = async () => {
    setTransferring(true);
    setError(null);
    try {
      const cmpPriceNum = compareAtPrice.trim() ? parseFloat(compareAtPrice) : null;
      const res = await window.api.transferProductToWeb(
        product,
        selectedCategoryId,
        selectedBrandId,
        webPrice,
        cmpPriceNum,
        webStock
      );

      if (res?.success) {
        alert(res.message || (language === 'ar' ? 'تمت عملية النقل بنجاح!' : 'Product synced successfully!'));
        onSuccess();
        onClose();
      } else {
        setError(res?.error || (language === 'ar' ? 'فشل نقل المنتج' : 'Failed to transfer product'));
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || (language === 'ar' ? 'حدث خطأ أثناء نقل المنتج' : 'An error occurred during sync'));
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" dir={dir}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3e9f1] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CloudLightning size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#18212f]">
                {language === 'ar' ? 'نقل المنتج إلى المتجر الإلكتروني' : 'Transfer Product to Web Store'}
              </h3>
              <p className="mt-0.5 text-xs text-[#64748b]">
                {language === 'ar' ? 'ربط ومزامنة المنتج مع قاعدة بيانات الموقع' : 'Link and sync product to website database'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#e3e9f1] text-[#64748b] hover:bg-slate-50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Loading state */}
        {loadingMetadata ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#64748b]">
            <Loader2 size={32} className="animate-spin text-[#2563eb]" />
            <p className="mt-3 text-xs font-bold">
              {language === 'ar' ? 'جاري جلب الأقسام والبراندات من الموقع...' : 'Fetching web store metadata...'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-5 select-text">
            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs font-bold text-rose-600">
                {error}
              </div>
            )}

            {/* Product details info card */}
            <div className="rounded-xl bg-[#f4f7fb] p-3 border border-[#e3e9f1]">
              <div className="text-[10px] uppercase font-extrabold text-[#2563eb] tracking-wider mb-1">
                {language === 'ar' ? 'المنتج المحلي' : 'Local Product'}
              </div>
              <div className="text-sm font-bold text-[#18212f]">
                {language === 'ar' ? product.nameAr : product.nameEn}
              </div>
              <div className="mt-1 flex items-center gap-4 text-xs font-semibold text-[#64748b]">
                <span>SKU: <strong className="font-mono">{product.sku || '-'}</strong></span>
                <span>Barcode: <strong className="font-mono">{product.barcode || '-'}</strong></span>
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#334155]">
                  {language === 'ar' ? 'قسم الموقع (Category)' : 'Web Category'}
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3 py-2 text-xs font-semibold text-[#18212f] outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- {language === 'ar' ? 'اختر القسم' : 'Select Category'} --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'ar' ? c.name?.ar : c.name?.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#334155]">
                  {language === 'ar' ? 'براند الموقع (Brand)' : 'Web Brand'}
                </label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3 py-2 text-xs font-semibold text-[#18212f] outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- {language === 'ar' ? 'اختر البراند' : 'Select Brand'} --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {language === 'ar' ? b.name?.ar : b.name?.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#334155]">
                  {language === 'ar' ? 'سعر الويب' : 'Web Price'}
                </label>
                <input
                  type="number"
                  value={webPrice}
                  onChange={(e) => setWebPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3 py-2 text-xs font-semibold text-[#18212f] outline-none focus:border-[#2563eb] font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#334155]">
                  {language === 'ar' ? 'السعر الأصلي للشطب (إختياري)' : 'Compare-at Price (Optional)'}
                </label>
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'مثال: 25' : 'e.g. 25'}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3 py-2 text-xs font-semibold text-[#18212f] outline-none focus:border-[#2563eb] font-mono"
                />
              </div>
            </div>

            {/* Stock field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-[#334155]">
                {language === 'ar' ? 'المخزون للويب' : 'Web Stock'}
              </label>
              <input
                type="number"
                value={webStock}
                onChange={(e) => setWebStock(Math.max(0, parseFloat(e.target.value) || 0))}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3 py-2 text-xs font-semibold text-[#18212f] outline-none focus:border-[#2563eb] font-mono"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={handleTransfer}
                disabled={transferring}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)] transition-colors hover:bg-[#1d4ed8] active:translate-y-px disabled:opacity-75 disabled:pointer-events-none"
              >
                {transferring ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{language === 'ar' ? 'جاري المزامنة...' : 'Syncing...'}</span>
                  </>
                ) : (
                  <span>{language === 'ar' ? 'مزامنة إلى الموقع الآن' : 'Sync to Website Now'}</span>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={transferring}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-5 py-2.5 text-xs font-bold text-[#64748b] transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
