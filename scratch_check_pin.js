const Database = require('better-sqlite3');
const db = new Database('./kodify-system.db', { readonly: true });
const rows = db.prepare("SELECT key, value FROM settings WHERE key IN ('mobile_manager_pin', 'admin_override_pin', 'admin_pin')").all();
console.log('PIN settings:', JSON.stringify(rows, null, 2));
const allSettings = db.prepare("SELECT key, value FROM settings").all();
console.log('\nAll settings keys:', allSettings.map(r => r.key));
db.close();
