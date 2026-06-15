import { BrowserWindow, app } from 'electron';
import { eq } from 'drizzle-orm';
import { db } from './db';
import * as schema from './schema';
import os from 'os';

type TunnelMode = 'local';

interface TunnelStatus {
  running: boolean;
  mode: TunnelMode;
  url: string;
  error: string;
}

let tunnelRunning = false;
let tunnelUrl = '';
let tunnelError = '';

function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaces = interfaces[name];
    if (ifaces) {
      for (const iface of ifaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return '127.0.0.1';
}

async function getSetting(key: string, fallback = '') {
  const rows = await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
  return rows[0]?.value || fallback;
}

function notifyStatusChanged() {
  const status = getCloudflareTunnelStatus();
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('manager:tunnel-status-changed', status);
  }
}

export function getCloudflareTunnelStatus(): TunnelStatus {
  return {
    running: tunnelRunning,
    mode: 'local',
    url: tunnelUrl,
    error: tunnelError,
  };
}

export async function startCloudflareTunnel() {
  const enabled = await getSetting('mobile_tunnel_enabled', 'false');
  const port = Number(await getSetting('mobile_manager_port', '8787')) || 8787;

  tunnelError = '';

  if (enabled !== 'true') {
    tunnelRunning = false;
    tunnelUrl = '';
    notifyStatusChanged();
    return getCloudflareTunnelStatus();
  }

  tunnelRunning = true;
  tunnelUrl = `https://${getLocalIp()}:${port}`;
  notifyStatusChanged();

  return getCloudflareTunnelStatus();
}

export function stopCloudflareTunnel() {
  tunnelRunning = false;
  tunnelUrl = '';
  tunnelError = '';
  notifyStatusChanged();
  return getCloudflareTunnelStatus();
}
