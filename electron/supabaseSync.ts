import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BrowserWindow } from 'electron';
import { db } from './db';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import WebSocket from 'ws';

// Polyfill WebSocket for Node.js / Electron main process
if (typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = WebSocket;
}

let supabaseClient: SupabaseClient | null = null;
let realtimeChannel: any = null;

// Default credentials provided by the user
const DEFAULT_SUPABASE_URL = 'https://zutqverlqobsrmodlqwq.supabase.co';
const DEFAULT_SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dHF2ZXJscW9ic3Jtb2RscXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTAwNDM2MiwiZXhwIjoyMTAwNTgwMzYyfQ.w1Kq8xae0csl62hroWHD8BIXz4db9GLvRMSqGZu1NCM';

export async function getSetting(key: string, fallback = ''): Promise<string> {
  try {
    const rows = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, key))
      .limit(1);
    const val = rows[0]?.value;
    if (val && val.trim() !== '') {
      return val;
    }
    return fallback;
  } catch (err) {
    return fallback;
  }
}

export async function saveSetting(key: string, value: string): Promise<void> {
  await db
    .insert(schema.settings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: { value },
    });
}

export async function seedSupabaseSettingsIfEmpty() {
  try {
    const url = await getSetting('supabase_url', '');
    if (!url) {
      await saveSetting('supabase_url', DEFAULT_SUPABASE_URL);
    }
    const key = await getSetting('supabase_service_role_key', '');
    if (!key) {
      await saveSetting('supabase_service_role_key', DEFAULT_SUPABASE_SERVICE_ROLE_KEY);
    }
    const enabled = await getSetting('supabase_enabled', '');
    if (!enabled) {
      await saveSetting('supabase_enabled', 'true');
    }
  } catch (err) {
    console.error('Error seeding supabase settings:', err);
  }
}

export async function initSupabaseClient(): Promise<SupabaseClient | null> {
  await seedSupabaseSettingsIfEmpty();

  const enabled = await getSetting('supabase_enabled', 'true');
  if (enabled !== 'true') {
    supabaseClient = null;
    return null;
  }

  const url = await getSetting('supabase_url', DEFAULT_SUPABASE_URL);
  const key = await getSetting(
    'supabase_service_role_key',
    DEFAULT_SUPABASE_SERVICE_ROLE_KEY
  );

  if (!url || !key) {
    supabaseClient = null;
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false },
      realtime: {
        transport: WebSocket as any,
      },
    });

    try {
      setupRealtimeSubscription();
    } catch (e) {
      console.error('Realtime subscription error:', e);
    }

    return supabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase Client:', err);
    supabaseClient = null;
    return null;
  }
}

export function getClient(): SupabaseClient | null {
  return supabaseClient;
}

/** يمنع ظهور اسم مزوّد الخدمة أو عنوان المشروع داخل الرسائل المعروضة للمستخدم */
function cleanMessage(message?: string): string {
  if (!message) return 'خطأ غير معروف';
  return message
    .replace(/https?:\/\/[^\s"']+/gi, 'الخادم السحابي')
    .replace(/supabase/gi, 'الخادم السحابي')
    .trim();
}

export async function testSupabaseConnection(
  customUrl?: string,
  customKey?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const url = (customUrl && customUrl.trim()) || (await getSetting('supabase_url', DEFAULT_SUPABASE_URL));
    const key =
      (customKey && customKey.trim()) ||
      (await getSetting('supabase_service_role_key', DEFAULT_SUPABASE_SERVICE_ROLE_KEY));

    if (!url || !key) {
      return { success: false, message: 'بيانات الاتصال بالخادم السحابي غير مكتملة' };
    }

    const testClient = createClient(url, key, {
      auth: { persistSession: false },
      realtime: {
        transport: WebSocket as any,
      },
    });

    const { error } = await testClient
      .from('orders')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return { success: false, message: `خطأ في الاتصال: ${cleanMessage(error.message)}` };
    }

    return { success: true, message: 'تم الاتصال بالخادم السحابي بنجاح' };
  } catch (err: any) {
    return {
      success: false,
      message: `تعذر الاتصال بالخادم السحابي: ${cleanMessage(err?.message)}`,
    };
  }
}

export async function fetchOnlineOrders() {
  let client = getClient();
  if (!client) {
    client = await initSupabaseClient();
  }

  if (!client) {
    return { success: false, orders: [], error: 'تعذر الاتصال بالخادم السحابي. يرجى التأكد من الإعدادات.' };
  }

  try {
    // 1. Fetch orders
    const { data: orders, error: ordersError } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching online orders:', ordersError);
      return { success: false, orders: [], error: cleanMessage(ordersError.message) };
    }

    if (!orders || orders.length === 0) {
      return { success: true, orders: [] };
    }

    const orderIds = orders.map((o) => o.id);

    // 2. Fetch items for all these orders
    const { data: items, error: itemsError } = await client
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
    }

    // Group items by order_id
    const itemsByOrder: Record<string, any[]> = {};
    (items || []).forEach((item) => {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push(item);
    });

    // Combine
    const fullOrders = orders.map((order) => ({
      ...order,
      items: itemsByOrder[order.id] || [],
    }));

    return { success: true, orders: fullOrders };
  } catch (err: any) {
    console.error('Failed to fetch online orders:', err);
    return { success: false, orders: [], error: cleanMessage(err?.message) };
  }
}

export async function updateOnlineOrderStatus(orderId: string, status: string) {
  let client = getClient();
  if (!client) {
    client = await initSupabaseClient();
  }

  if (!client) {
    return { success: false, error: 'تعذر الاتصال بالخادم السحابي' };
  }

  try {
    const { data, error } = await client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: cleanMessage(error.message) };
    }

    // Notify all windows of the updated status
    notifyOrderUpdated(orderId, status);

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to update order status:', err);
    return { success: false, error: cleanMessage(err?.message) };
  }
}

function notifyNewOrder(orderPayload: any) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('supabase:new-order-received', orderPayload);
  }
}

function notifyOrderUpdated(orderId: string, status: string) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('supabase:order-status-changed', { orderId, status });
  }
}

export function setupRealtimeSubscription() {
  if (!supabaseClient) return;

  if (realtimeChannel) {
    try {
      supabaseClient.removeChannel(realtimeChannel);
    } catch (e) {}
  }

  try {
    realtimeChannel = supabaseClient
      .channel('kodify-online-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('🔔 New Online Order Received via Realtime:', payload.new);
          notifyNewOrder(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('🔄 Order Status Updated via Realtime:', payload.new);
          if (payload.new && payload.new.id && payload.new.status) {
            notifyOrderUpdated(payload.new.id, payload.new.status);
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase Realtime Subscription Status:', status);
      });
  } catch (err) {
    console.error('Error setting up Supabase Realtime subscription:', err);
  }
}

export async function fetchWebCategories() {
  let client = getClient();
  if (!client) {
    client = await initSupabaseClient();
  }
  if (!client) {
    return { success: false, categories: [], error: 'تعذر الاتصال بالخادم السحابي' };
  }
  try {
    const { data, error } = await client.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return { success: true, categories: data || [] };
  } catch (err: any) {
    console.error('Failed to fetch web categories:', err);
    return { success: false, categories: [], error: cleanMessage(err?.message) };
  }
}

export async function fetchWebBrands() {
  let client = getClient();
  if (!client) {
    client = await initSupabaseClient();
  }
  if (!client) {
    return { success: false, brands: [], error: 'تعذر الاتصال بالخادم السحابي' };
  }
  try {
    const { data, error } = await client.from('brands').select('*').order('slug', { ascending: true });
    if (error) throw error;
    return { success: true, brands: data || [] };
  } catch (err: any) {
    console.error('Failed to fetch web brands:', err);
    return { success: false, brands: [], error: cleanMessage(err?.message) };
  }
}

export async function transferProductToWeb(
  product: any,
  categoryId: string,
  brandId: string,
  webPrice: number,
  compareAtPrice: number | null,
  webStock: number
) {
  let client = getClient();
  if (!client) {
    client = await initSupabaseClient();
  }
  if (!client) {
    return { success: false, error: 'تعذر الاتصال بالخادم السحابي' };
  }
  try {
    const sku = product.sku || `1OF1-${String(product.id).padStart(3, '0')}`;
    const slug = (product.nameEn || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `product-${product.id}`;

    const nameObj = {
      ar: product.nameAr || '',
      en: product.nameEn || '',
      ku: product.nameKu || product.nameAr || '',
    };

    const descObj = {
      ar: product.nameAr || '',
      en: product.nameEn || '',
      ku: product.nameKu || product.nameAr || '',
    };

    // Check if product exists by SKU
    const { data: existing, error: findError } = await client
      .from('products')
      .select('id')
      .eq('sku', sku)
      .limit(1)
      .maybeSingle();

    if (findError) {
      console.warn('Error checking existing web product:', findError);
    }

    const payload: any = {
      slug,
      category_id: categoryId || null,
      brand_id: brandId || null,
      name: nameObj,
      description: descObj,
      price: webPrice,
      compare_at_price: compareAtPrice,
      sku,
      stock: webStock,
      is_active: true,
      is_featured: false,
      updated_at: new Date().toISOString(),
    };

    if (existing && existing.id) {
      const { error: updateError } = await client
        .from('products')
        .update(payload)
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return { success: true, message: 'تم تحديث المنتج بنجاح على الموقع الإلكتروني' };
    } else {
      payload.created_at = new Date().toISOString();
      const { error: insertError } = await client
        .from('products')
        .insert(payload);

      if (insertError) throw insertError;
      return { success: true, message: 'تمت إضافة المنتج بنجاح إلى الموقع الإلكتروني' };
    }
  } catch (err: any) {
    console.error('Failed to transfer product to web:', err);
    return { success: false, error: cleanMessage(err?.message) };
  }
}

