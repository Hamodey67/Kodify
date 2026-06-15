const Database = require('better-sqlite3');
const db = new Database('kodify-system.db');

try {
  // Check foreign keys status
  const fkStatus = db.prepare('PRAGMA foreign_keys').get();
  console.log('Foreign keys status:', fkStatus);

  // Get total products count
  const allProductsCount = db.prepare('SELECT count(*) as count FROM products').get().count;
  const activeProductsCount = db.prepare('SELECT count(*) as count FROM products WHERE is_active = 1').get().count;
  const inactiveProductsCount = db.prepare('SELECT count(*) as count FROM products WHERE is_active = 0').get().count;
  
  console.log('Total products:', allProductsCount);
  console.log('Active products (is_active = 1):', activeProductsCount);
  console.log('Inactive products (is_active = 0):', inactiveProductsCount);

  // Check a few rows
  const sample = db.prepare('SELECT id, barcode, sku, is_active FROM products LIMIT 5').all();
  console.log('Sample products:', sample);
} catch (e) {
  console.error('Error:', e);
} finally {
  db.close();
}
