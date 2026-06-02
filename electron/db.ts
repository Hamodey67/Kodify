import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import path from 'path';
import { app } from 'electron';
import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';

// Setup DB path in App Data folder for prod, local root for dev
const isProd = app.isPackaged;
const dbPath = isProd
  ? path.join(app.getPath('userData'), 'kodify-system.db')
  : path.join(process.cwd(), 'kodify-system.db');

console.log(`Database location: ${dbPath}`);

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Run migrations on startup
export async function initDatabase() {
  try {
    // Migrations are stored in 'drizzle' folder
    const migrationsFolder = isProd
      ? path.join(process.resourcesPath, 'drizzle')
      : path.join(process.cwd(), 'drizzle');
      
    console.log(`Looking for migrations in: ${migrationsFolder}`);
    migrate(db, { migrationsFolder });
    console.log('Database migrations applied successfully.');
    
    // Seed database if empty
    await seedDatabase();
    
    // Patch existing databases with updated branding if necessary
    await patchExistingBranding();
  } catch (error) {
    console.error('Failed to initialize database/apply migrations:', error);
  }
}

async function seedDatabase() {
  // Check if any users exist
  const existingUsers = await db.select().from(schema.users).limit(1);
  if (existingUsers.length > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  console.log('Seeding initial data...');
  const now = new Date().toISOString();

  // 1. Create Default Users (admin123 and cashier123)
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const cashierPasswordHash = bcrypt.hashSync('cashier123', 10);

  const seededUsers = await db.insert(schema.users).values([
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
  await db.insert(schema.settings).values([
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
    { key: 'admin_override_pin', value: '1234' },
  ]);

  console.log('Seeded settings.');

  // 3. Create Default Customers
  const defaultCustomer = await db.insert(schema.customers).values([
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
    await db.update(schema.settings)
      .set({ value: 'أسواق كوديفاي المركزية' })
      .where(
        and(
          eq(schema.settings.key, 'store_name_ar'),
          eq(schema.settings.value, 'أسواق الأمانة المركزية')
        )
      );

    // Update store_name_en
    await db.update(schema.settings)
      .set({ value: 'Kodify Central Markets' })
      .where(
        and(
          eq(schema.settings.key, 'store_name_en'),
          eq(schema.settings.value, 'Amana Central Markets')
        )
      );

    // Update receipt_header_ar
    await db.update(schema.settings)
      .set({ value: 'شكراً لزيارتكم أسواق كوديفاي' })
      .where(
        and(
          eq(schema.settings.key, 'receipt_header_ar'),
          eq(schema.settings.value, 'شكراً لزيارتكم أسواق الأمانة')
        )
      );

    // Update receipt_header_en
    await db.update(schema.settings)
      .set({ value: 'Thank you for shopping at Kodify' })
      .where(
        and(
          eq(schema.settings.key, 'receipt_header_en'),
          eq(schema.settings.value, 'Thank you for shopping at Amana')
        )
      );

    // Update walkin customer email if it's walkin@amana.com
    await db.update(schema.customers)
      .set({ email: 'walkin@kodify.com' })
      .where(eq(schema.customers.email, 'walkin@amana.com'));

    // --- Iraqi Localization Patches ---

    // Update currency_ar from ر.س to د.ع
    await db.update(schema.settings)
      .set({ value: 'د.ع' })
      .where(
        and(
          eq(schema.settings.key, 'currency_ar'),
          eq(schema.settings.value, 'ر.س')
        )
      );

    // Update currency_en from SAR to IQD
    await db.update(schema.settings)
      .set({ value: 'IQD' })
      .where(
        and(
          eq(schema.settings.key, 'currency_en'),
          eq(schema.settings.value, 'SAR')
        )
      );

    // Update store_address from Riyadh to Baghdad
    await db.update(schema.settings)
      .set({ value: 'بغداد، العراق' })
      .where(
        and(
          eq(schema.settings.key, 'store_address'),
          eq(schema.settings.value, 'الرياض، المملكة العربية السعودية')
        )
      );

    // Update store_phone from Saudi number to Iraq number
    await db.update(schema.settings)
      .set({ value: '+964 770 123 4567' })
      .where(
        and(
          eq(schema.settings.key, 'store_phone'),
          eq(schema.settings.value, '+966 50 123 4567')
        )
      );

    // Update store_tax_number from Saudi VAT to Iraq Tax ID
    await db.update(schema.settings)
      .set({ value: '100012345' })
      .where(
        and(
          eq(schema.settings.key, 'store_tax_number'),
          eq(schema.settings.value, '300012345600003')
        )
      );

    // Update store_tax_rate from 15% to 0%
    await db.update(schema.settings)
      .set({ value: '0' })
      .where(
        and(
          eq(schema.settings.key, 'store_tax_rate'),
          eq(schema.settings.value, '15')
        )
      );

    // Update cashier name from specific person to general "الكاشير (Cashier)"
    await db.update(schema.users)
      .set({ name: 'الكاشير (Cashier)' })
      .where(
        and(
          eq(schema.users.username, 'cashier'),
          eq(schema.users.name, 'أحمد الكاشير (Ahmed)')
        )
      );

    // Ensure admin override PIN exists for legacy databases
    await db
      .insert(schema.settings)
      .values({ key: 'admin_override_pin', value: '1234' })
      .onConflictDoNothing({ target: schema.settings.key });

    // Reset all product stocks to 0 for a clean start
    await db.update(schema.products).set({ stock: 0 });

    // Clear legacy default settings so the fields start empty for the user
    await db.update(schema.settings)
      .set({ value: '' })
      .where(
        and(
          eq(schema.settings.key, 'store_name_ar'),
          eq(schema.settings.value, 'أسواق كوديفاي المركزية')
        )
      );
    await db.update(schema.settings)
      .set({ value: '' })
      .where(
        and(
          eq(schema.settings.key, 'store_name_en'),
          eq(schema.settings.value, 'Kodify Central Markets')
        )
      );
    await db.update(schema.settings)
      .set({ value: '' })
      .where(
        and(
          eq(schema.settings.key, 'store_address'),
          eq(schema.settings.value, 'بغداد، العراق')
        )
      );
    await db.update(schema.settings)
      .set({ value: '' })
      .where(
        and(
          eq(schema.settings.key, 'store_phone'),
          eq(schema.settings.value, '+964 770 123 4567')
        )
      );
    await db.update(schema.settings)
      .set({ value: '' })
      .where(
        and(
          eq(schema.settings.key, 'store_tax_number'),
          eq(schema.settings.value, '100012345')
        )
      );
    await db.update(schema.settings)
      .set({ value: '' })
      .where(
        and(
          eq(schema.settings.key, 'hardware_printer_ip'),
          eq(schema.settings.value, '192.168.1.100')
        )
      );

    console.log('Database branding settings patched successfully to Kodify & Iraqi localization.');
  } catch (error) {
    console.error('Failed to patch database branding settings:', error);
  }
}
