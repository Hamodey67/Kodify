const Database = require('better-sqlite3');
const db = new Database('kodify-system.db');
db.prepare("INSERT INTO settings (key, value) VALUES ('mobile_tunnel_cloudflared_path', 'C:\\Users\\user\\Desktop\\sys-kodify\\cloudflared.exe') ON CONFLICT(key) DO UPDATE SET value=excluded.value").run();
console.log('Database updated successfully.');
