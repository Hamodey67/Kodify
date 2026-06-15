"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceOverrides = exports.settings = exports.shiftTransactions = exports.shifts = exports.saleItems = exports.sales = exports.customers = exports.products = exports.users = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
// Users / Cashiers
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    username: (0, sqlite_core_1.text)('username').notNull().unique(),
    passwordHash: (0, sqlite_core_1.text)('password_hash').notNull(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    role: (0, sqlite_core_1.text)('role').notNull(), // 'admin' | 'cashier'
    isActive: (0, sqlite_core_1.integer)('is_active', { mode: 'boolean' }).default(true).notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull(),
});
// Products & Inventory
exports.products = (0, sqlite_core_1.sqliteTable)('products', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    barcode: (0, sqlite_core_1.text)('barcode'), // NULL means no barcode, or alphanumeric
    sku: (0, sqlite_core_1.text)('sku'),
    nameAr: (0, sqlite_core_1.text)('name_ar').notNull(),
    nameEn: (0, sqlite_core_1.text)('name_en').notNull(),
    nameKu: (0, sqlite_core_1.text)('name_ku'),
    category: (0, sqlite_core_1.text)('category').notNull().default('General'),
    price: (0, sqlite_core_1.real)('price').notNull(),
    cost: (0, sqlite_core_1.real)('cost').notNull(),
    stock: (0, sqlite_core_1.real)('stock').notNull().default(0),
    minStock: (0, sqlite_core_1.real)('min_stock').notNull().default(5),
    taxRate: (0, sqlite_core_1.real)('tax_rate').notNull().default(15), // VAT standard in many places is 15%
    color: (0, sqlite_core_1.text)('color'),
    image: (0, sqlite_core_1.text)('image'),
    isActive: (0, sqlite_core_1.integer)('is_active', { mode: 'boolean' }).default(true).notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull(),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull(),
}, (table) => ({
    barcodeUnique: (0, sqlite_core_1.uniqueIndex)('products_barcode_unique').on(table.barcode).where((0, drizzle_orm_1.sql) `is_active = 1`),
    skuUnique: (0, sqlite_core_1.uniqueIndex)('products_sku_unique').on(table.sku).where((0, drizzle_orm_1.sql) `is_active = 1`),
}));
// Customer Loyalty & Accounts
exports.customers = (0, sqlite_core_1.sqliteTable)('customers', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    phone: (0, sqlite_core_1.text)('phone').unique(),
    email: (0, sqlite_core_1.text)('email'),
    points: (0, sqlite_core_1.integer)('points').notNull().default(0),
    balance: (0, sqlite_core_1.real)('balance').notNull().default(0), // Negative means debt, positive means credit
    createdAt: (0, sqlite_core_1.text)('created_at').notNull(),
});
// Sales Transactions (Invoices)
exports.sales = (0, sqlite_core_1.sqliteTable)('sales', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    invoiceNumber: (0, sqlite_core_1.text)('invoice_number').notNull().unique(),
    userId: (0, sqlite_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    customerId: (0, sqlite_core_1.integer)('customer_id').references(() => exports.customers.id),
    totalAmount: (0, sqlite_core_1.real)('total_amount').notNull(),
    taxAmount: (0, sqlite_core_1.real)('tax_amount').notNull(),
    discountAmount: (0, sqlite_core_1.real)('discount_amount').notNull().default(0),
    paymentMethod: (0, sqlite_core_1.text)('payment_method').notNull(), // 'cash' | 'card' | 'split'
    cashReceived: (0, sqlite_core_1.real)('cash_received').notNull().default(0),
    cashReturned: (0, sqlite_core_1.real)('cash_returned').notNull().default(0),
    status: (0, sqlite_core_1.text)('status').notNull().default('completed'), // 'completed' | 'refunded'
    createdAt: (0, sqlite_core_1.text)('created_at').notNull(),
});
// Invoice Item Details
exports.saleItems = (0, sqlite_core_1.sqliteTable)('sale_items', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    saleId: (0, sqlite_core_1.integer)('sale_id').references(() => exports.sales.id).notNull(),
    productId: (0, sqlite_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, sqlite_core_1.real)('quantity').notNull(),
    unitPrice: (0, sqlite_core_1.real)('unit_price').notNull(),
    costPrice: (0, sqlite_core_1.real)('cost_price').notNull(), // captured to calculate profit accurately
    taxAmount: (0, sqlite_core_1.real)('tax_amount').notNull(),
    discountAmount: (0, sqlite_core_1.real)('discount_amount').notNull().default(0),
    totalPrice: (0, sqlite_core_1.real)('total_price').notNull(),
});
// Shift Drawer Cash Sessions
exports.shifts = (0, sqlite_core_1.sqliteTable)('shifts', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(), // 'open' | 'closed'
    startTime: (0, sqlite_core_1.text)('start_time').notNull(),
    endTime: (0, sqlite_core_1.text)('end_time'),
    startingCash: (0, sqlite_core_1.real)('starting_cash').notNull(),
    cashAdditions: (0, sqlite_core_1.real)('cash_additions').notNull().default(0),
    cashWithdrawals: (0, sqlite_core_1.real)('cash_withdrawals').notNull().default(0),
    expectedCash: (0, sqlite_core_1.real)('expected_cash').notNull().default(0), // calculated cash at close
    actualCash: (0, sqlite_core_1.real)('actual_cash'), // cash typed by cashier at close
    differenceAmount: (0, sqlite_core_1.real)('difference_amount'), // actual - expected
    note: (0, sqlite_core_1.text)('note'),
});
// Shift Cash Adjustments (e.g. cash additions/withdrawals)
exports.shiftTransactions = (0, sqlite_core_1.sqliteTable)('shift_transactions', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    shiftId: (0, sqlite_core_1.integer)('shift_id').references(() => exports.shifts.id).notNull(),
    type: (0, sqlite_core_1.text)('type').notNull(), // 'cash_in' | 'cash_out'
    amount: (0, sqlite_core_1.real)('amount').notNull(),
    reason: (0, sqlite_core_1.text)('reason').notNull(),
    timestamp: (0, sqlite_core_1.text)('timestamp').notNull(),
});
// Global Settings (Key-Value)
exports.settings = (0, sqlite_core_1.sqliteTable)('settings', {
    key: (0, sqlite_core_1.text)('key').primaryKey(),
    value: (0, sqlite_core_1.text)('value').notNull(),
});
// Price override audit log
exports.priceOverrides = (0, sqlite_core_1.sqliteTable)('price_overrides', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    itemId: (0, sqlite_core_1.integer)('item_id').notNull(),
    itemName: (0, sqlite_core_1.text)('item_name').notNull(),
    originalPrice: (0, sqlite_core_1.real)('original_price').notNull(),
    newPrice: (0, sqlite_core_1.real)('new_price').notNull(),
    reason: (0, sqlite_core_1.text)('reason'),
    authorizedBy: (0, sqlite_core_1.text)('authorized_by').notNull(),
    timestamp: (0, sqlite_core_1.text)('timestamp').notNull(),
});
