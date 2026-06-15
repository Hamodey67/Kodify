const { app } = require('electron');
const Database = require('better-sqlite3');
app.whenReady().then(() => {
  const db = new Database('./kodify-system.db');
  try {
    const prodByBarcode = db.prepare('SELECT * FROM products WHERE barcode = ?').get('4335619166011');
    const prodBySku = db.prepare('SELECT * FROM products WHERE sku = ?').get('PRD-909885');
    console.log('Product by barcode:', prodByBarcode);
    console.log('Product by sku:', prodBySku);

    // Let's also insert a test product to see the exact error message
    try {
      db.prepare('INSERT INTO products (barcode, sku, name_ar, name_en, name_ku, category, price, cost, stock, min_stock, tax_rate, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run('4335619166011', 'PRD-909885', 'تيست', 'CIEN SUN', '', 'General', 18000, 15000, 400, 50, 0, 1, new Date().toISOString(), new Date().toISOString());
      console.log('Inserted test product successfully');
    } catch(e) {
      console.error('Insert error:', e.message);
    }
  } catch (e) {
    console.error('DB error:', e.message);
  }
  app.quit();
});
