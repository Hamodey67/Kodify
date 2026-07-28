import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { translations } from '../utils/translations';
import { AlertCircle, Package } from 'lucide-react';
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
      <div id="product-form-modal" className="bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-lg flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 px-5 py-4 border-b border-[#e3e9f1] flex justify-between items-center bg-[#f4f7fb]">
          <h3 className="font-extrabold text-[#18212f] text-sm flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={16} />
            </span>
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
              className="h-8 w-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Error alerts */}
        {errorMsg && (
          <div className="mx-5 mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs py-2.5 px-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={12} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Row 1: Barcode & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">{t.barcode} (GTIN)</label>
              <input
                type="text"
                autoFocus
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                placeholder="e.g. 6281000..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">{t.sku} / الرمز</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs font-mono outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                placeholder="PRD-001"
              />
            </div>
          </div>

          {/* Row 2: Name Arabic */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#64748b]">{t.productName} (بالعربية)</label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
            />
          </div>

          {/* Row 3: Name English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#64748b]">Product Name (English)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
            />
          </div>

          {/* Row 3b: Name Kurdish */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#64748b]">
              {language === 'ar' ? 'اسم المنتج (بالكردية)' : language === 'ku' ? 'ناوی کاڵا (بەکوردی)' : 'Product Name (Kurdish)'}
            </label>
            <input
              type="text"
              value={nameKu}
              onChange={(e) => setNameKu(e.target.value)}
              className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
            />
          </div>

          {/* Row 4: Category & Card Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">{t.category}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] w-full"
                placeholder="e.g. Dairy / ألبان"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">
                {language === 'ar' ? 'لون مربع المنتج' : 'Product Card Color'}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color || '#ec4899'}
                  onChange={(e) => setColor(e.target.value)}
                  className="border border-[#e3e9f1] bg-[#fbfcfe] h-8 w-12 rounded-lg cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={color || ''}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#ec4899"
                  className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-1.5 text-xs font-mono outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] w-full"
                />
              </div>
            </div>
          </div>

          {/* Row 4.5: Product Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#64748b]">
              {language === 'ar' ? 'صورة المنتج' : 'Product Image'}
            </label>
            <div className="flex gap-4 items-center bg-[#f4f7fb] p-3 rounded-xl border border-[#e3e9f1]">
              {/* Image Preview / Placeholder */}
              <div className="w-16 h-16 rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] flex items-center justify-center overflow-hidden shrink-0">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-[#94a3b8] font-bold uppercase">No Image</span>
                )}
              </div>
              
              {/* File Selector & Delete buttons */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <label className="flex-1 bg-[#fbfcfe] hover:bg-[#eff6ff] border border-[#e3e9f1] hover:border-[#bfdbfe] text-[#64748b] hover:text-[#2563eb] px-3 py-1.5 rounded-xl text-xs font-bold text-center cursor-pointer transition-all active:translate-y-px">
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
                      className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#dc2626] px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:translate-y-px"
                    >
                      {language === 'ar' ? 'حذف' : 'Remove'}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-[#94a3b8]">
                  {language === 'ar' ? 'أقصى حجم: 1.5 ميجابايت. يُفضل صور بنسب متساوية (مربّعة).' : 'Max size: 1.5MB. Square aspect ratio recommended.'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 5: Pricing (Cost & Selling Price) */}
          <div className="grid grid-cols-2 gap-4 bg-[#f4f7fb] p-3 rounded-xl border border-[#e3e9f1]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">{t.cost} (Cost Price)</label>
              <input
                type="number"
                step="any"
                value={cost || ''}
                onChange={(e) => setCost(Number(e.target.value))}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#b45309] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] font-mono font-bold"
                required
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">{t.priceWithTax} (Selling Price)</label>
              <input
                type="number"
                step="any"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#2563eb] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] font-mono font-bold"
                required
                placeholder="0"
              />
            </div>
          </div>

          {/* Row 6: Stock & Min Stock Alert */}
          <div className="grid grid-cols-2 gap-4 bg-[#f4f7fb] p-3 rounded-xl border border-[#e3e9f1]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">{t.stockCount} (Stock Qty)</label>
              <input
                type="number"
                step="any"
                value={stock || ''}
                onChange={(e) => setStock(Number(e.target.value))}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] font-mono"
                required
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">{t.stockMin} (Min Stock Alert)</label>
              <input
                type="number"
                step="any"
                value={minStock || ''}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#18212f] px-3 py-2 text-xs outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] font-mono"
                required
                placeholder="0"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 -mx-5 -mb-5 mt-4 px-5 py-4 border-t border-[#e3e9f1] bg-[#f4f7fb]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#fbfcfe] hover:bg-[#eff6ff] border border-[#e3e9f1] hover:border-[#bfdbfe] text-[#64748b] hover:text-[#2563eb] py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:translate-y-px ${isSubmitting ? 'bg-[#cbd5e1] cursor-not-allowed text-white' : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'}`}
            >
              {isSubmitting ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t.save}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
