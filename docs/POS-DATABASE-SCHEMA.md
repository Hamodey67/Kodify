# 1of1 — Supabase Database Schema (للربط مع نظام POS)

مستند مرجعي مختصر لربط نظام المبيعات والمخزون المحلي (POS) مع قاعدة بيانات متجر 1of1.

| المصدر | المسار |
|--------|--------|
| Schema SQL | `supabase/schema.sql` |
| TypeScript Types | `src/types/database.ts` |
| Order Status Type | `src/types/index.ts` |

---

## 1) الجداول المتعلقة بالمنتجات والطلبات

| الجدول | الغرض |
|--------|--------|
| `products` | المنتجات (سعر، مخزون، SKU) |
| `categories` | التصنيفات |
| `brands` | الماركات |
| `product_variants` | المتغيرات (لون/حجم...) مع SKU ومخزون فرعي |
| `product_images` | صور المنتجات |
| `orders` | الطلبات |
| `order_items` | عناصر الطلب |
| `addresses` | عناوين الزبائن المحفوظة |
| `profiles` | ملف الزبون/المدير |

---

## 2) أعمدة الجداول

### `products`

| Column | Type | ملاحظات |
|--------|------|---------|
| `id` | `uuid` PK | المعرّف الأساسي |
| `slug` | `text` unique | رابط المنتج |
| `category_id` | `uuid` FK → `categories.id` | |
| `brand_id` | `uuid` FK → `brands.id` \| null | |
| `name` | `jsonb` | `{ "ar": "...", "en": "...", "ku": "..." }` |
| `description` | `jsonb` \| null | نفس شكل اللغات |
| `price` | `numeric(12,2)` | السعر |
| `compare_at_price` | `numeric(12,2)` \| null | السعر قبل الخصم |
| `sku` | `text` \| null | **لا يوجد عمود barcode** — استخدم `sku` للمطابقة مع POS |
| `stock` | `int` ≥ 0 | كمية المخزون (افتراضي 0) |
| `is_active` | `boolean` | |
| `is_featured` | `boolean` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### `categories`

| Column | Type |
|--------|------|
| `id` | `uuid` PK |
| `slug` | `text` unique |
| `name` | `jsonb` `{ ar, en, ku }` |
| `description` | `jsonb` \| null |
| `image_url` | `text` \| null |
| `sort_order` | `int` |
| `is_active` | `boolean` |
| `created_at` | `timestamptz` |

### `brands`

| Column | Type |
|--------|------|
| `id` | `uuid` PK |
| `slug` | `text` unique |
| `name` | `jsonb` `{ ar, en, ku }` |
| `logo_url` | `text` \| null |
| `is_active` | `boolean` |
| `created_at` | `timestamptz` |

### `product_variants`

| Column | Type | ملاحظات |
|--------|------|---------|
| `id` | `uuid` PK | |
| `product_id` | `uuid` FK → `products.id` | |
| `name` | `jsonb` | |
| `sku` | `text` \| null | SKU للمتغير |
| `price_adjustment` | `numeric(12,2)` | تعديل على سعر المنتج |
| `stock` | `int` ≥ 0 | مخزون المتغير |
| `attributes` | `jsonb` | مثال: `{ "color": "red", "size": "50ml" }` |

### `product_images`

| Column | Type |
|--------|------|
| `id` | `uuid` PK |
| `product_id` | `uuid` FK → `products.id` |
| `url` | `text` |
| `alt_text` | `jsonb` \| null |
| `sort_order` | `int` |
| `is_primary` | `boolean` |

### `orders`

| Column | Type | ملاحظات |
|--------|------|---------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` \| null | FK → `auth.users` (قد يكون null للضيف) |
| `order_number` | `text` unique | رقم الطلب الظاهر |
| `status` | `text` | انظر قسم الحالات |
| `subtotal` | `numeric(12,2)` | |
| `shipping_cost` | `numeric(12,2)` | افتراضي 0 |
| `discount` | `numeric(12,2)` | افتراضي 0 |
| `total` | `numeric(12,2)` | |
| `shipping_address` | `jsonb` | **بيانات الزبون (اسم/هاتف/عنوان)** |
| `notes` | `text` \| null | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

#### شكل `shipping_address` المتوقع

غير مقيّد بصرامة في SQL، لكن الشكل المستخدم في المشروع:

```json
{
  "full_name": "اسم الزبون",
  "phone": "07xxxxxxxxx",
  "city": "بغداد",
  "area": "الكرادة",
  "street": "شارع ...",
  "building": "بناية / طابق",
  "notes": "ملاحظات التوصيل"
}
```

### `order_items`

| Column | Type | ملاحظات |
|--------|------|---------|
| `id` | `uuid` PK | |
| `order_id` | `uuid` FK → `orders.id` | |
| `product_id` | `uuid` FK → `products.id` | |
| `variant_id` | `uuid` \| null | FK → `product_variants.id` |
| `product_name` | `jsonb` | لقطة اسم المنتج وقت الطلب `{ ar, en, ku }` |
| `quantity` | `int` > 0 | الكمية |
| `unit_price` | `numeric(12,2)` | سعر الوحدة |
| `total_price` | `numeric(12,2)` | الإجمالي للسطر |

### `addresses` (عناوين محفوظة للحساب)

| Column | Type |
|--------|------|
| `id` | `uuid` PK |
| `user_id` | `uuid` FK → `auth.users` |
| `label` | `text` (افتراضي `home`) |
| `full_name` | `text` |
| `phone` | `text` |
| `city` | `text` |
| `area` | `text` |
| `street` | `text` |
| `building` | `text` \| null |
| `notes` | `text` \| null |
| `is_default` | `boolean` |
| `created_at` | `timestamptz` |

### `profiles`

| Column | Type |
|--------|------|
| `id` | `uuid` PK (= `auth.users.id`) |
| `full_name` | `text` \| null |
| `phone` | `text` \| null |
| `avatar_url` | `text` \| null |
| `role` | `text` — `customer` \| `admin` |
| `created_at` | `timestamptz` |
| `updated_at` | `timestamptz` |

---

## 3) حالات الطلب (Order Statuses)

القيم المسموحة فقط:

| Status | المعنى |
|--------|--------|
| `pending` | قيد الانتظار (الافتراضي) |
| `confirmed` | مؤكد |
| `shipped` | تم الشحن |
| `delivered` | تم التوصيل |
| `cancelled` | ملغي |

مسار شائع:

```
pending → confirmed → shipped → delivered
                ↘ cancelled
```

**ملاحظة:** لا يوجد `processing` في هذا المشروع.

TypeScript:

```ts
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
```

---

## 4) ملف الـ TypeScript Types

### المسار الرئيسي
`src/types/database.ts`

يحتوي على:

- `export interface Database` — أنواع جداول Supabase (`Row` / `Insert` / `Update`)
- `LocalizedText` = `{ ar: string; en: string; ku: string }`
- Aliases جاهزة: `Product`, `Order`, `OrderItem`, `Category`, `Brand`, `Address`, `Profile`, ...

### إعادة التصدير
`src/types/index.ts` — يعيد تصدير الأنواع أعلاه + `OrderStatus` + `CartItem`.

### أمثلة مختصرة من الأنواع

```ts
// products.Row
{
  id: string;
  slug: string;
  category_id: string;
  brand_id: string | null;
  name: LocalizedText;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// orders.Row
{
  id: string;
  user_id: string | null;
  order_number: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  shipping_address: Json; // كائن JSON لبيانات الزبون
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// order_items.Row
{
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: LocalizedText;
  quantity: number;
  unit_price: number;
  total_price: number;
}
```

---

## 5) ملاحظات مهمة لفريق POS

1. **لا يوجد عمود `barcode`** حالياً. المطابقة الأنسب:
   - `products.sku`
   - أو `product_variants.sku`
2. أسماء المنتجات متعددة اللغات داخل `jsonb`.
3. بيانات زبون الطلب غالباً داخل `orders.shipping_address` وليست أعمدة منفصلة في جدول الطلب.
4. لمزامنة المخزون حدّث:
   - `products.stock`
   - و/أو `product_variants.stock` إن وُجد متغير.
5. الكتابة من نظام خارجي تحتاج **Service Role Key** لأن RLS مفعّل على الجداول.
6. العملة المستخدمة في الواجهة: **دينار عراقي (د.ع)**.

---

## 6) علاقات سريعة (ER مبسّط)

```
categories 1───* products *───1 brands
                 │
                 ├──* product_images
                 ├──* product_variants
                 └──* order_items *───1 orders
                                      │
                                      └── user_id → auth.users / profiles
```

---

*تم إعداد هذا الملف من schema المشروع الحالي — 1of1 Beauty.*
