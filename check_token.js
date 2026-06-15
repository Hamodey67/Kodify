const db = require('better-sqlite3')('kodify-system.db');
const row = db.prepare('SELECT value FROM settings WHERE key="mobile_tunnel_token"').get();
console.log('--- TOKEN START ---');
console.log(row ? row.value : 'NO TOKEN FOUND');
console.log('--- TOKEN END ---');
