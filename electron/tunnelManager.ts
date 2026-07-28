import { BrowserWindow, app } from 'electron';
import { eq } from 'drizzle-orm';
import { db } from './db';
import * as schema from './schema';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { spawn, ChildProcess } from 'child_process';

type TunnelMode = 'quick' | 'token' | 'local';

interface TunnelStatus {
  running: boolean;
  mode: TunnelMode;
  url: string;
  error: string;
}

let tunnelProcess: ChildProcess | null = null;
let tunnelRunning = false;
let tunnelUrl = '';
let tunnelError = '';
let tunnelMode: TunnelMode = 'quick';

function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  let firstExternalIp = '';

  for (const name of Object.keys(interfaces)) {
    const ifaces = interfaces[name];
    if (ifaces) {
      for (const iface of ifaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          if (!firstExternalIp) firstExternalIp = iface.address;
          
          if (
            iface.address.startsWith('192.168.') ||
            iface.address.startsWith('10.') ||
            iface.address.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
          ) {
            return iface.address;
          }
        }
      }
    }
  }
  return firstExternalIp || '127.0.0.1';
}

async function getSetting(key: string, fallback = '') {
  try {
    const rows = await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
    return rows[0]?.value || fallback;
  } catch (err) {
    return fallback;
  }
}

async function saveSetting(key: string, value: string) {
  try {
    await db
      .insert(schema.settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: schema.settings.key, set: { value } });
  } catch (err) {
    console.error('Failed to save setting:', key, err);
  }
}

function notifyStatusChanged() {
  const status = getCloudflareTunnelStatus();
  for (const win of BrowserWindow.getAllWindows()) {
    try {
      win.webContents.send('manager:tunnel-status-changed', status);
    } catch (e) {
      // Ignore if window destroyed
    }
  }
}

function findCloudflaredBinary(customPathSetting?: string): string {
  if (customPathSetting && fs.existsSync(customPathSetting)) {
    return customPathSetting;
  }

  const appPath = app.getAppPath();
  const rootBin = path.join(appPath, 'cloudflared.exe');
  if (fs.existsSync(rootBin)) return rootBin;

  const cwdBin = path.join(process.cwd(), 'cloudflared.exe');
  if (fs.existsSync(cwdBin)) return cwdBin;

  if (process.resourcesPath) {
    const resBin = path.join(process.resourcesPath, 'cloudflared.exe');
    if (fs.existsSync(resBin)) return resBin;
  }

  return 'cloudflared';
}

export function getCloudflareTunnelStatus(): TunnelStatus {
  return {
    running: tunnelRunning,
    mode: tunnelMode,
    url: tunnelUrl,
    error: tunnelError,
  };
}

export function stopCloudflareTunnel() {
  if (tunnelProcess) {
    try {
      tunnelProcess.kill('SIGTERM');
      tunnelProcess.kill('SIGKILL');
    } catch (e) {
      // Process already killed
    }
    tunnelProcess = null;
  }

  tunnelRunning = false;
  tunnelUrl = '';
  tunnelError = '';
  notifyStatusChanged();
  return getCloudflareTunnelStatus();
}

export async function startCloudflareTunnel() {
  const enabled = await getSetting('mobile_tunnel_enabled', 'false');
  const port = Number(await getSetting('mobile_manager_port', '8787')) || 8787;
  const modeSetting = (await getSetting('mobile_tunnel_mode', 'quick')) as TunnelMode;
  const customBin = await getSetting('mobile_tunnel_cloudflared_path', '');
  const token = await getSetting('mobile_tunnel_token', '');
  const lastUrl = await getSetting('mobile_tunnel_last_url', '');

  tunnelMode = modeSetting;
  tunnelError = '';

  if (enabled !== 'true') {
    return stopCloudflareTunnel();
  }

  if (tunnelRunning && tunnelProcess && !tunnelProcess.killed) {
    return getCloudflareTunnelStatus();
  }

  stopCloudflareTunnel();

  const binaryPath = findCloudflaredBinary(customBin);
  const args: string[] = [];

  if (modeSetting === 'token' && token) {
    args.push('tunnel', 'run', '--token', token);
  } else {
    args.push('tunnel', '--url', `http://127.0.0.1:${port}`);
  }

  try {
    tunnelProcess = spawn(binaryPath, args, {
      windowsHide: true,
    });
  } catch (err: any) {
    console.error('Failed to spawn cloudflared binary:', err);
    tunnelRunning = false;
    tunnelError = `Failed to start tunnel process: ${err.message || err}`;
    notifyStatusChanged();
    return getCloudflareTunnelStatus();
  }

  tunnelRunning = true;
  tunnelUrl = lastUrl || `http://${getLocalIp()}:${port}`;
  notifyStatusChanged();

  const handleOutput = (data: Buffer | string) => {
    const text = String(data);
    const match = text.match(/(https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/i);
    if (match && match[1]) {
      tunnelUrl = match[1];
      saveSetting('mobile_tunnel_last_url', tunnelUrl);
      notifyStatusChanged();
    }
  };

  if (tunnelProcess.stdout) {
    tunnelProcess.stdout.on('data', handleOutput);
  }
  if (tunnelProcess.stderr) {
    tunnelProcess.stderr.on('data', handleOutput);
  }

  tunnelProcess.on('error', (err) => {
    console.error('cloudflared process error:', err);
    tunnelError = err.message;
    tunnelRunning = false;
    notifyStatusChanged();
  });

  tunnelProcess.on('exit', (code, signal) => {
    console.log(`cloudflared process exited with code ${code}, signal ${signal}`);
    if (tunnelRunning) {
      tunnelRunning = false;
      notifyStatusChanged();
    }
    tunnelProcess = null;
  });

  return getCloudflareTunnelStatus();
}

app.on('before-quit', () => {
  stopCloudflareTunnel();
});

