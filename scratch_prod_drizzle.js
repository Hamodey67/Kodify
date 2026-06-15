const { app } = require('electron');
const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const schema = require('./dist-electron/schema.js');

app.whenReady().then(async () => {
  const sqlite = new Database(process.env.APPDATA + '/kodify-system/kodify-system.db');
  const db = drizzle(sqlite, { schema });

  const payload = {
    barcode: '1234567890123',
    sku: 'PRD-112233',
    nameAr: 'Test',
    nameEn: 'Test',
    nameKu: null,
    category: 'General',
    price: 18000,
    cost: 15000,
    stock: 400,
    minStock: 50,
    taxRate: 0,
  };

  const now = new Date().toISOString();

  try {
    const result = await db.insert(schema.products).values({
      ...payload,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }).returning();
    console.log('Success:', result);
  } catch (error) {
    console.error('Insert error:', error.message);
  }
  app.quit();
});
