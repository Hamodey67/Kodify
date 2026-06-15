import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { eq } from 'drizzle-orm';
import { backupDatabaseTo, db, getDatabasePath } from './db';
import * as schema from './schema';

const AUTO_BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000;
const MAX_BACKUP_FILES = 30;

export type BackupKind = 'manual' | 'auto' | 'migration';

export interface BackupFileInfo {
  fileName: string;
  fullPath: string;
  kind: BackupKind;
  sizeBytes: number;
  createdAt: string;
}

export interface BackupStatus {
  backupDir: string;
  databasePath: string;
  lastAutoBackupAt: string | null;
  lastManualBackupAt: string | null;
  totalBackups: number;
  recentBackups: BackupFileInfo[];
  autoBackupEnabled: boolean;
  autoBackupIntervalHours: number;
}

function getBackupDirectory(): string {
  return path.join(path.dirname(getDatabasePath()), 'backups');
}

function formatTimestamp(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + '_' + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join('-');
}

function detectBackupKind(fileName: string): BackupKind {
  if (fileName.includes('-manual-')) return 'manual';
  if (fileName.includes('-auto-')) return 'auto';
  return 'migration';
}

async function upsertSetting(key: string, value: string) {
  await db
    .insert(schema.settings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: { value },
    });
}

async function getSetting(key: string): Promise<string | null> {
  const rows = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, key))
    .limit(1);
  return rows[0]?.value ?? null;
}

function listBackupFiles(): BackupFileInfo[] {
  const backupDir = getBackupDirectory();
  if (!fs.existsSync(backupDir)) return [];

  return fs
    .readdirSync(backupDir)
    .filter((name) => name.endsWith('.db'))
    .map((fileName) => {
      const fullPath = path.join(backupDir, fileName);
      const stats = fs.statSync(fullPath);
      return {
        fileName,
        fullPath,
        kind: detectBackupKind(fileName),
        sizeBytes: stats.size,
        createdAt: stats.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function pruneOldBackups(files: BackupFileInfo[]) {
  if (files.length <= MAX_BACKUP_FILES) return;

  const removable = files.slice(MAX_BACKUP_FILES);
  for (const file of removable) {
    try {
      fs.unlinkSync(file.fullPath);
      console.log(`Removed old database backup: ${file.fileName}`);
    } catch (error) {
      console.error(`Failed to remove old backup ${file.fileName}:`, error);
    }
  }
}

export async function createDatabaseBackup(kind: BackupKind): Promise<BackupFileInfo | null> {
  const dbPath = getDatabasePath();
  if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0) {
    console.log('Database file missing or empty. Skipping backup.');
    return null;
  }

  const backupDir = getBackupDirectory();
  fs.mkdirSync(backupDir, { recursive: true });

  let fileName = '';
  if (kind === 'migration') {
    const safeVersion = app.getVersion().replace(/[^a-zA-Z0-9._-]/g, '_');
    fileName = `kodify-system-before-v${safeVersion}.db`;
    const migrationPath = path.join(backupDir, fileName);
    if (fs.existsSync(migrationPath)) {
      console.log(`Pre-migration backup already exists: ${migrationPath}`);
      const stats = fs.statSync(migrationPath);
      return {
        fileName,
        fullPath: migrationPath,
        kind,
        sizeBytes: stats.size,
        createdAt: stats.mtime.toISOString(),
      };
    }
  } else {
    fileName = `kodify-system-${kind}-${formatTimestamp()}.db`;
  }

  const fullPath = path.join(backupDir, fileName);
  await backupDatabaseTo(fullPath);
  const stats = fs.statSync(fullPath);

  const now = new Date().toISOString();
  if (kind === 'auto') {
    await upsertSetting('last_auto_backup_at', now);
  } else if (kind === 'manual') {
    await upsertSetting('last_manual_backup_at', now);
  }

  const files = listBackupFiles();
  pruneOldBackups(files);

  console.log(`Created ${kind} database backup: ${fullPath}`);
  return {
    fileName,
    fullPath,
    kind,
    sizeBytes: stats.size,
    createdAt: stats.mtime.toISOString(),
  };
}

export async function runScheduledAutoBackup(): Promise<BackupFileInfo | null> {
  const lastAutoBackupAt = await getSetting('last_auto_backup_at');
  if (lastAutoBackupAt) {
    const elapsed = Date.now() - new Date(lastAutoBackupAt).getTime();
    if (elapsed < AUTO_BACKUP_INTERVAL_MS) {
      console.log('Automatic database backup not due yet.');
      return null;
    }
  }

  return createDatabaseBackup('auto');
}

export async function getBackupStatus(): Promise<BackupStatus> {
  const files = listBackupFiles();
  const lastAutoBackupAt = await getSetting('last_auto_backup_at');
  const lastManualBackupAt = await getSetting('last_manual_backup_at');

  return {
    backupDir: getBackupDirectory(),
    databasePath: getDatabasePath(),
    lastAutoBackupAt,
    lastManualBackupAt,
    totalBackups: files.length,
    recentBackups: files.slice(0, 8),
    autoBackupEnabled: true,
    autoBackupIntervalHours: AUTO_BACKUP_INTERVAL_MS / (60 * 60 * 1000),
  };
}

export function getBackupDirectoryPath(): string {
  return getBackupDirectory();
}
