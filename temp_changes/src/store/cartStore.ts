import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';
import { useLanguageStore } from './languageStore';

export interface CartItem {
  id: number; // product id
  barcode: string | null;
  sku: string | null;
  nameAr: string;
  nameEn: string;
  nameKu?: string | null;
  price: number; // inclusive of VAT (current overridden price)
  originalPrice: number; // original catalog price
  cost: number;
  quantity: number;
  taxRate: number;
  discount: number; // flat discount amount on this item total
  stock: number; // stock available in catalog
}

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  points: number;
  balance: number;
}

interface CartState {
  items: CartItem[];
  customer: Customer | null;
  globalDiscount: number;
  globalDiscountType: 'percent' | 'flat';
  
  addItem: (product: any, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  updateDiscount: (productId: number, discount: number) => void;
  updateItemPrice: (productId: number, price: number) => void;
  setCustomer: (customer: Customer | null) => void;
  setGlobalDiscount: (amount: number, type: 'percent' | 'flat') => void;
  clearCart: () => void;
  
  // Totals calculations
  getTotals: () => {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    itemsDiscountAmount: number;
    globalDiscountAmount: number;
    total: number;
    itemCount: number;
  };
  
  checkout: (checkoutData: {
    userId: number;
    paymentMethod: 'cash' | 'card' | 'split';
    cashReceived: number;
    cashReturned: number;
    cardAmount: number;
    storeName: string;
    storeAddress: string;
    storePhone: string;
    storeTaxNumber: string;
    cashierName: string;
  }) => Promise<{ success: boolean; invoiceNumber?: string; error?: string }>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customer: null,
  globalDiscount: 0,
  globalDiscountType: 'percent',

  addItem: (product, qty = 1) => {
    const lang = useLanguageStore.getState().language;
    if (product.stock <= 0) {
      alert(
        lang === 'ar' 
          ? 'هذا المنتج غير متوفر في المخزون حالياً!' 
          : 'This product is currently out of stock!'
      );
      return;
    }

    const state = get();
    const existing = state.items.find((item) => item.id === product.id);
    const newQty = (existing ? existing.quantity : 0) + qty;
    if (newQty > product.stock) {
      alert(
        lang === 'ar' 
          ? `الكمية المطلوبة تتجاوز المخزون المتوفر (${product.stock})!` 
          : `Requested quantity exceeds available stock (${product.stock})!`
      );
      return;
    }

    set((state) => {
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: newQty } : item
          ),
        };
      } else {
        return {
          items: [
            ...state.items,
            {
              id: product.id,
              barcode: product.barcode,
              sku: product.sku,
              nameAr: product.nameAr,
              nameEn: product.nameEn,
              nameKu: product.nameKu,
              price: product.price,
              originalPrice: product.price,
              cost: product.cost,
              quantity: qty,
              taxRate: product.taxRate,
              discount: 0,
              stock: product.stock,
            },
          ],
        };
      }
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId, qty) => {
    const lang = useLanguageStore.getState().language;
    const state = get();
    const item = state.items.find((i) => i.id === productId);
    if (!item) return;

    if (qty > item.stock) {
      alert(
        lang === 'ar' 
          ? `الكمية المطلوبة تتجاوز المخزون المتوفر (${item.stock})!` 
          : `Requested quantity exceeds available stock (${item.stock})!`
      );
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0.1, qty) } : item
      ),
    }));
  },

  updateDiscount: (productId, discount) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, discount: Math.max(0, discount) } : item
      ),
    }));
  },

  updateItemPrice: (productId, price) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, price: Math.max(0, price) } : item
      ),
    }));
  },

  setCustomer: (customer) => set({ customer }),

  setGlobalDiscount: (amount, type) => set({ globalDiscount: amount, globalDiscountType: type }),

  clearCart: () => set({ items: [], customer: null, globalDiscount: 0, globalDiscountType: 'percent' }),

  getTotals: () => {
    const { items, globalDiscount, globalDiscountType } = get();
    
    // 1. Calculate sum of items
    let itemsGrossTotal = 0;
    let itemsTotal = 0;
    let itemsTax = 0;
    let itemsDiscount = 0;
    let itemCount = 0;

    items.forEach((item) => {
      itemCount += item.quantity;
      const overrideDiscount = item.originalPrice > item.price
        ? (item.originalPrice - item.price) * item.quantity
        : 0;
      const itemGrossTotal = item.originalPrice * item.quantity;
      const netItemTotal = Math.max(0, itemGrossTotal - overrideDiscount - item.discount);
      itemsGrossTotal += itemGrossTotal;
      itemsDiscount += overrideDiscount + item.discount;
      itemsTotal += netItemTotal;

      // Tax logic removed per user request
      itemsTax += 0;
    });

    // 2. Apply Global Discount
    let discountAmount = itemsDiscount;
    let finalTotal = itemsTotal;
    let gDiscount = 0;

    if (globalDiscount > 0) {
      if (globalDiscountType === 'percent') {
        gDiscount = (itemsTotal * globalDiscount) / 100;
      } else {
        gDiscount = globalDiscount;
      }
      discountAmount += gDiscount;
      finalTotal = Math.max(0, itemsTotal - gDiscount);

      // Tax logic removed per user request
      itemsTax = 0;
    }

    return {
      subtotal: Math.round(itemsGrossTotal),
      taxAmount: Math.round(itemsTax),
      discountAmount: Math.round(discountAmount),
      itemsDiscountAmount: Math.round(itemsDiscount),
      globalDiscountAmount: Math.round(gDiscount),
      total: Math.round(finalTotal),
      itemCount,
    };
  },

  checkout: async (checkoutData) => {
    const { items, customer, getTotals, clearCart } = get();
    const totals = getTotals();
    
    if (items.length === 0) {
      return { success: false, error: 'cart_empty' };
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const now = new Date();

    // Map cart items to database schema format
    const dbItems = items.map((item) => {
      const overrideDiscount = item.originalPrice > item.price
        ? (item.originalPrice - item.price) * item.quantity
        : 0;
      const grossTotal = item.originalPrice * item.quantity;
      const netTotal = Math.max(0, grossTotal - overrideDiscount - item.discount);
      // Tax logic removed per user request
      const tax = 0;

      return {
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.originalPrice,
        costPrice: item.cost,
        taxAmount: Math.round(tax),
        discountAmount: overrideDiscount + item.discount,
        totalPrice: Math.round(netTotal),
      };
    });

    // Customer loyalty reward: 1 point per 10 IQD spent
    const customerPointsEarned = customer ? Math.floor(totals.total / 10) : 0;
    
    // Balance change (if split and card/cash is not fully paid, remainder is account debt)
    let customerBalanceChange = 0;
    if (customer && checkoutData.paymentMethod === 'split') {
      const totalPaid = checkoutData.cashReceived - checkoutData.cashReturned + checkoutData.cardAmount;
      if (totalPaid < totals.total) {
        // Debt recorded as negative balance
        customerBalanceChange = -(totals.total - totalPaid);
      }
    }

    const salePayload = {
      invoiceNumber,
      userId: checkoutData.userId,
      customerId: customer?.id || null,
      totalAmount: totals.total,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      paymentMethod: checkoutData.paymentMethod,
      cashReceived: checkoutData.paymentMethod === 'card' ? 0 : checkoutData.cashReceived,
      cashReturned: checkoutData.paymentMethod === 'card' ? 0 : checkoutData.cashReturned,
      items: dbItems,
      customerPointsEarned,
      customerBalanceChange,
    };

    try {
      // 1. Save sale to database via IPC
      const result = await window.api.createSale(salePayload);
      
      if (result.success) {
        // 2. Trigger Mock / Real Printer
        await window.api.printReceipt({
          storeName: checkoutData.storeName,
          storeAddress: checkoutData.storeAddress,
          storePhone: checkoutData.storePhone,
          storeTaxNumber: checkoutData.storeTaxNumber,
          invoiceNumber,
          cashierName: checkoutData.cashierName,
          customerName: customer?.name || 'Walk-in Customer',
          paymentMethod: checkoutData.paymentMethod === 'cash' ? 'Cash' : checkoutData.paymentMethod === 'card' ? 'Card' : 'Split',
          items: items.map(item => {
            const overrideDiscount = item.originalPrice > item.price
              ? (item.originalPrice - item.price) * item.quantity
              : 0;
            return {
              name: item.nameEn || item.nameAr,
              qty: item.quantity,
              price: item.price, // overridden unit price
              total: (item.originalPrice * item.quantity) - overrideDiscount - item.discount,
              originalPrice: item.originalPrice,
              discount: overrideDiscount + item.discount,
            };
          }),
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          discountAmount: totals.discountAmount,
          itemsDiscountAmount: totals.itemsDiscountAmount,
          globalDiscountAmount: totals.globalDiscountAmount,
          globalDiscount: get().globalDiscount,
          globalDiscountType: get().globalDiscountType,
          total: totals.total,
          cashReceived: checkoutData.cashReceived,
          cashReturned: checkoutData.cashReturned,
          date: now.toLocaleString('en-US'),
        }, {
          mockMode: useSettingsStore.getState().getSetting('hardware_mock_mode', 'true') === 'true',
          printerType: 'windows',
          connectionPath: useSettingsStore.getState().getSetting('hardware_printer_ip', 'POSPrinter POS80')
        });

        // 3. Clear cart
        clearCart();
        return { success: true, invoiceNumber };
      } else {
        return { success: false, error: result.error || 'database_error' };
      }
    } catch (error: any) {
      console.error('Checkout store action error:', error);
      return { success: false, error: error.message || 'unknown_error' };
    }
  },
}));
