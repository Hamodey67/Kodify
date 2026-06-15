"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDatabase = initDatabase;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const better_sqlite3_2 = require("drizzle-orm/better-sqlite3");
const migrator_1 = require("drizzle-orm/better-sqlite3/migrator");
const schema = __importStar(require("./schema"));
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const fs_1 = __importDefault(require("fs"));
// Setup DB path in App Data folder for prod, local root for dev
const isProd = electron_1.app.isPackaged;
const dbPath = isProd
    ? path_1.default.join(electron_1.app.getPath('userData'), 'kodify-system.db')
    : path_1.default.join(process.cwd(), 'kodify-system.db');
console.log(`Database location: ${dbPath}`);
const sqlite = new better_sqlite3_1.default(dbPath);
sqlite.pragma('journal_mode = WAL');
exports.db = (0, better_sqlite3_2.drizzle)(sqlite, { schema });
function getDatabaseBackupPath() {
    const backupDir = path_1.default.join(path_1.default.dirname(dbPath), 'backups');
    const safeVersion = electron_1.app.getVersion().replace(/[^a-zA-Z0-9._-]/g, '_');
    return path_1.default.join(backupDir, `kodify-system-before-v${safeVersion}.db`);
}
async function backupDatabaseBeforeMigrations() {
    if (!fs_1.default.existsSync(dbPath) || fs_1.default.statSync(dbPath).size === 0) {
        console.log('No existing database found. Skipping pre-migration backup.');
        return;
    }
    const backupPath = getDatabaseBackupPath();
    if (fs_1.default.existsSync(backupPath)) {
        console.log(`Pre-migration backup already exists: ${backupPath}`);
        return;
    }
    fs_1.default.mkdirSync(path_1.default.dirname(backupPath), { recursive: true });
    await sqlite.backup(backupPath);
    console.log(`Created pre-migration database backup: ${backupPath}`);
}
// Run migrations on startup
async function initDatabase() {
    try {
        // Migrations are stored in 'drizzle' folder
        const migrationsFolder = isProd
            ? path_1.default.join(process.resourcesPath, 'drizzle')
            : path_1.default.join(process.cwd(), 'drizzle');
        console.log(`Looking for migrations in: ${migrationsFolder}`);
        await backupDatabaseBeforeMigrations();
        (0, migrator_1.migrate)(exports.db, { migrationsFolder });
        console.log('Database migrations applied successfully.');
        // Ensure the color column exists in the products table (migration fallback)
        try {
            sqlite.exec("ALTER TABLE products ADD COLUMN color TEXT;");
            console.log("Added column 'color' to 'products' table.");
        }
        catch (e) {
            // Column might already exist, which is fine
        }
        // Ensure the image column exists in the products table (migration fallback)
        try {
            sqlite.exec("ALTER TABLE products ADD COLUMN image TEXT;");
            console.log("Added column 'image' to 'products' table.");
        }
        catch (e) {
            // Column might already exist, which is fine
        }
        // Seed database if empty
        await seedDatabase();
        // Patch existing databases with updated branding if necessary
        await patchExistingBranding();
    }
    catch (error) {
        console.error('Failed to initialize database/apply migrations:', error);
    }
}
async function seedDatabase() {
    // Check if any users exist
    const existingUsers = await exports.db.select().from(schema.users).limit(1);
    if (existingUsers.length > 0) {
        console.log('Database already has data. Skipping seed.');
        return;
    }
    console.log('Seeding initial data...');
    const now = new Date().toISOString();
    // 1. Create Default Users (admin123 and cashier123)
    const adminPasswordHash = bcryptjs_1.default.hashSync('admin123', 10);
    const cashierPasswordHash = bcryptjs_1.default.hashSync('cashier123', 10);
    const seededUsers = await exports.db.insert(schema.users).values([
        {
            username: 'admin',
            passwordHash: adminPasswordHash,
            name: 'مدير النظام (Admin)',
            role: 'admin',
            isActive: true,
            createdAt: now,
        },
        {
            username: 'cashier',
            passwordHash: cashierPasswordHash,
            name: 'الكاشير (Cashier)',
            role: 'cashier',
            isActive: true,
            createdAt: now,
        },
    ]).returning();
    console.log('Seeded users.');
    // 2. Create Default settings
    await exports.db.insert(schema.settings).values([
        { key: 'store_name_ar', value: '' },
        { key: 'store_name_en', value: '' },
        { key: 'store_address', value: '' },
        { key: 'store_phone', value: '' },
        { key: 'store_tax_number', value: '' },
        { key: 'store_tax_rate', value: '0' }, // 0% tax default in Iraq
        { key: 'currency_ar', value: 'د.ع' },
        { key: 'currency_en', value: 'IQD' },
        { key: 'receipt_header_ar', value: 'شكراً لزيارتكم' },
        { key: 'receipt_header_en', value: 'Thank you for shopping' },
        { key: 'receipt_footer_ar', value: 'البضاعة المباعة لا ترد ولا تستبدل بعد ٧ أيام' },
        { key: 'receipt_footer_en', value: 'Goods can be returned/exchanged within 7 days' },
        { key: 'hardware_drawer_port', value: 'COM1' },
        { key: 'hardware_printer_ip', value: '' },
        { key: 'hardware_printer_type', value: 'network' }, // network / usb / serial
        { key: 'hardware_mock_mode', value: 'true' }, // Development mock layer
        { key: 'admin_override_pin', value: '1010' },
        { key: 'mobile_manager_pin', value: '1010' },
        { key: 'mobile_manager_port', value: '8787' },
        { key: 'mobile_tunnel_enabled', value: 'false' },
        { key: 'mobile_tunnel_mode', value: 'quick' },
        { key: 'mobile_tunnel_cloudflared_path', value: 'cloudflared' },
        { key: 'mobile_tunnel_token', value: '' },
        { key: 'mobile_tunnel_last_url', value: '' },
    ]);
    console.log('Seeded settings.');
    // 3. Create Default Customers
    const defaultCustomer = await exports.db.insert(schema.customers).values([
        {
            name: 'عميل نقدي (Walk-in Customer)',
            phone: '0000000000',
            email: 'walkin@kodify.com',
            points: 0,
            balance: 0,
            createdAt: now,
        },
        {
            name: 'خالد عبد الرحمن',
            phone: '0555555555',
            email: 'khaled@gmail.com',
            points: 120,
            balance: 0,
            createdAt: now,
        },
        {
            name: 'فاطمة الحربي',
            phone: '0544444444',
            email: 'fatimah@gmail.com',
            points: 45,
            balance: -150.50, // owes money
            createdAt: now,
        },
    ]).returning();
    console.log('Seeded customers.');
    console.log('Database seeding finished successfully!');
}
async function patchExistingBranding() {
    try {
        // Update store_name_ar
        await exports.db.update(schema.settings)
            .set({ value: 'أسواق كوديفاي المركزية' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_name_ar'), (0, drizzle_orm_1.eq)(schema.settings.value, 'أسواق الأمانة المركزية')));
        // Update store_name_en
        await exports.db.update(schema.settings)
            .set({ value: 'Kodify Central Markets' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_name_en'), (0, drizzle_orm_1.eq)(schema.settings.value, 'Amana Central Markets')));
        // Update receipt_header_ar
        await exports.db.update(schema.settings)
            .set({ value: 'شكراً لزيارتكم أسواق كوديفاي' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'receipt_header_ar'), (0, drizzle_orm_1.eq)(schema.settings.value, 'شكراً لزيارتكم أسواق الأمانة')));
        // Update receipt_header_en
        await exports.db.update(schema.settings)
            .set({ value: 'Thank you for shopping at Kodify' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'receipt_header_en'), (0, drizzle_orm_1.eq)(schema.settings.value, 'Thank you for shopping at Amana')));
        // Update walkin customer email if it's walkin@amana.com
        await exports.db.update(schema.customers)
            .set({ email: 'walkin@kodify.com' })
            .where((0, drizzle_orm_1.eq)(schema.customers.email, 'walkin@amana.com'));
        // --- Iraqi Localization Patches ---
        // Update currency_ar from ر.س to د.ع
        await exports.db.update(schema.settings)
            .set({ value: 'د.ع' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'currency_ar'), (0, drizzle_orm_1.eq)(schema.settings.value, 'ر.س')));
        // Update currency_en from SAR to IQD
        await exports.db.update(schema.settings)
            .set({ value: 'IQD' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'currency_en'), (0, drizzle_orm_1.eq)(schema.settings.value, 'SAR')));
        // Update store_address from Riyadh to Baghdad
        await exports.db.update(schema.settings)
            .set({ value: 'بغداد، العراق' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_address'), (0, drizzle_orm_1.eq)(schema.settings.value, 'الرياض، المملكة العربية السعودية')));
        // Update store_phone from Saudi number to Iraq number
        await exports.db.update(schema.settings)
            .set({ value: '+964 770 123 4567' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_phone'), (0, drizzle_orm_1.eq)(schema.settings.value, '+966 50 123 4567')));
        // Update store_tax_number from Saudi VAT to Iraq Tax ID
        await exports.db.update(schema.settings)
            .set({ value: '100012345' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_tax_number'), (0, drizzle_orm_1.eq)(schema.settings.value, '300012345600003')));
        // Update store_tax_rate from 15% to 0%
        await exports.db.update(schema.settings)
            .set({ value: '0' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_tax_rate'), (0, drizzle_orm_1.eq)(schema.settings.value, '15')));
        // Update cashier name from specific person to general "الكاشير (Cashier)"
        await exports.db.update(schema.users)
            .set({ name: 'الكاشير (Cashier)' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.users.username, 'cashier'), (0, drizzle_orm_1.eq)(schema.users.name, 'أحمد الكاشير (Ahmed)')));
        // Ensure admin override PIN exists for legacy databases
        await exports.db
            .insert(schema.settings)
            .values({ key: 'admin_override_pin', value: '1010' })
            .onConflictDoNothing({ target: schema.settings.key });
        // Update existing default PIN to 1010 if it is still 1234
        await exports.db.update(schema.settings)
            .set({ value: '1010' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'admin_override_pin'), (0, drizzle_orm_1.eq)(schema.settings.value, '1234')));
        // Ensure manager mobile dashboard settings exist for updated offline installs.
        await exports.db
            .insert(schema.settings)
            .values({ key: 'mobile_manager_pin', value: '1010' })
            .onConflictDoNothing({ target: schema.settings.key });
        await exports.db
            .insert(schema.settings)
            .values({ key: 'mobile_manager_port', value: '8787' })
            .onConflictDoNothing({ target: schema.settings.key });
        await exports.db
            .insert(schema.settings)
            .values({ key: 'mobile_tunnel_enabled', value: 'false' })
            .onConflictDoNothing({ target: schema.settings.key });
        await exports.db
            .insert(schema.settings)
            .values({ key: 'mobile_tunnel_mode', value: 'quick' })
            .onConflictDoNothing({ target: schema.settings.key });
        await exports.db
            .insert(schema.settings)
            .values({ key: 'mobile_tunnel_cloudflared_path', value: 'cloudflared' })
            .onConflictDoNothing({ target: schema.settings.key });
        await exports.db
            .insert(schema.settings)
            .values({ key: 'mobile_tunnel_token', value: '' })
            .onConflictDoNothing({ target: schema.settings.key });
        await exports.db
            .insert(schema.settings)
            .values({ key: 'mobile_tunnel_last_url', value: '' })
            .onConflictDoNothing({ target: schema.settings.key });
        // Clear legacy default settings so the fields start empty for the user
        await exports.db.update(schema.settings)
            .set({ value: '' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_name_ar'), (0, drizzle_orm_1.eq)(schema.settings.value, 'أسواق كوديفاي المركزية')));
        await exports.db.update(schema.settings)
            .set({ value: '' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_name_en'), (0, drizzle_orm_1.eq)(schema.settings.value, 'Kodify Central Markets')));
        await exports.db.update(schema.settings)
            .set({ value: '' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_address'), (0, drizzle_orm_1.eq)(schema.settings.value, 'بغداد، العراق')));
        await exports.db.update(schema.settings)
            .set({ value: '' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_phone'), (0, drizzle_orm_1.eq)(schema.settings.value, '+964 770 123 4567')));
        await exports.db.update(schema.settings)
            .set({ value: '' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'store_tax_number'), (0, drizzle_orm_1.eq)(schema.settings.value, '100012345')));
        await exports.db.update(schema.settings)
            .set({ value: '' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.settings.key, 'hardware_printer_ip'), (0, drizzle_orm_1.eq)(schema.settings.value, '192.168.1.100')));
        console.log('Database branding settings patched successfully to Kodify & Iraqi localization.');
    }
    catch (error) {
        console.error('Failed to patch database branding settings:', error);
    }
}
