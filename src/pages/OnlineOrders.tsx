import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useLanguageStore } from '../store/languageStore';
import {
  Globe,
  RefreshCw,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Phone,
  MapPin,
  User,
  FileText,
  Printer,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  product_name: any; // { ar: string, en: string } or string
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  full_name?: string;
  phone?: string;
  city?: string;
  area?: string;
  street?: string;
  building?: string;
  notes?: string;
}

export interface OnlineOrder {
  id: string;
  user_id?: string | null;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  shipping_address: ShippingAddress | string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export const OnlineOrders: React.FC = () => {
  const { language } = useLanguageStore();
  const [orders, setOrders] = useState<OnlineOrder[]>([]);

  const formatPhoneForWhatsApp = (phoneStr: string): string => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('07') && digits.length === 11) {
      return '964' + digits.substring(1);
    }
    if (digits.startsWith('7') && digits.length === 10) {
      return '964' + digits;
    }
    return digits;
  };

  const openWhatsAppMessage = (order: OnlineOrder, type: 'received' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') => {
    let addressObj: ShippingAddress = {};
    if (typeof order.shipping_address === 'string') {
      try {
        addressObj = JSON.parse(order.shipping_address);
      } catch (e) {
        addressObj = { full_name: order.shipping_address };
      }
    } else {
      addressObj = order.shipping_address || {};
    }

    const phone = addressObj.phone;
    if (!phone) return;

    const formattedPhone = formatPhoneForWhatsApp(phone);
    const name = addressObj.full_name || (language === 'ar' ? 'زبوننا العزيز' : language === 'ku' ? 'کڕیاری بەڕێز' : 'Valued Customer');
    const orderNum = order.order_number;
    const totalVal = order.total.toLocaleString();

    // Format items list
    const itemsText = (order.items || []).map((it) => {
      let itemName = 'منتج';
      if (typeof it.product_name === 'object' && it.product_name !== null) {
        itemName = it.product_name[language] || it.product_name.ar || it.product_name.en || 'منتج';
      } else if (typeof it.product_name === 'string') {
        itemName = it.product_name;
      }
      return `- ${itemName} (x${it.quantity})`;
    }).join('\n');

    let text = '';

    if (language === 'ar') {
      if (type === 'received') {
        text = `أهلاً بك ${name}، تم استلام طلبك رقم # ${orderNum} بنجاح.\n\nتفاصيل الطلب:\n${itemsText}\n\nالمجموع الإجمالي: ${totalVal} د.ع.\nشكراً لطلبك من متجرنا! ❤️`;
      } else if (type === 'confirmed') {
        text = `أهلاً بك ${name}، تم تأكيد طلبك رقم # ${orderNum} وهو الآن قيد التجهيز! 📦`;
      } else if (type === 'shipped') {
        text = `أهلاً بك ${name}، تم شحن طلبك رقم # ${orderNum} وهو في الطريق إليك! 🚚`;
      } else if (type === 'delivered') {
        text = `أهلاً بك ${name}، تم توصيل طلبك رقم # ${orderNum} بنجاح. شكراً لتعاملك معنا! ✅❤️`;
      } else if (type === 'cancelled') {
        text = `أهلاً بك ${name}، نود إعلامك بأنه تم إلغاء طلبك رقم # ${orderNum}. ❌`;
      }
    } else if (language === 'ku') {
      if (type === 'received') {
        text = `سڵاو ${name}، داواکارییەکەت ژمارە # ${orderNum} بە سەرکەوتوویی وەرگیرا.\n\nوردەکاری داواکاری:\n${itemsText}\n\nکۆی گشتی: ${totalVal} دینار.\nسوپاس بۆ داواکارییەکەت لە فرۆشگاکەمان! ❤️`;
      } else if (type === 'confirmed') {
        text = `سڵاو ${name}، داواکارییەکەت ژمارە # ${orderNum} پشتڕاستکرایەوە و ئێستا لە قۆناغی ئامادەکردندایە! 📦`;
      } else if (type === 'shipped') {
        text = `سڵاو ${name}، داواکارییەکەت ژمارە # ${orderNum} نێردرا و لە ڕێگایە بۆ لای تۆ! 🚚`;
      } else if (type === 'delivered') {
        text = `سڵاو ${name}، داواکارییەکەت ژمارە # ${orderNum} بە سەرکەوتوویی گەیشت. سوپاس بۆ متمانەکەتان! ✅❤️`;
      } else if (type === 'cancelled') {
        text = `سڵاو ${name}، ئاگادارت دەکەینەوە کە داواکارییەکەت ژمارە # ${orderNum} هەڵوەشێندرایەوە. ❌`;
      }
    } else {
      if (type === 'received') {
        text = `Hello ${name}, your order # ${orderNum} has been received successfully.\n\nOrder Details:\n${itemsText}\n\nTotal Amount: ${totalVal} IQD.\nThank you for ordering from our store! ❤️`;
      } else if (type === 'confirmed') {
        text = `Hello ${name}, your order # ${orderNum} has been confirmed and is now being prepared! 📦`;
      } else if (type === 'shipped') {
        text = `Hello ${name}, your order # ${orderNum} has been shipped and is on its way to you! 🚚`;
      } else if (type === 'delivered') {
        text = `Hello ${name}, your order # ${orderNum} has been delivered successfully. Thank you! ✅❤️`;
      } else if (type === 'cancelled') {
        text = `Hello ${name}, your order # ${orderNum} has been cancelled. ❌`;
      }
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  // Play notification sound for new order
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.error('Failed to play audio alert', e);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (window.api && window.api.getOnlineOrders) {
        const res = await window.api.getOnlineOrders();
        if (res.success) {
          setOrders(res.orders || []);
        } else {
          setError(res.error || 'تعذر جلب الطلبات الأونلاين');
        }
      } else {
        setError('ميزة الربط غير متوفرة في بيئة المطور');
      }
    } catch (err: any) {
      setError(err?.message || 'خطأ غير متوقع عند تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen to realtime new orders
    let unsubscribeNew: any;
    let unsubscribeStatus: any;

    if (window.api) {
      if (window.api.onNewOnlineOrder) {
        unsubscribeNew = window.api.onNewOnlineOrder((newOrder: any) => {
          playNotificationSound();
          setNewOrderAlert(`وصل طلب أونلاين جديد! (رقم الطلب: ${newOrder.order_number || '#NEW'})`);
          fetchOrders();
        });
      }

      if (window.api.onOnlineOrderStatusChanged) {
        unsubscribeStatus = window.api.onOnlineOrderStatusChanged(() => {
          fetchOrders();
        });
      }
    }

    return () => {
      if (unsubscribeNew) unsubscribeNew();
      if (unsubscribeStatus) unsubscribeStatus();
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setActionLoadingId(orderId);
    try {
      if (window.api && window.api.updateOnlineOrderStatus) {
        const res = await window.api.updateOnlineOrderStatus(orderId, newStatus);
        if (res.success) {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
          );
          const targetOrder = orders.find(o => o.id === orderId);
          if (targetOrder) {
            openWhatsAppMessage(targetOrder, newStatus as any);
          }
        } else {
          alert(`فشل تحديث حالة الطلب: ${res.error}`);
        }
      }
    } catch (err: any) {
      alert(`خطأ: ${err?.message || 'فشل التحديث'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePrintReceipt = (order: OnlineOrder) => {
    let addressObj: ShippingAddress = {};
    if (typeof order.shipping_address === 'string') {
      try {
        addressObj = JSON.parse(order.shipping_address);
      } catch (e) {
        addressObj = { full_name: order.shipping_address };
      }
    } else {
      addressObj = order.shipping_address || {};
    }

    const getSetting = useSettingsStore.getState().getSetting;
    const storeName = getSetting('store_name_ar') || getSetting('store_name_en') || '1of1 STORE';
    const storeAddress = getSetting('store_address', '');
    const storePhone = getSetting('store_phone', '');

    const fullAddr = [addressObj.city, addressObj.area, addressObj.street, addressObj.building]
      .filter(Boolean)
      .join(' - ');

    const receiptData = {
      storeName,
      storeAddress,
      storePhone,
      orderNumber: order.order_number,
      date: new Date(order.created_at).toLocaleString('ar-IQ'),
      status: order.status,
      statusText: getStatusText(order.status),
      customerName: addressObj.full_name || 'غير محدد',
      customerPhone: addressObj.phone || 'غير محدد',
      deliveryAddress: {
        city: addressObj.city,
        area: addressObj.area,
        street: addressObj.street,
        building: addressObj.building,
        fullAddress: fullAddr,
        notes: addressObj.notes || order.notes || undefined,
      },
      items: (order.items || []).map((it) => {
        let name = 'منتج';
        if (typeof it.product_name === 'object' && it.product_name !== null) {
          name = it.product_name.ar || it.product_name.en || 'منتج';
        } else if (typeof it.product_name === 'string') {
          name = it.product_name;
        }
        return {
          name,
          qty: it.quantity,
          price: it.unit_price,
          total: it.total_price,
        };
      }),
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      discount: order.discount,
      total: order.total,
      notes: order.notes || addressObj.notes || undefined,
    };

    // 1. Trigger Electron POS thermal printer if available
    if (window.api && window.api.printOnlineOrderReceipt) {
      const mockMode = getSetting('hardware_mock_mode', 'true') === 'true';
      const printerIp = getSetting('hardware_printer_ip', 'POSPrinter POS80');
      
      window.api.printOnlineOrderReceipt(receiptData, {
        mockMode,
        printerType: 'windows',
        connectionPath: printerIp,
      });
    }

    // 2. Open styled HTML thermal receipt window for browser printing / preview
    const htmlContent = `<!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>إيصال طلب - ${receiptData.orderNumber}</title>
      <style>
        @page { margin: 0; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, 'Cairo', sans-serif;
          width: 100%;
          max-width: 280px;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 10px 10px 60px 10px;
          font-size: 11px;
          color: #0f172a;
          line-height: 1.4;
          direction: rtl;
          background: #ffffff;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: 700; }
        .brand-header { text-align: center; margin-bottom: 6px; }
        .store-name { font-size: 15px; font-weight: 900; letter-spacing: 0.5px; color: #0f172a; margin-bottom: 2px; text-transform: uppercase; }
        .order-badge { display: inline-block; background: #1e293b; color: #ffffff; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; margin: 4px 0 6px 0; }
        .line { border-top: 1px dashed #64748b; margin: 6px 0; }
        .double-line { border-top: 2px double #0f172a; margin: 8px 0; }
        .info-card { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 5px; padding: 6px 8px; margin: 6px 0; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 10.5px; }
        .info-row:last-child { margin-bottom: 0; }
        .info-label { color: #475569; font-weight: 600; }
        .info-value { color: #0f172a; font-weight: 700; }
        .order-num-large { font-size: 14px; font-weight: 900; color: #2563eb; text-align: center; margin: 2px 0 4px 0; font-family: monospace; }
        .section-header { font-size: 10.5px; font-weight: 800; color: #0f172a; background: #e2e8f0; padding: 3px 6px; border-radius: 3px; margin: 6px 0 4px 0; text-align: center; }
        .items-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
        .items-table th { border-bottom: 1px solid #94a3b8; padding: 3px 2px; font-size: 9.5px; color: #475569; font-weight: 700; }
        .items-table td { padding: 4px 2px; font-size: 10.5px; vertical-align: top; }
        .item-title { font-weight: 700; color: #0f172a; line-height: 1.3; }
        .item-sub { font-size: 9px; color: #64748b; }
        .totals-box { margin-top: 6px; width: 100%; }
        .totals-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 10.5px; }
        .final-total-card { background: #0f172a; color: #ffffff; text-align: center; padding: 6px; border-radius: 5px; margin-top: 6px; }
        .final-total-label { font-size: 10px; opacity: 0.9; }
        .final-total-val { font-size: 15px; font-weight: 900; margin-top: 1px; }
        .status-badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 9.5px; font-weight: 700; background: #dbeafe; color: #1e40af; }
        .footer { text-align: center; margin-top: 12px; font-size: 9.5px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="brand-header">
        <div class="store-name">${receiptData.storeName}</div>
        ${receiptData.storeAddress ? `<div style="font-size: 9.5px; color: #475569;">${receiptData.storeAddress}</div>` : ''}
        ${receiptData.storePhone ? `<div style="font-size: 9.5px; color: #475569;">هاتف: ${receiptData.storePhone}</div>` : ''}
        <div class="order-badge">🌐 وصل طلب متجر إلكتروني</div>
      </div>

      <div class="info-card">
        <div class="order-num-large">رقم الطلب: ${receiptData.orderNumber}</div>
        <div class="info-row">
          <span class="info-label">تاريخ الطلب:</span>
          <span class="info-value">${receiptData.date}</span>
        </div>
        <div class="info-row">
          <span class="info-label">حالة الطلب:</span>
          <span class="status-badge">${receiptData.statusText}</span>
        </div>
      </div>

      <div class="section-header">🚚 معلومات الزبون والتوصيل</div>
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">اسم الزبون:</span>
          <span class="info-value">${receiptData.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">رقم الهاتف:</span>
          <span class="info-value" dir="ltr" style="text-align: right;">${receiptData.customerPhone}</span>
        </div>
        ${receiptData.deliveryAddress?.fullAddress ? `
        <div class="info-row" style="flex-direction: column; gap: 2px; margin-top: 4px; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
          <span class="info-label">عنوان التوصيل:</span>
          <span class="info-value" style="word-break: break-word;">${receiptData.deliveryAddress.fullAddress}</span>
        </div>
        ` : ''}
        ${receiptData.notes ? `
        <div class="info-row" style="flex-direction: column; gap: 2px; margin-top: 4px; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
          <span class="info-label">ملاحظات الطلب:</span>
          <span class="info-value" style="color: #b91c1c;">${receiptData.notes}</span>
        </div>
        ` : ''}
      </div>

      <div class="section-header">📦 تفاصيل المواد المطلوبة</div>
      <table class="items-table">
        <thead>
          <tr>
            <th class="text-right" style="width: 50%;">المادة</th>
            <th class="text-center" style="width: 15%;">العدد</th>
            <th class="text-left" style="width: 35%;">المجموع</th>
          </tr>
        </thead>
        <tbody>
          ${receiptData.items.map(item => `
            <tr>
              <td class="text-right">
                <div class="item-title">${item.name}</div>
                <div class="item-sub">${item.price.toLocaleString('ar-IQ')} د.ع</div>
              </td>
              <td class="text-center bold" style="font-size: 11px; vertical-align: middle;">x${item.qty}</td>
              <td class="text-left bold" style="vertical-align: middle;">${item.total.toLocaleString('ar-IQ')} د.ع</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="line"></div>
      <div class="totals-box">
        <div class="totals-row">
          <span>المجموع الفرعي:</span>
          <span class="bold">${receiptData.subtotal.toLocaleString('ar-IQ')} د.ع</span>
        </div>
        <div class="totals-row">
          <span>كلفة التوصيل:</span>
          <span class="bold">${receiptData.shippingCost > 0 ? `${receiptData.shippingCost.toLocaleString('ar-IQ')} د.ع` : 'مجاني'}</span>
        </div>
        ${receiptData.discount > 0 ? `
        <div class="totals-row" style="color: #059669;">
          <span>الخصم:</span>
          <span class="bold">-${receiptData.discount.toLocaleString('ar-IQ')} د.ع</span>
        </div>
        ` : ''}
      </div>

      <div class="final-total-card">
        <div class="final-total-label">المبلغ الإجمالي النهائي</div>
        <div class="final-total-val">${receiptData.total.toLocaleString('ar-IQ')} د.ع</div>
      </div>

      <div class="double-line"></div>
      <div class="footer">
        <div style="font-weight: 700; color: #0f172a; font-size: 10px; margin-bottom: 2px;">شكراً لطلبكم من متجرنا الإلكتروني! ❤️</div>
        <div>KODIFY POS SYSTEM • ONLINE ORDERS</div>
      </div>
    </body>
    </html>`;

    const printWin = window.open('', '', 'width=450,height=700');
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 250);
    }
  };


  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
        return 'مؤكد / قيد التجهيز';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التوصيل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-[#b45309] ring-1 ring-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            قيد الانتظار
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5" />
            مؤكد / قيد التجهيز
          </span>
        );
      case 'shipped':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-50 text-[#0e7490] ring-1 ring-cyan-200 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            تم الشحن
          </span>
        );
      case 'delivered':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#047857] ring-1 ring-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            تم التوصيل
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#fff1f2] text-[#dc2626] ring-1 ring-rose-200 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            ملغي
          </span>
        );
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#eef2f7] text-[#64748b] ring-1 ring-[#e3e9f1]">{status}</span>;
    }
  };

  const parseAddress = (addr: ShippingAddress | string): ShippingAddress => {
    if (typeof addr === 'string') {
      try {
        return JSON.parse(addr);
      } catch (e) {
        return { full_name: addr };
      }
    }
    return addr || {};
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const addr = parseAddress(order.shipping_address);
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      order.order_number?.toLowerCase().includes(searchLower) ||
      addr.full_name?.toLowerCase().includes(searchLower) ||
      addr.phone?.toLowerCase().includes(searchLower) ||
      addr.city?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  // Count stats
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="p-6 space-y-6 dir-rtl text-right font-sans text-[#18212f] bg-[#eef2f8] min-h-full">
      {/* Alert Notification Toast */}
      {newOrderAlert && (
        <div className="p-4 bg-[#2563eb] text-white rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.24)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-100" />
            <span className="font-bold text-lg">{newOrderAlert}</span>
          </div>
          <button
            onClick={() => setNewOrderAlert(null)}
            className="px-3 py-1 bg-[#1d4ed8] hover:bg-[#1e40af] rounded-md text-sm transition"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#18212f] flex items-center gap-2">
              طلبات المتجر الإلكتروني (1of1 Store)
            </h1>
            <p className="text-sm font-medium text-[#64748b] mt-1">
              متابعة الطلبات المباشرة من المتجر وتجهيزها وتسجيل المبيعات
            </p>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl font-bold flex items-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.24)] transition-all active:translate-y-px disabled:bg-[#cbd5e1] disabled:shadow-none"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث الطلبات
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
            statusFilter === 'all'
              ? 'bg-[#eff6ff] border-[#2563eb] shadow-[0_4px_10px_rgba(37,99,235,0.15)]'
              : 'bg-[#fbfcfe] border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[#bfdbfe] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Globe className="w-4 h-4" />
            </span>
            <div className="text-xs text-[#64748b] font-semibold">إجمالي الطلبات</div>
          </div>
          <div className="text-2xl font-bold text-[#18212f]">{orders.length}</div>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
            statusFilter === 'pending'
              ? 'bg-amber-50 border-amber-400 shadow-[0_4px_10px_rgba(245,158,11,0.15)]'
              : 'bg-[#fbfcfe] border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-amber-200 hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
            <div className="text-xs text-[#b45309] font-semibold">قيد الانتظار</div>
          </div>
          <div className="text-2xl font-bold text-[#b45309]">{pendingCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('confirmed')}
          className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
            statusFilter === 'confirmed'
              ? 'bg-emerald-50 border-emerald-400 shadow-[0_4px_10px_rgba(16,185,129,0.15)]'
              : 'bg-[#fbfcfe] border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-emerald-200 hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <PackageCheck className="w-4 h-4" />
            </span>
            <div className="text-xs text-[#047857] font-semibold">مؤكدة</div>
          </div>
          <div className="text-2xl font-bold text-[#047857]">{confirmedCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('shipped')}
          className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
            statusFilter === 'shipped'
              ? 'bg-cyan-50 border-cyan-400 shadow-[0_4px_10px_rgba(6,182,212,0.15)]'
              : 'bg-[#fbfcfe] border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-cyan-200 hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Truck className="w-4 h-4" />
            </span>
            <div className="text-xs text-[#0e7490] font-semibold">تم الشحن</div>
          </div>
          <div className="text-2xl font-bold text-[#0e7490]">{shippedCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('delivered')}
          className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
            statusFilter === 'delivered'
              ? 'bg-emerald-50 border-emerald-400 shadow-[0_4px_10px_rgba(16,185,129,0.15)]'
              : 'bg-[#fbfcfe] border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-emerald-200 hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </span>
            <div className="text-xs text-[#047857] font-semibold">تم التوصيل</div>
          </div>
          <div className="text-2xl font-bold text-[#047857]">{deliveredCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-3 text-[#94a3b8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الطلب، اسم الزبون، الهاتف..."
            className="w-full bg-[#fbfcfe] border border-[#e3e9f1] rounded-xl pr-9 pl-4 py-2 text-sm font-medium text-[#18212f] placeholder-[#94a3b8] outline-none transition-all duration-150 focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {[
            { key: 'all', label: 'الكل' },
            { key: 'pending', label: 'قيد الانتظار' },
            { key: 'confirmed', label: 'مؤكد' },
            { key: 'shipped', label: 'تم الشحن' },
            { key: 'delivered', label: 'تم التوصيل' },
            { key: 'cancelled', label: 'ملغي' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                statusFilter === tab.key
                  ? 'bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(37,99,235,0.25)]'
                  : 'text-[#64748b] hover:bg-[#eef2f7] hover:text-[#18212f]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="p-4 bg-[#fff1f2] border border-rose-200 text-[#dc2626] rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#64748b] rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#2563eb]" />
          <span>جاري تحميل طلبات المتجر...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <Globe className="w-12 h-12 mx-auto mb-3 text-[#94a3b8]" />
          <h3 className="text-lg font-bold text-[#18212f] mb-1">لا توجد طلبات أونلاين حالياً</h3>
          <p className="text-xs text-[#64748b]">
            {searchQuery
              ? 'لم نجد أي طلب يطابق نص البحث'
              : 'الطلبات الواردة من المتجر الإلكتروني تظهر هنا تلقائياً'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const addr = parseAddress(order.shipping_address);
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[#bfdbfe] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)] transition-all duration-150"
              >
                {/* Header Row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-[#18212f] font-mono">
                          {order.order_number}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-xs text-[#94a3b8] mt-1">
                        {new Date(order.created_at).toLocaleString('ar-IQ')}
                      </div>
                    </div>
                  </div>

                  {/* Customer Quick Summary */}
                  <div className="text-sm text-[#334155] space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-[#18212f]">{addr.full_name || 'زبون ضيف'}</span>
                    </div>
                    {addr.phone && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openWhatsAppMessage(order, 'received');
                        }}
                        title={language === 'ar' ? 'إرسال رسالة واتساب للزبون' : 'Send WhatsApp message to customer'}
                        className="flex items-center gap-2 text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-bold dir-ltr text-right"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{addr.phone}</span>
                      </button>
                    )}
                  </div>

                  {/* Total Amount & Action buttons */}
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-left">
                      <div className="text-xs text-[#94a3b8]">الإجمالي النهائي</div>
                      <div className="text-xl font-extrabold text-[#047857]">
                        {order.total.toLocaleString()} <span className="text-xs font-normal">د.ع</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintReceipt(order)}
                        title="طباعة وصل التوصيل"
                        className="p-2.5 bg-[#fbfcfe] hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] rounded-xl transition-colors border border-[#e3e9f1] hover:border-[#bfdbfe]"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order.id)
                        }
                        className="px-3 py-2 bg-[#fbfcfe] hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border border-[#e3e9f1] hover:border-[#bfdbfe]"
                      >
                        التفاصيل
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-5 bg-[#f4f7fb] border-t border-[#e3e9f1] space-y-6">
                    {/* Customer Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#fbfcfe] p-4 rounded-xl border border-[#e3e9f1]">
                      <div>
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          عنوان التوصيل
                        </h4>
                        <div className="text-sm text-[#18212f] space-y-1">
                          <p>
                            <span className="text-[#64748b]">المحافظة / المنطقة:</span>{' '}
                            {addr.city || '-'} {addr.area ? `، ${addr.area}` : ''}
                          </p>
                          <p>
                            <span className="text-[#64748b]">الشارع / البناية:</span>{' '}
                            {addr.street || '-'} {addr.building ? `، بناية ${addr.building}` : ''}
                          </p>
                        </div>
                      </div>

                      {order.notes && (
                        <div>
                          <h4 className="text-xs font-bold text-[#b45309] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            ملاحظات الزبون
                          </h4>
                          <p className="text-xs text-[#334155] bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                            {order.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Items Table */}
                    <div>
                      <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
                        عناصر الطلب ({order.items?.length || 0})
                      </h4>

                      <div className="overflow-x-auto rounded-xl border border-[#e3e9f1] bg-[#fbfcfe]">
                        <table className="w-full text-right text-xs">
                          <thead className="bg-[#f4f7fb] text-[#64748b] font-bold border-b border-[#e3e9f1]">
                            <tr>
                              <th className="p-3">اسم المنتج</th>
                              <th className="p-3 text-center">الكمية</th>
                              <th className="p-3 text-left">سعر المفرد</th>
                              <th className="p-3 text-left">المجموع</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e8edf4]">
                            {(order.items || []).map((item) => {
                              let productName = 'منتج';
                              if (
                                typeof item.product_name === 'object' &&
                                item.product_name !== null
                              ) {
                                productName =
                                  item.product_name.ar ||
                                  item.product_name.en ||
                                  'منتج';
                              } else if (typeof item.product_name === 'string') {
                                productName = item.product_name;
                              }

                              return (
                                <tr key={item.id} className="hover:bg-[#f4f7fb]">
                                  <td className="p-3 font-semibold text-[#18212f]">
                                    {productName}
                                  </td>
                                  <td className="p-3 text-center text-[#334155] font-mono">
                                    {item.quantity}
                                  </td>
                                  <td className="p-3 text-left text-[#334155] font-mono">
                                    {item.unit_price.toLocaleString()} د.ع
                                  </td>
                                  <td className="p-3 text-left font-bold text-[#047857] font-mono">
                                    {item.total_price.toLocaleString()} د.ع
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Change Status Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748b]">تغيير حالة الطلب:</span>

                        <button
                          disabled={actionLoadingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-semibold shadow-[0_4px_10px_rgba(37,99,235,0.2)] transition-all active:translate-y-px disabled:opacity-50"
                        >
                          تأكيد وتجهيز 📦
                        </button>

                        <button
                          disabled={actionLoadingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-[0_4px_10px_rgba(6,182,212,0.2)] transition-all active:translate-y-px disabled:opacity-50"
                        >
                          تم الشحن 🚚
                        </button>

                        <button
                          disabled={actionLoadingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-[0_4px_10px_rgba(16,185,129,0.2)] transition-all active:translate-y-px disabled:opacity-50"
                        >
                          تم التوصيل ✅
                        </button>

                        <button
                          disabled={actionLoadingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-[0_4px_10px_rgba(225,29,72,0.2)] transition-all active:translate-y-px disabled:opacity-50"
                        >
                          إلغاء الطلب ❌
                        </button>
                      </div>

                      <button
                        onClick={() => handlePrintReceipt(order)}
                        className="px-4 py-2 bg-[#fbfcfe] hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#64748b] border border-[#e3e9f1] rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                        طباعة وصل التوصيل
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
