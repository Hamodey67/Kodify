import React, { useEffect, useState } from 'react';
import { X, CloudLightning, Loader2 } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface CategoryTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  localCategories: string[];
  products: any[];
  onSuccess: () => void;
}

export const CategoryTransferModal: React.FC<CategoryTransferModalProps> = ({
  isOpen,
  onClose,
  localCategories,
  products,
  onSuccess,
}) => {
  const { language, dir } = useLanguageStore();

  const [webCategories, setWebCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [selectedLocalCategory, setSelectedLocalCategory] = useState<string>('');
  const [selectedWebCategoryId, setSelectedWebCategoryId] = useState<string>('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    // Reset fields
    setSelectedLocalCategory(localCategories[0] || '');
    setSelectedWebCategoryId('');
    setSelectedBrandId('');
    setError(null);
    setSyncProgress(null);
    setLoadingMetadata(true);

    const loadMetadata = async () => {
      try {
        const catRes = await window.api.getWebCategories();
        const brandRes = await window.api.getWebBrands();

        let loadedCats: any[] = [];
        let loadedBrands: any[] = [];

        if (catRes?.success) {
          loadedCats = catRes.categories || [];
          setWebCategories(loadedCats);
        }
        if (brandRes?.success) {
          loadedBrands = brandRes.brands || [];
          setBrands(loadedBrands);
        }

        // Try auto-matching Web Category to the default local category
        const initialLocal = localCategories[0] || '';
        if (initialLocal && loadedCats.length > 0) {
          const match = loadedCats.find(
            (c: any) =>
              c.slug?.toLowerCase() === initialLocal.toLowerCase() ||
              c.name?.en?.toLowerCase() === initialLocal.toLowerCase() ||
              c.name?.ar === initialLocal
          );
          if (match) {
            setSelectedWebCategoryId(match.id);
          } else {
            setSelectedWebCategoryId(loadedCats[0]?.id || '');
          }
        } else if (loadedCats.length > 0) {
          setSelectedWebCategoryId(loadedCats[0].id);
        }

        if (loadedBrands.length > 0) {
          setSelectedBrandId(loadedBrands[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories/brands:', err);
        setError(language === 'ar' ? 'فشل تحميل بيانات الأقسام والبراندات' : 'Failed to load categories and brands');
      } finally {
        setLoadingMetadata(false);
      }
    };

    loadMetadata();
  }, [isOpen, localCategories, language]);

  // Adjust auto-matched web category when local category selection changes
  const handleLocalCategoryChange = (val: string) => {
    setSelectedLocalCategory(val);
    if (val && webCategories.length > 0) {
      const match = webCategories.find(
        (c: any) =>
          c.slug?.toLowerCase() === val.toLowerCase() ||
          c.name?.en?.toLowerCase() === val.toLowerCase() ||
          c.name?.ar === val
      );
      if (match) {
        setSelectedWebCategoryId(match.id);
      }
    }
  };

  if (!isOpen) return null;

  const handleSyncCategory = async () => {
    if (!selectedLocalCategory) {
      setError(language === 'ar' ? 'يرجى اختيار قسم محلي للمزامنة' : 'Please select a local category to sync');
      return;
    }

    const targetProducts = products.filter(p => p.category === selectedLocalCategory);
    if (targetProducts.length === 0) {
      setError(language === 'ar' ? 'القسم المحدد لا يحتوي على أي منتجات' : 'The selected category has no products');
      return;
    }

    setTransferring(true);
    setError(null);
    setSyncProgress({ current: 0, total: targetProducts.length });

    try {
      let successCount = 0;

      for (let i = 0; i < targetProducts.length; i++) {
        const product = targetProducts[i];
        setSyncProgress({ current: i + 1, total: targetProducts.length });

        const res = await window.api.transferProductToWeb(
          product,
          selectedWebCategoryId,
          selectedBrandId,
          product.price || 0,
          null,
          product.stock || 0
        );

        if (res?.success) {
          successCount++;
        }
      }

      alert(
        language === 'ar'
          ? `تمت مزامنة القسم بنجاح! تم نقل ${successCount} من أصل ${targetProducts.length} منتج.`
          : `Category sync completed! Synced ${successCount} of ${targetProducts.length} products.`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || (language === 'ar' ? 'حدث خطأ أثناء مزامنة القسم' : 'An error occurred during category sync'));
    } finally {
      setTransferring(false);
      setSyncProgress(null);
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
                {language === 'ar' ? 'مزامنة قسم بالكامل إلى الموقع' : 'Sync Category to Web'}
              </h3>
              <p className="mt-0.5 text-xs text-[#64748b]">
                {language === 'ar' ? 'نقل ومزامنة جميع منتجات قسم معين إلى الموقع الإلكتروني دفعة واحدة' : 'Transfer and sync all products of a category to the website at once'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={transferring}
            className="p-1.5 rounded-lg border border-[#e3e9f1] text-[#64748b] hover:bg-slate-50 transition-colors disabled:opacity-50"
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

            {/* Sync Progress Screen */}
            {transferring && syncProgress && (
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 text-center space-y-3">
                <Loader2 size={24} className="animate-spin text-[#2563eb] mx-auto" />
                <div className="text-xs font-bold text-blue-800">
                  {language === 'ar' 
                    ? `جاري مزامنة المنتجات... (${syncProgress.current} / ${syncProgress.total})` 
                    : `Syncing products... (${syncProgress.current} / ${syncProgress.total})`}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700">
                  <div 
                    className="bg-[#2563eb] h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {!transferring && (
              <>
                {/* Local Category selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748b]">
                    {language === 'ar' ? 'القسم المحلي (المصدر)' : 'Local Category (Source)'}
                  </label>
                  <select
                    value={selectedLocalCategory}
                    onChange={(e) => handleLocalCategoryChange(e.target.value)}
                    className="w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3.5 py-2.5 text-xs font-bold text-[#18212f] outline-none focus:border-[#2563eb]"
                  >
                    <option value="" disabled>
                      {language === 'ar' ? 'اختر قسم محلي' : 'Select a local category'}
                    </option>
                    {localCategories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({products.filter(p => p.category === cat).length} {language === 'ar' ? 'منتج' : 'products'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Web Category selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748b]">
                    {language === 'ar' ? 'قسم الموقع (الهدف)' : 'Web Store Category (Target)'}
                  </label>
                  <select
                    value={selectedWebCategoryId}
                    onChange={(e) => setSelectedWebCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3.5 py-2.5 text-xs font-bold text-[#18212f] outline-none focus:border-[#2563eb]"
                  >
                    {webCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {language === 'ar' ? (c.name?.ar || c.name?.en) : (c.name?.en || c.name?.ar)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Web Brand selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748b]">
                    {language === 'ar' ? 'البراند الإلكتروني' : 'Web Store Brand'}
                  </label>
                  <select
                    value={selectedBrandId}
                    onChange={(e) => setSelectedBrandId(e.target.value)}
                    className="w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] px-3.5 py-2.5 text-xs font-bold text-[#18212f] outline-none focus:border-[#2563eb]"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {language === 'ar' ? (b.name?.ar || b.name?.en) : (b.name?.en || b.name?.ar)}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={handleSyncCategory}
                disabled={transferring || !selectedLocalCategory}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)] transition-colors hover:bg-[#1d4ed8] active:translate-y-px disabled:opacity-75 disabled:pointer-events-none"
              >
                {transferring ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{language === 'ar' ? 'جاري نقل القسم...' : 'Syncing Category...'}</span>
                  </>
                ) : (
                  <span>{language === 'ar' ? 'بدء المزامنة الآن' : 'Start Sync Now'}</span>
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
