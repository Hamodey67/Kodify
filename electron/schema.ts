import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users / Cashiers
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'admin' | 'cashier'
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').notNull(),
});

// Products & Inventory
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  barcode: text('barcode'), // NULL means no barcode, or alphanumeric
  sku: text('sku'),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  nameKu: text('name_ku'),
  category: text('category').notNull().default('General'),
  price: real('price').notNull(),
  cost: real('cost').notNull(),
  stock: real('stock').notNull().default(0),
  minStock: real('min_stock').notNull().default(5),
  taxRate: real('tax_rate').notNull().default(15), // VAT standard in many places is 15%
  color: text('color'),
  image: text('image'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  barcodeUnique: uniqueIndex('products_barcode_unique').on(table.barcode).where(sql`is_active = 1`),
  skuUnique: uniqueIndex('products_sku_unique').on(table.sku).where(sql`is_active = 1`),
}));

// Customer Loyalty & Accounts
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').unique(),
  email: text('email'),
  points: integer('points').notNull().default(0),
  balance: real('balance').notNull().default(0), // Negative means debt, positive means credit
  createdAt: text('created_at').notNull(),
});

// Sales Transactions (Invoices)
export const sales = sqliteTable('sales', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoiceNumber: text('invoice_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id).notNull(),
  customerId: integer('customer_id').references(() => customers.id),
  totalAmount: real('total_amount').notNull(),
  taxAmount: real('tax_amount').notNull(),
  discountAmount: real('discount_amount').notNull().default(0),
  paymentMethod: text('payment_method').notNull(), // 'cash' | 'card' | 'split'
  cashReceived: real('cash_received').notNull().default(0),
  cashReturned: real('cash_returned').notNull().default(0),
  status: text('status').notNull().default('completed'), // 'completed' | 'refunded'
  createdAt: text('created_at').notNull(),
});

// Invoice Item Details
export const saleItems = sqliteTable('sale_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  saleId: integer('sale_id').references(() => sales.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: real('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  costPrice: real('cost_price').notNull(), // captured to calculate profit accurately
  taxAmount: real('tax_amount').notNull(),
  discountAmount: real('discount_amount').notNull().default(0),
  totalPrice: real('total_price').notNull(),
});

// Shift Drawer Cash Sessions
export const shifts = sqliteTable('shifts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  status: text('status').notNull(), // 'open' | 'closed'
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  startingCash: real('starting_cash').notNull(),
  cashAdditions: real('cash_additions').notNull().default(0),
  cashWithdrawals: real('cash_withdrawals').notNull().default(0),
  expectedCash: real('expected_cash').notNull().default(0), // calculated cash at close
  actualCash: real('actual_cash'), // cash typed by cashier at close
  differenceAmount: real('difference_amount'), // actual - expected
  note: text('note'),
});

// Shift Cash Adjustments (e.g. cash additions/withdrawals)
export const shiftTransactions = sqliteTable('shift_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shiftId: integer('shift_id').references(() => shifts.id).notNull(),
  type: text('type').notNull(), // 'cash_in' | 'cash_out'
  amount: real('amount').notNull(),
  reason: text('reason').notNull(),
  timestamp: text('timestamp').notNull(),
});

// Global Settings (Key-Value)
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// Price override audit log
export const priceOverrides = sqliteTable('price_overrides', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull(),
  itemName: text('item_name').notNull(),
  originalPrice: real('original_price').notNull(),
  newPrice: real('new_price').notNull(),
  reason: text('reason'),
  authorizedBy: text('authorized_by').notNull(),
  timestamp: text('timestamp').notNull(),
});

// Messages Chat
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sender: text('sender').notNull(), // 'cashier' | 'manager'
  senderName: text('sender_name').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull(),
});

