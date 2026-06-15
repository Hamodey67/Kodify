import { contextBridge, ipcRenderer } from 'electron';
import { PrintReceiptData, ShiftReportData } from './printers';

contextBridge.exposeInMainWorld('api', {
  // Authentication
  login: (username: string, passwordHash: string) =>
    ipcRenderer.invoke('db:login', username, passwordHash),
  logout: () =>
    ipcRenderer.invoke('db:logout'),
  createUser: (userData: any) =>
    ipcRenderer.invoke('db:create-user', userData),
  getUsers: () =>
    ipcRenderer.invoke('db:get-users',),
  verifyAdminPin: (pin: string) =>
    ipcRenderer.invoke('db:verify-admin-pin', pin),

  // Products
  getProducts: () =>
    ipcRenderer.invoke('db:get-products'),
  addProduct: (product: any) =>
    ipcRenderer.invoke('db:add-product', product),
  updateProduct: (id: number, product: any) =>
    ipcRenderer.invoke('db:update-product', id, product),
  deleteProduct: (id: number) =>
    ipcRenderer.invoke('db:delete-product', id),
  searchProducts: (query: string) =>
    ipcRenderer.invoke('db:search-products', query),
  getLowStockAlerts: () =>
    ipcRenderer.invoke('db:low-stock-alerts'),
  getProductStats: (productId: number) =>
    ipcRenderer.invoke('get-product-stats', productId),

  // Customers
  getCustomers: () =>
    ipcRenderer.invoke('db:get-customers'),
  addCustomer: (customer: any) =>
    ipcRenderer.invoke('db:add-customer', customer),
  updateCustomer: (id: number, customer: any) =>
    ipcRenderer.invoke('db:update-customer', id, customer),
  adjustCustomerBalance: (id: number, amount: number) =>
    ipcRenderer.invoke('db:adjust-customer-balance', id, amount),

  // Sales
  createSale: (saleData: any) =>
    ipcRenderer.invoke('db:create-sale', saleData),
  getSales: (filters?: any) =>
    ipcRenderer.invoke('db:get-sales', filters),
  getSaleItems: (saleId: number) =>
    ipcRenderer.invoke('db:get-sale-items', saleId),
  refundSale: (saleId: number) =>
    ipcRenderer.invoke('db:refund-sale', saleId),
  getSalesSummary: (startDate: string, endDate: string) =>
    ipcRenderer.invoke('db:sales-summary', startDate, endDate),
  logPriceOverride: (payload: {
    itemId: number;
    itemName: string;
    originalPrice: number;
    newPrice: number;
    reason?: string | null;
    authorizedBy: string;
    timestamp: string;
  }) => ipcRenderer.invoke('db:log-price-override', payload),

  // Shifts
  getOpenShift: (userId: number) =>
    ipcRenderer.invoke('db:get-open-shift', userId),
  openShift: (userId: number, startingCash: number) =>
    ipcRenderer.invoke('db:open-shift', userId, startingCash),
  closeShift: (shiftId: number, actualCash: number, note: string) =>
    ipcRenderer.invoke('db:close-shift', shiftId, actualCash, note),
  addShiftTransaction: (shiftId: number, type: 'cash_in' | 'cash_out', amount: number, reason: string) =>
    ipcRenderer.invoke('db:add-shift-transaction', shiftId, type, amount, reason),
  getShiftTransactions: (shiftId: number) =>
    ipcRenderer.invoke('db:get-shift-transactions', shiftId),
  getShiftHistory: () =>
    ipcRenderer.invoke('db:get-shift-history'),

  // Settings
  getSettings: () =>
    ipcRenderer.invoke('db:get-settings'),
  saveSettings: (settingsList: Record<string, string>) =>
    ipcRenderer.invoke('db:save-settings', settingsList),
  createBackup: () =>
    ipcRenderer.invoke('db:create-backup'),
  getBackupStatus: () =>
    ipcRenderer.invoke('db:get-backup-status'),
  openBackupFolder: () =>
    ipcRenderer.invoke('db:open-backup-folder'),
  getManagerTunnelStatus: () =>
    ipcRenderer.invoke('manager:tunnel-status'),
  startManagerTunnel: () =>
    ipcRenderer.invoke('manager:start-tunnel'),
  stopManagerTunnel: () =>
    ipcRenderer.invoke('manager:stop-tunnel'),
  onManagerTunnelStatusChanged: (callback: (status: any) => void) => {
    const listener = (_event: any, status: any) => callback(status);
    ipcRenderer.on('manager:tunnel-status-changed', listener);
    return () => ipcRenderer.removeListener('manager:tunnel-status-changed', listener);
  },

  // Hardware
  previewReceipt: (receiptData: any) =>
    ipcRenderer.invoke('hardware:preview-receipt', receiptData),
  printReceipt: (receiptData: PrintReceiptData, config: { mockMode: boolean; printerType: string; connectionPath: string }) =>
    ipcRenderer.invoke('hardware:print-receipt', receiptData, config),
  triggerCashDrawer: (config: { mockMode: boolean; port: string }) =>
    ipcRenderer.invoke('hardware:trigger-drawer', config),
  printShiftReport: (reportData: ShiftReportData, config: { mockMode: boolean; printerType?: string; connectionPath?: string }) =>
    ipcRenderer.invoke('hardware:print-shift-report', reportData, config),
  printDailyReport: (reportData: any, config: { mockMode: boolean; printerType?: string; connectionPath?: string }) =>
    ipcRenderer.invoke('hardware:print-daily-report', reportData, config),
  printProductReport: (reportData: any, config: { mockMode: boolean; printerType: string; connectionPath: string }) =>
    ipcRenderer.invoke('hardware:print-product-report', reportData, config),

  checkLicense: () => ipcRenderer.invoke('license:status'),
  activateLicense: (key: string) => ipcRenderer.invoke('license:activate', key),

  // Chat
  getMessages: () => ipcRenderer.invoke('db:get-messages'),
  sendMessage: (payload: { sender: string; senderName: string; message: string }) =>
    ipcRenderer.invoke('db:send-message', payload),
  clearMessages: () => ipcRenderer.invoke('db:clear-messages'),

  // Window operations
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // Auto-Updater
  onUpdateStatus: (callback: (status: string, info: any) => void) => {
    const listener = (_event: any, status: string, info: any) => callback(status, info);
    ipcRenderer.on('auto-updater:status', listener);
    return () => ipcRenderer.removeListener('auto-updater:status', listener);
  },
  restartAppForUpdate: () => ipcRenderer.send('auto-updater:restart'),
  checkForUpdates: () => ipcRenderer.send('auto-updater:check'),
});
