const { spawn } = require('child_process');
const db = require('better-sqlite3')('kodify-system.db');
const row = db.prepare('SELECT value FROM settings WHERE key="mobile_tunnel_token"').get();
const token = row ? row.value : '';

console.log('Testing token length:', token.length);

const cp = spawn('c:\\Users\\user\\Desktop\\sys-kodify\\cloudflared.exe', ['tunnel', 'run', '--token', token]);
cp.stdout.on('data', d => console.log('STDOUT:', String(d)));
cp.stderr.on('data', d => console.log('STDERR:', String(d)));
cp.on('error', err => console.error('SPAWN ERROR:', err));
cp.on('exit', code => console.log('EXIT:', code));
