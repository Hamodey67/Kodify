const Database = require('better-sqlite3');
const dbPath = process.env.APPDATA + '/kodify-system/kodify-system.db';
const db = new Database(dbPath);

console.log('Barcode:', db.prepare('SELECT * FROM products WHERE barcode = ?').get('4335619166011'));
console.log('SKU:', db.prepare('SELECT * FROM products WHERE sku = ?').get('PRD-909885'));

// Also, let's see how many products have the same sku format
const skus = db.prepare('SELECT count(*) as count FROM products WHERE sku LIKE "PRD-%"').get();
console.log('Products with PRD- SKU:', skus.count);
