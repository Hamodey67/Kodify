const Database = require('better-sqlite3');
const dbPath = process.env.APPDATA + '/kodify-system/kodify-system.db';
const db = new Database(dbPath);

try {
  const result = db.prepare('INSERT INTO products (barcode, sku, name_ar, name_en, name_ku, category, price, cost, stock, min_stock, tax_rate, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    '4335619166011', 'PRD-909885', 'تيست', 'CIEN SUN', '', 'General', 18000, 15000, 400, 50, 0, 1, new Date().toISOString(), new Date().toISOString()
  );
  console.log('Insert success:', result);
} catch(e) {
  console.error('Insert error:', e.message);
}
