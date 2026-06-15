import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { eq, and, desc, asc, sql, like, or } from 'drizzle-orm';
import { db, initDatabase } from './db';
import { createDatabaseBackup, getBackupDirectoryPath, getBackupStatus, runScheduledAutoBackup } from './backup';
import * as schema from './schema';
import bcrypt from 'bcryptjs';
import { printReceipt, triggerCashDrawer, printShiftReport, printDailyReport, generateReceiptHtml, printProductReport } from './printers';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import { autoUpdater } from 'electron-updater';
import { startMobileManagerServer, stopMobileManagerServer } from './mobileServer';
import { getCloudflareTunnelStatus, startCloudflareTunnel, stopCloudflareTunnel } from './tunnelManager';

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
    mainWindow?.webContents.send('auto-updater:status', 'checking');
  });
  autoUpdater.on('update-available', (info) => {
    console.log('Update available.', info);
    mainWindow?.webContents.send('auto-updater:status', 'available', info);
  });
  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.', info);
    mainWindow?.webContents.send('auto-updater:status', 'not-available', info);
  });
  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater. ' + err);
    mainWindow?.webContents.send('auto-updater:status', 'error', err?.message || String(err));
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log(log_message);
    mainWindow?.webContents.send('auto-updater:status', 'downloading', {
      percent: progressObj.percent,
      bytesPerSecond: progressObj.bytesPerSecond,
      transferred: progressObj.transferred,
      total: progressObj.total
    });
  });
  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded. It will be installed on restart.');
    mainWindow?.webContents.send('auto-updater:status', 'downloaded', info);
  });
}

function getSplashHTML(logoSrc: string): string {
  return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Loading Kodify System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* Premium Styling */
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at center, #0b0f19 0%, #03050a 100%);
      color: #f1f5f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
    }
    
    /* Background Glowing Orb */
    .glow-orb {
      position: absolute;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(6, 182, 212, 0.05) 60%, transparent 100%);
      filter: blur(50px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 1;
    }
    
    /* Container & Layout */
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2;
      text-align: center;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    }
    
    /* Premium Logo Animation */
    .logo-container {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo {
      width: 90px;
      height: 90px;
      object-fit: contain;
      animation: float 4s ease-in-out infinite, pulseGlow 2.5s ease-in-out infinite alternate;
    }
    
    /* Logo Float & Glow Keyframes */
    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-6px) scale(1.03); }
    }
    
    @keyframes pulseGlow {
      0% { filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.2)) drop-shadow(0 0 2px rgba(6, 182, 212, 0.1)); }
      100% { filter: drop-shadow(0 0 24px rgba(99, 102, 241, 0.5)) drop-shadow(0 0 8px rgba(6, 182, 212, 0.3)); }
    }
    
    /* Branding */
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 3px;
      margin-bottom: 2px;
      background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Outfit', sans-serif;
    }
    
    .brand-subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 24px;
      text-transform: uppercase;
      font-family: 'Outfit', sans-serif;
    }
    
    /* Loading Line (Premium Sleek Progress Bar) */
    .loader-container {
      width: 260px;
      height: 4px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      margin-bottom: 20px;
      border: 1px solid rgba(255, 255, 255, 0.02);
    }
    
    .loader-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%);
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
      transition: width 0.4s cubic-bezier(0.1, 0.8, 0.25, 1);
    }
    
    /* Dynamic shimmer on the progress bar */
    .loader-bar::after {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
      animation: shimmer 1.8s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    /* Status Text */
    .status-text {
      font-family: 'Outfit', sans-serif;
      font-size: 12.5px;
      font-weight: 500;
      color: #cbd5e1;
      height: 20px;
      transition: opacity 0.2s ease;
    }
  </style>
</head>
<body>
  <div class="glow-orb"></div>
  <div class="container">
    <div class="logo-container">
      ${logoSrc ? `<img class="logo" src="${logoSrc}" alt="Logo">` : '<div class="logo" style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #06b6d4); box-shadow: 0 0 20px rgba(99,102,241,0.5)"></div>'}
    </div>
    <div class="brand-title">KODIFY</div>
    <div class="brand-subtitle">Retail Management System</div>
    
    <div class="loader-container">
      <div id="bar" class="loader-bar"></div>
    </div>
    
    <div id="status" class="status-text">Initializing system...</div>
  </div>
  
  <script>
    function updateStatus(statusText, progress) {
      const el = document.getElementById('status');
      const barEl = document.getElementById('bar');
      
      if (barEl) {
        barEl.style.width = progress + '%';
      }
      
      if (el) {
        el.style.opacity = 0;
        
        setTimeout(() => {
          el.innerText = statusText;
          el.style.opacity = 1;
        }, 150);
      }
    }
  </script>
</body>
</html>
  `;
}

function getLogoBase64(): string {
  try {
    const isDev = !app.isPackaged;
    const logoPath = isDev
      ? path.join(__dirname, '../public/5.png')
      : path.join(__dirname, '../dist/5.png');
    
    if (fs.existsSync(logoPath)) {
      return `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
    }
  } catch (error) {
    console.error('Failed to load logo for splash screen:', error);
  }
  return '';
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const logoBase64 = getLogoBase64();
  const htmlContent = getSplashHTML(logoBase64);

  try {
    const tempSplashPath = path.join(app.getPath('userData'), 'splash.html');
    fs.writeFileSync(tempSplashPath, htmlContent, 'utf8');
    splashWindow.loadFile(tempSplashPath);
  } catch (error) {
    console.error('Failed to write/load splash HTML file, falling back to data URL:', error);
    splashWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));
  }
}

function updateSplashStatus(statusText: string, progress: number) {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.executeJavaScript(
      `if (typeof updateStatus === 'function') updateStatus(${JSON.stringify(statusText)}, ${progress});`
    ).catch(err => console.error('Failed to update splash screen status:', err));
  }
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    frame: false, // Custom header bar in React for sleek frameless appearance
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return new Promise<void>((resolve) => {
    mainWindow?.once('ready-to-show', () => {
      resolve();
    });
  });
}

function fadeSplashToMain() {
  if (!splashWindow || splashWindow.isDestroyed() || !mainWindow) {
    mainWindow?.maximize();
    mainWindow?.show();
    splashWindow?.close();
    return;
  }

  mainWindow.maximize();

  let opacity = 1.0;
  const fadeInterval = setInterval(() => {
    if (!splashWindow || splashWindow.isDestroyed()) {
      clearInterval(fadeInterval);
      return;
    }

    opacity -= 0.08;
    if (opacity <= 0) {
      clearInterval(fadeInterval);
      
      mainWindow?.show();
      mainWindow?.focus();
      
      splashWindow?.close();
      splashWindow = null;
    } else {
      splashWindow.setOpacity(opacity);
    }
  }, 25);
}

app.whenReady().then(async () => {
  createSplashWindow();

  const startTime = Date.now();

  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    updateSplashStatus('Initializing database...', 25);

    await initDatabase();
    await runScheduledAutoBackup();
    await startMobileManagerServer();
    await startCloudflareTunnel();

    updateSplashStatus('Verifying license...', 60);
    await new Promise(resolve => setTimeout(resolve, 300));

    updateSplashStatus('Loading interface...', 85);
    await createMainWindow();

    updateSplashStatus('Ready!', 100);

    const elapsed = Date.now() - startTime;
    const minSplashDuration = 2500;
    if (elapsed < minSplashDuration) {
      await new Promise(resolve => setTimeout(resolve, minSplashDuration - elapsed));
    }
  } catch (error) {
    console.error('Error during startup initialization:', error);
  }

  fadeSplashToMain();

  if (app.isPackaged) {
    setupAutoUpdater();
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow().then(() => {
        mainWindow?.maximize();
        mainWindow?.show();
      });
    }
  });
});

app.on('window-all-closed', () => {
  stopCloudflareTunnel();
  stopMobileManagerServer();
  if (process.platform !== 'darwin') app.quit();
});

// ==========================================
// WINDOW CONTROLS IPC
// ==========================================
ipcMain.on('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window:close', () => {
  mainWindow?.close();
});

// Auto-Updater IPC listeners
ipcMain.on('auto-updater:restart', () => {
  autoUpdater.quitAndInstall();
});
ipcMain.on('auto-updater:check', () => {
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

let currentSessionUser: { id: number; username: string; name: string; role: string } | null = null;

// --- Authentication ---
ipcMain.handle('db:login', async (_, username, password) => {
  try {
    const usersList = await db
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.username, username), eq(schema.users.isActive, true)))
      .limit(1);

    if (usersList.length === 0) return null;

    const user = usersList[0];
    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) return null;

    // Return user without password hash
    const { passwordHash: _, ...safeUser } = user;
    currentSessionUser = safeUser;
    return safeUser;
  } catch (error) {
    console.error('IPC db:login error:', error);
    return null;
  }
});

ipcMain.handle('db:logout', () => {
  currentSessionUser = null;
  return true;
});

ipcMain.handle('db:verify-admin-pin', async (_, pin: string) => {
  try {
    if (!pin || !/^\d{4}$/.test(pin)) return false;

    const configuredPin = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, 'admin_override_pin'))
      .limit(1);

    if (configuredPin.length > 0) {
      return configuredPin[0].value === pin;
    }

    const adminUsers = await db
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.role, 'admin'), eq(schema.users.isActive, true)));

    return adminUsers.some((adminUser) => bcrypt.compareSync(pin, adminUser.passwordHash));
  } catch (error) {
    console.error('IPC db:verify-admin-pin error:', error);
    return false;
  }
});

ipcMain.handle('db:log-price-override', async (_, payload) => {
  try {
    const result = await db
      .insert(schema.priceOverrides)
      .values({
        itemId: payload.itemId,
        itemName: payload.itemName,
        originalPrice: payload.originalPrice,
        newPrice: payload.newPrice,
        reason: payload.reason || null,
        authorizedBy: payload.authorizedBy,
        timestamp: payload.timestamp || new Date().toISOString(),
      })
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('IPC db:log-price-override error:', error);
    return null;
  }
});

ipcMain.handle('db:create-user', async (_, userData) => {
  try {
    const passwordHash = bcrypt.hashSync(userData.password, 10);
    const result = await db.insert(schema.users).values({
      username: userData.username,
      passwordHash,
      name: userData.name,
      role: userData.role, // 'admin' | 'cashier'
      isActive: true,
      createdAt: new Date().toISOString(),
    }).returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:create-user error:', error);
    return null;
  }
});

ipcMain.handle('db:get-users', async () => {
  try {
    const allUsers = await db.select().from(schema.users);
    return allUsers.map(({ passwordHash: _, ...user }) => user);
  } catch (error) {
    console.error('IPC db:get-users error:', error);
    return [];
  }
});

// --- Products CRUD ---
ipcMain.handle('db:get-products', async () => {
  try {
    return await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.isActive, true))
      .orderBy(desc(schema.products.id));
  } catch (error) {
    console.error('IPC db:get-products error:', error);
    return [];
  }
});

ipcMain.handle('db:add-product', async (_, product) => {
  try {
    // Validate duplicate barcode in active products
    if (product.barcode) {
      const existingBarcode = await db
        .select()
        .from(schema.products)
        .where(
          and(
            eq(schema.products.barcode, product.barcode),
            eq(schema.products.isActive, true)
          )
        )
        .limit(1);
      if (existingBarcode.length > 0) {
        console.warn('Attempt to add product with duplicate active barcode:', product.barcode);
        return null;
      }
    }

    // Validate duplicate SKU in active products
    if (product.sku) {
      const existingSku = await db
        .select()
        .from(schema.products)
        .where(
          and(
            eq(schema.products.sku, product.sku),
            eq(schema.products.isActive, true)
          )
        )
        .limit(1);
      if (existingSku.length > 0) {
        console.warn('Attempt to add product with duplicate active SKU:', product.sku);
        return null;
      }
    }

    const now = new Date().toISOString();
    const result = await db.insert(schema.products).values({
      ...product,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:add-product error:', error);
    return null;
  }
});

ipcMain.handle('db:update-product', async (_, id, product) => {
  try {
    // Validate duplicate barcode in active products
    if (product.barcode) {
      const existingBarcode = await db
        .select()
        .from(schema.products)
        .where(
          and(
            eq(schema.products.barcode, product.barcode),
            eq(schema.products.isActive, true),
            sql`${schema.products.id} != ${id}`
          )
        )
        .limit(1);
      if (existingBarcode.length > 0) {
        console.warn('Attempt to update product to duplicate active barcode:', product.barcode);
        return null;
      }
    }

    // Validate duplicate SKU in active products
    if (product.sku) {
      const existingSku = await db
        .select()
        .from(schema.products)
        .where(
          and(
            eq(schema.products.sku, product.sku),
            eq(schema.products.isActive, true),
            sql`${schema.products.id} != ${id}`
          )
        )
        .limit(1);
      if (existingSku.length > 0) {
        console.warn('Attempt to update product to duplicate active SKU:', product.sku);
        return null;
      }
    }

    const result = await db
      .update(schema.products)
      .set({
        ...product,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.products.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:update-product error:', error);
    return null;
  }
});

ipcMain.handle('db:delete-product', async (_, id) => {
  try {
    const result = await db
      .update(schema.products)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.products.id, id))
      .returning();
    return result.length > 0;
  } catch (error) {
    console.error('IPC db:delete-product error:', error);
    return false;
  }
});

ipcMain.handle('get-product-stats', async (_, productId) => {
  try {
    const stats = await db
      .select({
        totalQuantity: sql<number>`sum(${schema.saleItems.quantity})`,
        totalRevenue: sql<number>`sum(${schema.saleItems.quantity} * ${schema.saleItems.unitPrice})`,
        totalCost: sql<number>`sum(${schema.saleItems.quantity} * ${schema.saleItems.costPrice})`,
      })
      .from(schema.saleItems)
      .innerJoin(schema.sales, eq(schema.saleItems.saleId, schema.sales.id))
      .where(
        and(
          eq(schema.saleItems.productId, productId),
          eq(schema.sales.status, 'completed')
        )
      );

    const result = stats[0] || {};
    const totalUnitsSold = Number(result.totalQuantity || 0);
    const totalRevenue = Number(result.totalRevenue || 0);
    const totalCost = Number(result.totalCost || 0);
    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalUnitsSold,
      totalRevenue,
      totalCost,
      netProfit,
      profitMargin,
    };
  } catch (error) {
    console.error('IPC get-product-stats error:', error);
    return null;
  }
});

ipcMain.handle('db:search-products', async (_, query) => {
  try {
    if (!query) return [];
    return await db
      .select()
      .from(schema.products)
      .where(
        and(
          eq(schema.products.isActive, true),
          or(
            like(schema.products.barcode, `%${query}%`),
            like(schema.products.sku, `%${query}%`),
            like(schema.products.nameAr, `%${query}%`),
            like(schema.products.nameEn, `%${query}%`),
            like(schema.products.nameKu, `%${query}%`)
          )
        )
      )
      .limit(20);
  } catch (error) {
    console.error('IPC db:search-products error:', error);
    return [];
  }
});

ipcMain.handle('db:low-stock-alerts', async () => {
  try {
    return await db
      .select()
      .from(schema.products)
      .where(
        and(
          eq(schema.products.isActive, true),
          sql`${schema.products.stock} <= ${schema.products.minStock}`
        )
      );
  } catch (error) {
    console.error('IPC db:low-stock-alerts error:', error);
    return [];
  }
});

// --- Customers ---
ipcMain.handle('db:get-customers', async () => {
  try {
    return await db.select().from(schema.customers).orderBy(desc(schema.customers.id));
  } catch (error) {
    console.error('IPC db:get-customers error:', error);
    return [];
  }
});

ipcMain.handle('db:add-customer', async (_, customer) => {
  try {
    const result = await db.insert(schema.customers).values({
      ...customer,
      points: 0,
      balance: customer.balance || 0,
      createdAt: new Date().toISOString(),
    }).returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:add-customer error:', error);
    return null;
  }
});

ipcMain.handle('db:update-customer', async (_, id, customer) => {
  try {
    const result = await db
      .update(schema.customers)
      .set(customer)
      .where(eq(schema.customers.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:update-customer error:', error);
    return null;
  }
});

ipcMain.handle('db:adjust-customer-balance', async (_, id, amount) => {
  try {
    const result = await db
      .update(schema.customers)
      .set({
        balance: sql`${schema.customers.balance} + ${amount}`,
      })
      .where(eq(schema.customers.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:adjust-customer-balance error:', error);
    return null;
  }
});

// --- Sales & Checkout Transaction ---
ipcMain.handle('db:create-sale', async (_, saleData) => {
  const {
    invoiceNumber,
    userId,
    customerId,
    totalAmount,
    taxAmount,
    discountAmount,
    paymentMethod,
    cashReceived,
    cashReturned,
    items, // Array of { productId, quantity, unitPrice, costPrice, taxAmount, discountAmount, totalPrice }
    customerPointsEarned,
    customerBalanceChange, // negative if they paid on account (credit debt)
  } = saleData;

  const finalUserId = currentSessionUser?.role === 'cashier' ? currentSessionUser.id : userId;

  try {
    // Run all inside a SQLite Transaction
    return db.transaction((tx) => {
      // 1. Create Sale Record
      const saleResult = tx.insert(schema.sales).values({
        invoiceNumber,
        userId: finalUserId,
        customerId,
        totalAmount,
        taxAmount,
        discountAmount,
        paymentMethod,
        cashReceived,
        cashReturned,
        status: 'completed',
        createdAt: new Date().toISOString(),
      }).returning().get();

      const newSale = saleResult;

      // 2. Insert items and update stock levels
      for (const item of items) {
        tx.insert(schema.saleItems).values({
          saleId: newSale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          costPrice: item.costPrice,
          taxAmount: item.taxAmount,
          discountAmount: item.discountAmount,
          totalPrice: item.totalPrice,
        }).run();

        // Decrement Product Stock
        tx
          .update(schema.products)
          .set({
            stock: sql`${schema.products.stock} - ${item.quantity}`,
          })
          .where(eq(schema.products.id, item.productId))
          .run();
      }

      // 3. Update Customer Loyalty & Balance (if customer selected)
      if (customerId) {
        tx
          .update(schema.customers)
          .set({
            points: sql`${schema.customers.points} + ${customerPointsEarned || 0}`,
            balance: sql`${schema.customers.balance} + ${customerBalanceChange || 0}`,
          })
          .where(eq(schema.customers.id, customerId))
          .run();
      }

      // 4. Update Shift Cash Expected drawer total if cash payment
      if (paymentMethod === 'cash' || paymentMethod === 'split') {
        const activeShifts = tx
          .select()
          .from(schema.shifts)
          .where(and(eq(schema.shifts.userId, finalUserId), eq(schema.shifts.status, 'open')))
          .limit(1)
          .all();

        if (activeShifts.length > 0) {
          const cashPortion = paymentMethod === 'cash' ? totalAmount : cashReceived - cashReturned;
          tx
            .update(schema.shifts)
            .set({
              expectedCash: sql`${schema.shifts.expectedCash} + ${cashPortion}`,
            })
            .where(eq(schema.shifts.id, activeShifts[0].id))
            .run();
        }
      }

      return { success: true, saleId: newSale.id, invoiceNumber: newSale.invoiceNumber };
    });
  } catch (error: any) {
    console.error('IPC db:create-sale transaction error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:get-sales', async (_, filters) => {
  try {
    let query = db
      .select({
        id: schema.sales.id,
        invoiceNumber: schema.sales.invoiceNumber,
        userId: schema.sales.userId,
        cashierName: schema.users.name,
        customerId: schema.sales.customerId,
        customerName: schema.customers.name,
        totalAmount: schema.sales.totalAmount,
        taxAmount: schema.sales.taxAmount,
        discountAmount: schema.sales.discountAmount,
        paymentMethod: schema.sales.paymentMethod,
        cashReceived: schema.sales.cashReceived,
        cashReturned: schema.sales.cashReturned,
        status: schema.sales.status,
        createdAt: schema.sales.createdAt,
      })
      .from(schema.sales)
      .leftJoin(schema.users, eq(schema.sales.userId, schema.users.id))
      .leftJoin(schema.customers, eq(schema.sales.customerId, schema.customers.id));

    const isCashier = currentSessionUser?.role === 'cashier';
    const sessionUserId = currentSessionUser?.id;
    const conditions = [];

    if (isCashier && sessionUserId) {
      conditions.push(eq(schema.sales.userId, sessionUserId));
    }

    if (filters?.invoiceNumber) {
      conditions.push(eq(schema.sales.invoiceNumber, filters.invoiceNumber));
      return await query.where(and(...conditions)).orderBy(desc(schema.sales.id));
    }

    if (filters?.startDate && filters?.endDate) {
      conditions.push(
        and(
          sql`${schema.sales.createdAt} >= ${filters.startDate}`,
          sql`${schema.sales.createdAt} <= ${filters.endDate}`
        )
      );
      return await query.where(and(...conditions)).orderBy(desc(schema.sales.id));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(schema.sales.id)).limit(100);
    }

    return await query.orderBy(desc(schema.sales.id)).limit(100);
  } catch (error) {
    console.error('IPC db:get-sales error:', error);
    return [];
  }
});

ipcMain.handle('db:get-sale-items', async (_, saleId) => {
  try {
    return await db
      .select({
        id: schema.saleItems.id,
        saleId: schema.saleItems.saleId,
        productId: schema.saleItems.productId,
        nameAr: sql<string>`COALESCE(${schema.products.nameAr}, 'منتج محذوف')`,
        nameEn: sql<string>`COALESCE(${schema.products.nameEn}, 'Deleted Product')`,
        quantity: schema.saleItems.quantity,
        unitPrice: schema.saleItems.unitPrice,
        costPrice: schema.saleItems.costPrice,
        taxAmount: schema.saleItems.taxAmount,
        discountAmount: schema.saleItems.discountAmount,
        totalPrice: schema.saleItems.totalPrice,
      })
      .from(schema.saleItems)
      .leftJoin(schema.products, eq(schema.saleItems.productId, schema.products.id))
      .where(eq(schema.saleItems.saleId, saleId));
  } catch (error) {
    console.error('IPC db:get-sale-items error:', error);
    return [];
  }
});

ipcMain.handle('db:refund-sale', async (_, saleId) => {
  try {
    return db.transaction((tx) => {
      // 1. Fetch sale data
      const salesList = tx
        .select()
        .from(schema.sales)
        .where(eq(schema.sales.id, saleId))
        .limit(1)
        .all();

      if (salesList.length === 0) throw new Error('Sale not found');
      const sale = salesList[0];
      if (sale.status === 'refunded') throw new Error('Sale is already refunded');

      if (currentSessionUser?.role === 'cashier' && sale.userId !== currentSessionUser.id) {
        throw new Error('Unauthorized to refund this sale');
      }

      // 2. Fetch sale items
      const items = tx
        .select()
        .from(schema.saleItems)
        .where(eq(schema.saleItems.saleId, saleId))
        .all();

      // 3. Mark sale as refunded
      tx
        .update(schema.sales)
        .set({ status: 'refunded' })
        .where(eq(schema.sales.id, saleId))
        .run();

      // 4. Return products to inventory stock
      for (const item of items) {
        tx
          .update(schema.products)
          .set({
            stock: sql`${schema.products.stock} + ${item.quantity}`,
          })
          .where(eq(schema.products.id, item.productId))
          .run();
      }

      // 5. Reverse Customer loyalty points / balances
      if (sale.customerId) {
        // approximate points: standard calculation (1 point per 10 SAR)
        const pointsToDeduct = Math.floor(sale.totalAmount / 10);

        // If customer bought on credit debt, reverse that debt deduction
        let balanceAdjustment = 0;
        if (sale.paymentMethod === 'split' && sale.cashReceived < sale.totalAmount) {
          balanceAdjustment = -(sale.totalAmount - sale.cashReceived);
        }

        tx
          .update(schema.customers)
          .set({
            points: sql`${schema.customers.points} - ${pointsToDeduct}`,
            balance: sql`${schema.customers.balance} - ${balanceAdjustment}`,
          })
          .where(eq(schema.customers.id, sale.customerId))
          .run();
      }

      // 6. Deduct from Shift Drawer Expected cash if payment was cash
      if (sale.paymentMethod === 'cash' || sale.paymentMethod === 'split') {
        const activeShifts = tx
          .select()
          .from(schema.shifts)
          .where(and(eq(schema.shifts.userId, sale.userId), eq(schema.shifts.status, 'open')))
          .limit(1)
          .all();

        if (activeShifts.length > 0) {
          const cashPortion = sale.paymentMethod === 'cash' ? sale.totalAmount : sale.cashReceived - sale.cashReturned;
          tx
            .update(schema.shifts)
            .set({
              expectedCash: sql`${schema.shifts.expectedCash} - ${cashPortion}`,
            })
            .where(eq(schema.shifts.id, activeShifts[0].id))
            .run();
        }
      }

      return { success: true };
    });
  } catch (error: any) {
    console.error('IPC db:refund-sale error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:sales-summary', async (_, startDate, endDate) => {
  try {
    const isCashier = currentSessionUser?.role === 'cashier';
    const sessionUserId = currentSessionUser?.id;

    // 1. Total revenue & count
    const summaryWhere = [
      eq(schema.sales.status, 'completed'),
      sql`${schema.sales.createdAt} >= ${startDate}`,
      sql`${schema.sales.createdAt} <= ${endDate}`
    ];
    if (isCashier && sessionUserId) {
      summaryWhere.push(eq(schema.sales.userId, sessionUserId));
    }

    const summary = await db
      .select({
        totalRevenue: sql<number>`SUM(${schema.sales.totalAmount})`,
        totalTax: sql<number>`SUM(${schema.sales.taxAmount})`,
        totalDiscount: sql<number>`SUM(${schema.sales.discountAmount})`,
        count: sql<number>`COUNT(${schema.sales.id})`,
      })
      .from(schema.sales)
      .where(and(...summaryWhere));

    // 2. Calculate profits (cost vs price of items sold)
    const profitWhere = [
      eq(schema.sales.status, 'completed'),
      sql`${schema.sales.createdAt} >= ${startDate}`,
      sql`${schema.sales.createdAt} <= ${endDate}`
    ];
    if (isCashier && sessionUserId) {
      profitWhere.push(eq(schema.sales.userId, sessionUserId));
    }

    const profitData = await db
      .select({
        totalProfit: sql<number>`SUM((${schema.saleItems.unitPrice} - ${schema.saleItems.costPrice}) * ${schema.saleItems.quantity})`,
      })
      .from(schema.saleItems)
      .innerJoin(schema.sales, eq(schema.saleItems.saleId, schema.sales.id))
      .where(and(...profitWhere));

    // 3. Sales by category
    const categoryWhere = [
      eq(schema.sales.status, 'completed'),
      sql`${schema.sales.createdAt} >= ${startDate}`,
      sql`${schema.sales.createdAt} <= ${endDate}`
    ];
    if (isCashier && sessionUserId) {
      categoryWhere.push(eq(schema.sales.userId, sessionUserId));
    }

    const categorySales = await db
      .select({
        category: schema.products.category,
        total: sql<number>`SUM(${schema.saleItems.totalPrice})`,
      })
      .from(schema.saleItems)
      .innerJoin(schema.products, eq(schema.saleItems.productId, schema.products.id))
      .innerJoin(schema.sales, eq(schema.saleItems.saleId, schema.sales.id))
      .where(and(...categoryWhere))
      .groupBy(schema.products.category);

    // 4. Sales by payment method
    const pmWhere = [
      eq(schema.sales.status, 'completed'),
      sql`${schema.sales.createdAt} >= ${startDate}`,
      sql`${schema.sales.createdAt} <= ${endDate}`
    ];
    if (isCashier && sessionUserId) {
      pmWhere.push(eq(schema.sales.userId, sessionUserId));
    }

    const paymentMethods = await db
      .select({
        method: schema.sales.paymentMethod,
        total: sql<number>`SUM(${schema.sales.totalAmount})`,
      })
      .from(schema.sales)
      .where(and(...pmWhere))
      .groupBy(schema.sales.paymentMethod);

    return {
      revenue: summary[0]?.totalRevenue || 0,
      tax: summary[0]?.totalTax || 0,
      discount: summary[0]?.totalDiscount || 0,
      transactions: summary[0]?.count || 0,
      profit: profitData[0]?.totalProfit || 0,
      categorySales,
      paymentMethods,
    };
  } catch (error) {
    console.error('IPC db:sales-summary error:', error);
    return { revenue: 0, tax: 0, discount: 0, transactions: 0, profit: 0, categorySales: [], paymentMethods: [] };
  }
});

// --- Shift Register Drawer Controls ---
ipcMain.handle('db:get-open-shift', async (_, userId) => {
  try {
    const activeUserId = currentSessionUser?.role === 'cashier' ? currentSessionUser.id : userId;
    const activeShifts = await db
      .select()
      .from(schema.shifts)
      .where(and(eq(schema.shifts.userId, activeUserId), eq(schema.shifts.status, 'open')))
      .limit(1);

    return activeShifts[0] || null;
  } catch (error) {
    console.error('IPC db:get-open-shift error:', error);
    return null;
  }
});

ipcMain.handle('db:open-shift', async (_, userId, startingCash) => {
  try {
    const activeUserId = currentSessionUser?.role === 'cashier' ? currentSessionUser.id : userId;
    const now = new Date().toISOString();
    const result = await db
      .insert(schema.shifts)
      .values({
        userId: activeUserId,
        status: 'open',
        startTime: now,
        startingCash,
        expectedCash: startingCash,
        cashAdditions: 0,
        cashWithdrawals: 0,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:open-shift error:', error);
    return null;
  }
});

ipcMain.handle('db:close-shift', async (_, shiftId, actualCash, note) => {
  try {
    return db.transaction((tx) => {
      // 1. Fetch current shift info
      const shiftList = tx
        .select()
        .from(schema.shifts)
        .where(eq(schema.shifts.id, shiftId))
        .limit(1)
        .all();

      if (shiftList.length === 0) throw new Error('Shift not found');
      const shift = shiftList[0];
      if (shift.status === 'closed') throw new Error('Shift already closed');

      if (currentSessionUser?.role === 'cashier' && shift.userId !== currentSessionUser.id) {
        throw new Error('Unauthorized to close this shift');
      }

      const difference = actualCash - shift.expectedCash;

      const result = tx
        .update(schema.shifts)
        .set({
          status: 'closed',
          endTime: new Date().toISOString(),
          actualCash,
          differenceAmount: difference,
          note,
        })
        .where(eq(schema.shifts.id, shiftId))
        .returning()
        .get();

      return result;
    });
  } catch (error) {
    console.error('IPC db:close-shift error:', error);
    return null;
  }
});

ipcMain.handle('db:add-shift-transaction', async (_, shiftId, type, amount, reason) => {
  try {
    return db.transaction((tx) => {
      // Validate that shift belongs to current session user if cashier
      const shiftList = tx
        .select()
        .from(schema.shifts)
        .where(eq(schema.shifts.id, shiftId))
        .limit(1)
        .all();
      if (shiftList.length === 0) throw new Error('Shift not found');
      const shift = shiftList[0];
      if (currentSessionUser?.role === 'cashier' && shift.userId !== currentSessionUser.id) {
        throw new Error('Unauthorized to add transaction to this shift');
      }

      // 1. Insert transaction
      const now = new Date().toISOString();
      const transaction = tx.insert(schema.shiftTransactions).values({
        shiftId,
        type,
        amount,
        reason,
        timestamp: now,
      }).returning().get();

      // 2. Adjust shift totals
      if (type === 'cash_in') {
        tx
          .update(schema.shifts)
          .set({
            cashAdditions: sql`${schema.shifts.cashAdditions} + ${amount}`,
            expectedCash: sql`${schema.shifts.expectedCash} + ${amount}`,
          })
          .where(eq(schema.shifts.id, shiftId))
          .run();
      } else {
        tx
          .update(schema.shifts)
          .set({
            cashWithdrawals: sql`${schema.shifts.cashWithdrawals} + ${amount}`,
            expectedCash: sql`${schema.shifts.expectedCash} - ${amount}`,
          })
          .where(eq(schema.shifts.id, shiftId))
          .run();
      }

      return transaction;
    });
  } catch (error) {
    console.error('IPC db:add-shift-transaction error:', error);
    return null;
  }
});

ipcMain.handle('db:get-shift-transactions', async (_, shiftId) => {
  try {
    const activeUserId = currentSessionUser?.role === 'cashier' ? currentSessionUser.id : null;
    if (activeUserId !== null) {
      const shiftList = await db
        .select()
        .from(schema.shifts)
        .where(and(eq(schema.shifts.id, shiftId), eq(schema.shifts.userId, activeUserId)))
        .limit(1);
      if (shiftList.length === 0) return [];
    }

    return await db
      .select()
      .from(schema.shiftTransactions)
      .where(eq(schema.shiftTransactions.shiftId, shiftId))
      .orderBy(desc(schema.shiftTransactions.timestamp));
  } catch (error) {
    console.error('IPC db:get-shift-transactions error:', error);
    return [];
  }
});

ipcMain.handle('db:get-shift-history', async () => {
  try {
    let query = db
      .select({
        id: schema.shifts.id,
        cashierName: schema.users.name,
        status: schema.shifts.status,
        startTime: schema.shifts.startTime,
        endTime: schema.shifts.endTime,
        startingCash: schema.shifts.startingCash,
        cashAdditions: schema.shifts.cashAdditions,
        cashWithdrawals: schema.shifts.cashWithdrawals,
        expectedCash: schema.shifts.expectedCash,
        actualCash: schema.shifts.actualCash,
        differenceAmount: schema.shifts.differenceAmount,
        note: schema.shifts.note,
      })
      .from(schema.shifts)
      .innerJoin(schema.users, eq(schema.shifts.userId, schema.users.id));

    if (currentSessionUser?.role === 'cashier') {
      return await query
        .where(eq(schema.shifts.userId, currentSessionUser.id))
        .orderBy(desc(schema.shifts.startTime))
        .limit(50);
    }

    return await query.orderBy(desc(schema.shifts.startTime)).limit(50);
  } catch (error) {
    console.error('IPC db:get-shift-history error:', error);
    return [];
  }
});

// --- Settings ---
ipcMain.handle('db:get-settings', async () => {
  try {
    const rawSettings = await db.select().from(schema.settings);
    const settingsMap: Record<string, string> = {};
    rawSettings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return settingsMap;
  } catch (error) {
    console.error('IPC db:get-settings error:', error);
    return {};
  }
});

ipcMain.handle('db:save-settings', async (_, settingsList) => {
  try {
    return db.transaction((tx) => {
      for (const [key, value] of Object.entries(settingsList)) {
        tx
          .insert(schema.settings)
          .values({ key, value: String(value) })
          .onConflictDoUpdate({
            target: schema.settings.key,
            set: { value: String(value) },
          })
          .run();
      }
      return true;
    });
  } catch (error) {
    console.error('IPC db:save-settings error:', error);
    return false;
  }
});

ipcMain.handle('db:create-backup', async () => {
  try {
    const backup = await createDatabaseBackup('manual');
    if (!backup) {
      return { success: false, error: 'database_not_found' };
    }
    return { success: true, backup };
  } catch (error: any) {
    console.error('IPC db:create-backup error:', error);
    return { success: false, error: error?.message || 'backup_failed' };
  }
});

ipcMain.handle('db:get-backup-status', async () => {
  try {
    return await getBackupStatus();
  } catch (error) {
    console.error('IPC db:get-backup-status error:', error);
    return null;
  }
});

ipcMain.handle('db:open-backup-folder', async () => {
  try {
    const { shell } = await import('electron');
    const backupDir = getBackupDirectoryPath();
    fs.mkdirSync(backupDir, { recursive: true });
    await shell.openPath(backupDir);
    return true;
  } catch (error) {
    console.error('IPC db:open-backup-folder error:', error);
    return false;
  }
});

ipcMain.handle('manager:tunnel-status', async () => {
  return getCloudflareTunnelStatus();
});

ipcMain.handle('manager:start-tunnel', async () => {
  return await startCloudflareTunnel();
});

ipcMain.handle('manager:stop-tunnel', async () => {
  return stopCloudflareTunnel();
});

// ==========================================
// HARDWARE IPC HANDLERS
// ==========================================
ipcMain.handle('hardware:preview-receipt', async (_, receiptData) => {
  try {
    return generateReceiptHtml(receiptData);
  } catch (error: any) {
    console.error('IPC hardware:preview-receipt error:', error);
    return `<div style="color:red; padding:20px;">Error generating preview: ${error.message}</div>`;
  }
});

ipcMain.handle('hardware:print-receipt', async (_, receiptData, config) => {
  try {
    return await printReceipt(receiptData, config);
  } catch (error: any) {
    console.error('Hardware printer error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hardware:trigger-drawer', async (_, config) => {
  try {
    return await triggerCashDrawer(config);
  } catch (error: any) {
    console.error('Hardware drawer error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hardware:print-shift-report', async (_, reportData, config) => {
  try {
    return await printShiftReport(reportData, config);
  } catch (error: any) {
    console.error('Hardware shift report print error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hardware:print-daily-report', async (_, reportData, config) => {
  try {
    return await printDailyReport(reportData, config);
  } catch (error: any) {
    console.error('Hardware daily report print error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hardware:print-product-report', async (_, reportData, config) => {
  try {
    return await printProductReport(reportData, config);
  } catch (error: any) {
    console.error('Hardware product report print error:', error);
    return { success: false, error: error.message };
  }
});

// ==========================================
// LICENSING SYSTEM (HARDWARE LOCKED)
// ==========================================
const LICENSE_SALT = 'KodifySecure2026!@#';
const licenseFilePath = path.join(app.getPath('userData'), 'license.json');

function getMachineId(): string {
  let hardwareInfo = '';

  // 1. Get motherboard UUID on Windows
  try {
    const uuidRaw = execSync('wmic csproduct get uuid', { encoding: 'utf8' });
    const uuid = uuidRaw.replace(/UUID/gi, '').trim();
    if (uuid && uuid !== 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF' && uuid !== '00000000-0000-0000-0000-000000000000') {
      hardwareInfo += uuid;
    }
  } catch (e) {
    console.error('Failed to get motherboard UUID', e);
  }

  // 2. Get main disk drive serial number
  try {
    const diskRaw = execSync('wmic diskdrive get serialnumber', { encoding: 'utf8' });
    const diskSerials = diskRaw
      .replace(/SerialNumber/gi, '')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (diskSerials.length > 0) {
      hardwareInfo += diskSerials[0];
    }
  } catch (e) {
    console.error('Failed to get disk serial number', e);
  }

  // Fallback if commands return empty (e.g. running in custom VMs or non-Windows)
  if (!hardwareInfo.trim()) {
    hardwareInfo = 'KDFY-FALLBACK-MAC-ID-' + require('os').hostname();
  }

  const sha256 = crypto.createHash('sha256').update(hardwareInfo).digest('hex').toUpperCase();
  return `KDFY-${sha256.substring(0, 4)}-${sha256.substring(4, 8)}-${sha256.substring(8, 12)}-${sha256.substring(12, 16)}`;
}

function verifyLicenseKey(machineId: string, keyToVerify: string): boolean {
  const expectedHash = crypto
    .createHash('sha256')
    .update(machineId + LICENSE_SALT)
    .digest('hex')
    .toUpperCase();
  const expectedKey = `ACT-${expectedHash.substring(0, 4)}-${expectedHash.substring(4, 8)}-${expectedHash.substring(8, 12)}-${expectedHash.substring(12, 16)}`;
  return keyToVerify.trim().replace(/-/g, '') === expectedKey.replace(/-/g, '');
}

ipcMain.handle('license:status', async () => {
  try {
    const machineId = getMachineId();
    if (!fs.existsSync(licenseFilePath)) {
      return { activated: false, machineId };
    }
    const data = JSON.parse(fs.readFileSync(licenseFilePath, 'utf8'));
    const isValid = verifyLicenseKey(machineId, data.key || '');
    return { activated: isValid, machineId };
  } catch (error) {
    console.error('Error checking license status:', error);
    return { activated: false, machineId: 'KDFY-UNKNOWN' };
  }
});

ipcMain.handle('license:activate', async (_, key: string) => {
  try {
    const machineId = getMachineId();
    const isValid = verifyLicenseKey(machineId, key);
    if (isValid) {
      fs.writeFileSync(licenseFilePath, JSON.stringify({ key: key.trim() }), 'utf8');
      return { success: true };
    } else {
      return { success: false, error: 'رمز التفعيل غير صالح لهذا الجهاز' };
    }
  } catch (error: any) {
    console.error('Error activating license:', error);
    return { success: false, error: error.message };
  }
});

// Chat messages API
ipcMain.handle('db:get-messages', async () => {
  try {
    return await db
      .select()
      .from(schema.messages)
      .orderBy(asc(schema.messages.id));
  } catch (error) {
    console.error('IPC db:get-messages error:', error);
    return [];
  }
});

ipcMain.handle('db:send-message', async (_, payload: { sender: string; senderName: string; message: string }) => {
  try {
    const result = await db.insert(schema.messages).values({
      sender: payload.sender,
      senderName: payload.senderName,
      message: payload.message,
      timestamp: new Date().toISOString(),
    }).returning();
    return result[0];
  } catch (error) {
    console.error('IPC db:send-message error:', error);
    return null;
  }
});

ipcMain.handle('db:clear-messages', async () => {
  try {
    await db.delete(schema.messages);
    return true;
  } catch (error) {
    console.error('IPC db:clear-messages error:', error);
    return false;
  }
});

