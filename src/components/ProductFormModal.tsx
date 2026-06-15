import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { translations } from '../utils/translations';
import { AlertCircle, Sparkles } from 'lucide-react';
import { InputRecoveryButton } from './InputRecoveryButton';

interface ProductFormModalProps {
  isOpen: boolean;
  product?: any; // If provided, edit mode. If null, add mode.
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  onClose,
  onSuccess,
}) => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];
  const { user } = useAuthStore();

  const isEditMode = !!product;

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
  const [color, setColor] = useState('#ec4899');
  const [image, setImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setBarcode(product.barcode || '');
        setSku(product.sku || '');
        setNameAr(product.nameAr || '');
        setNameEn(product.nameEn || '');
        setNameKu(product.nameKu || '');
        setCategory(product.category || 'General');
        setPrice(product.price || 0);
        setCost(product.cost || 0);
        setStock(product.stock || 0);
        setMinStock(product.minStock || 0);
        setTaxRate(product.taxRate || 0);
        setColor(product.color || '#ec4899');
        setImage(product.image || null);
      } else {
        setBarcode('');
        setSku(`PRD-${Date.now().toString().slice(-6)}`);
        setNameAr('');
        setNameEn('');
        setNameKu('');
        setCategory('General');
        setPrice(0);
        setCost(0);
        setStock(0);
        setMinStock(0);
        setTaxRate(0);
        setColor('#ec4899');
        setImage(null);
      }
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, product]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setErrorMsg('');
    setIsSubmitting(true);

    const trimmedAr = nameAr.trim();
    const trimmedEn = nameEn.trim();
    const trimmedKu = nameKu.trim();

    if (!trimmedAr && !trimmedEn && !trimmedKu) {
      setErrorMsg(language === 'ar' ? 'يجب إدخال اسم المنتج بلغة واحدة على الأقل' : 'At least one product name language is required');
      setIsSubmitting(false);
      return;
    }

    const finalNameAr = trimmedAr || trimmedEn || trimmedKu;
    const finalNameEn = trimmedEn || trimmedAr || trimmedKu;
    const finalNameKu = trimmedKu || null;

    let finalPrice = Number(price);
    let finalCost = Number(cost);

    if (user?.role === 'admin' && finalPrice <= finalCost) {
      setErrorMsg(language === 'ar' ? 'يجب أن يكون سعر البيع أكبر من سعر التكلفة' : 'Selling price must be greater than cost price');
      setIsSubmitting(false);
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
      color: color || null,
      image: image || null,
    };

    try {
      let result;
      if (isEditMode && product?.id) {
        // @ts-ignore
        result = await window.api.updateProduct(product.id, payload);
      } else {
        // @ts-ignore
        result = await window.api.addProduct(payload);
      }

      if (result) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(language === 'ar' ? 'فشلت العملية، الباركود أو الرمز قد يكون مكرراً' : 'Operation failed. Barcode/SKU might be duplicated.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 glass z-[100] flex items-center justify-center p-4" dir={dir}>
      <div id="product-form-modal" className="glass-card rounded-2xl border border-white/10 shadow-glass w-full max-w-lg flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-white/8 flex justify-between items-center bg-white/3">
          <h3 className="font-black text-slate-100 text-sm flex items-center gap-1.5">
            <Sparkles size={16} className="text-cyan-200" />
            <span>{isEditMode ? t.editProduct : t.addProduct}</span>
          </h3>
          <div className="flex items-center gap-2">
            <InputRecoveryButton
              variant="modal"
              focusSelector="#product-form-modal input:not([disabled]), #product-form-modal textarea:not([disabled]), #product-form-modal select:not([disabled])"
              onRecover={() => setIsSubmitting(false)}
            />
            <button 
              type="button"
              onClick={onClose}
              className="text-slate-300/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Error alerts */}
        {errorMsg && (
          <div className="mx-5 mt-4 bg-rose-500/10 border border-rose-400/20 text-rose-200 text-xs py-2.5 px-3 rounded-2xl flex items-center gap-2">
            <AlertCircle size={12} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Row 1: Barcode & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400">{t.barcode} (GTIN)</label>
              <input
                type="text"
                autoFocus
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500"
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

          {/* Row 4: Category & Card Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400">{t.category}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500 w-full"
                placeholder="e.g. Dairy / ألبان"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                {language === 'ar' ? 'لون مربع المنتج' : 'Product Card Color'}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color || '#ec4899'}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-slate-900 border border-slate-700 h-8 w-12 rounded-lg cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={color || ''}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#ec4899"
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs focus:border-teal-500 font-mono w-full"
                />
              </div>
            </div>
          </div>

          {/* Row 4.5: Product Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400">
              {language === 'ar' ? 'صورة المنتج' : 'Product Image'}
            </label>
            <div className="flex gap-4 items-center bg-slate-900/40 p-3 rounded-lg border border-slate-700">
              {/* Image Preview / Placeholder */}
              <div className="w-16 h-16 rounded-xl border border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-bold uppercase">No Image</span>
                )}
              </div>
              
              {/* File Selector & Delete buttons */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <label className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all active:scale-[0.98]">
                    <span>{language === 'ar' ? 'اختر صورة' : 'Choose Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 1.5 * 1024 * 1024) {
                            alert(language === 'ar' ? 'الرجاء اختيار صورة أصغر من 1.5 ميجابايت' : 'Please choose an image smaller than 1.5MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98]"
                    >
                      {language === 'ar' ? 'حذف' : 'Remove'}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  {language === 'ar' ? 'أقصى حجم: 1.5 ميجابايت. يُفضل صور بنسب متساوية (مربّعة).' : 'Max size: 1.5MB. Square aspect ratio recommended.'}
                </span>
              </div>
            </div>
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
              onClick={onClose}
              className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 py-2.5 rounded-lg text-xs font-bold transition-all"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg ${isSubmitting ? 'bg-teal-400/50 cursor-not-allowed text-white/70' : 'bg-primary text-primary-foreground hover:bg-teal-400 hover-scale glow-teal'}`}
            >
              {isSubmitting ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t.save}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
