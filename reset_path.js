const db = require('better-sqlite3')('kodify-system.db');
db.prepare("UPDATE settings SET value = 'cloudflared' WHERE key = 'mobile_tunnel_cloudflared_path'").run();
console.log('Path reset to cloudflared');
