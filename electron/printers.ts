import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';

// Interface for print data
export interface ProductReportData {
  nameAr: string;
  nameEn: string;
  nameKu: string | null;
  barcode: string | null;
  sku: string | null;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  totalUnitsSold: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;
}

export interface PrintReceiptData {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeTaxNumber: string;
  invoiceNumber: string;
  cashierName: string;
  customerName: string;
  paymentMethod: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    total: number;
    originalPrice?: number;
    discount?: number;
  }>;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  itemsDiscountAmount?: number;
  globalDiscountAmount?: number;
  globalDiscount?: number;
  globalDiscountType?: 'percent' | 'flat';
  total: number;
  cashReceived: number;
  cashReturned: number;
  headerNote?: string;
  footerNote?: string;
  date: string;
}

export interface ShiftReportData {
  cashierName: string;
  startTime: string;
  endTime: string;
  startingCash: number;
  salesCash: number;
  salesCard: number;
  additions: number;
  withdrawals: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  notes: string;
}

export interface DailyReportData {
  reportDate: string;
  generatedAt: string;
  generatedBy: string;
  totalTransactions: number;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  isSummaryOnly: boolean;
  transactions?: Array<{
    invoiceNumber: string;
    time: string;
    customer: string;
    method: string;
    total: number;
  }>;
}

function getLogoBase64(): string {
  try {
    const paths = [
      path.join(__dirname, '../public/print.png'),
      path.join(__dirname, '../dist/print.png'),
      path.join(process.cwd(), 'public/print.png'),
      path.join(process.cwd(), 'dist/print.png')
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        const fileBuffer = fs.readFileSync(p);
        return `data:image/png;base64,${fileBuffer.toString('base64')}`;
      }
    }
  } catch (e) {
    console.error('Error reading logo file:', e);
  }
  return '';
}

export function generateReceiptHtml(data: PrintReceiptData): string {
  const logoBase64 = getLogoBase64();
  const logoHtml = logoBase64 ? `<div style="text-align: center; margin: 10px auto 15px auto; width: 100%;"><img src="${logoBase64}" style="max-width: 85px; max-height: 85px; object-fit: contain; display: inline-block;" /></div>` : '';

  return `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          margin: 0;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 100%;
          max-width: 270px;
          box-sizing: border-box;
          margin: 0;
          padding: 10px 10px 80px 10px;
          font-size: 11px;
          color: #000;
          line-height: 1.4;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .header { font-size: 15px; margin-bottom: 2px; }
        .line { border-top: 1px dashed #000; margin: 6px 0; }
        .item-row {
          margin: 6px 0;
          font-size: 11px;
        }
        .item-name {
          font-weight: 600;
          color: #000;
        }
        .item-details {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #555;
          margin-top: 1px;
        }
        .totals-table { width: 100%; margin-top: 5px; }
        .totals-table td { padding: 2px 0; }
      </style>
    </head>
    <body>
      ${logoHtml}
      <div style="text-align: center; margin-top: -5px; margin-bottom: 12px;">
        <div style="font-size: 14px; font-weight: 800; color: #000; letter-spacing: 0.5px; line-height: 1.2;">101 COSMETICS</div>
      </div>
      <div class="text-center">${data.storeAddress}</div>
      <div class="text-center">Tel: ${data.storePhone || '+0964-750-101-0964'}</div>
      <div class="line"></div>
      <div>Date: ${data.date}</div>
      <div>Invoice: ${data.invoiceNumber}</div>
      <div>Cashier: ${data.cashierName}</div>
      ${data.customerName && data.customerName !== 'Walk-in Customer' ? `<div>Customer: ${data.customerName}</div>` : ''}
      <div class="line"></div>
      <div class="item-list">
        ${data.items.map(item => {
          const itemDiscount = item.discount || 0;
          const originalPrice = item.originalPrice ?? item.price;
          const hasDiscount = itemDiscount > 0 && originalPrice > item.price;
          
          let discountRowHtml = '';
          if (hasDiscount) {
            const discountPercent = Math.round((itemDiscount / (originalPrice * item.qty)) * 100);
            discountRowHtml = `
              <div style="font-size: 9px; color: #555; display: flex; justify-content: space-between; margin-top: -1px; padding-left: 10px;">
                <span style="text-decoration: line-through; color: #888;">Original: ${originalPrice.toLocaleString('en-US')}</span>
                <span>Disc: -${(itemDiscount / item.qty).toLocaleString('en-US')} (${discountPercent}%)</span>
              </div>
            `;
          }

          return `
            <div class="item-row">
              <div class="item-name">${item.name}</div>
              <div class="item-details">
                <span>${item.qty} x ${item.price.toLocaleString('en-US')}</span>
                <span class="bold">${item.total.toLocaleString('en-US')}</span>
              </div>
              ${discountRowHtml}
            </div>
          `;
        }).join('')}
      </div>
      <div class="line"></div>
      <table class="totals-table">
        <tr>
          <td class="text-left">Subtotal:</td>
          <td class="text-right">${data.subtotal.toLocaleString('en-US')}</td>
        </tr>
        ${data.itemsDiscountAmount !== undefined || data.globalDiscountAmount !== undefined ? `
          ${data.itemsDiscountAmount && data.itemsDiscountAmount > 0 ? `
          <tr>
            <td class="text-left">Items Discount:</td>
            <td class="text-right">-${data.itemsDiscountAmount.toLocaleString('en-US')}</td>
          </tr>
          ` : ''}
          ${data.globalDiscountAmount && data.globalDiscountAmount > 0 ? `
          <tr>
            <td class="text-left">General Discount ${data.globalDiscountType === 'percent' ? `(${data.globalDiscount}%)` : `(Flat)`}:</td>
            <td class="text-right">-${data.globalDiscountAmount.toLocaleString('en-US')}</td>
          </tr>
          ` : ''}
        ` : `
          ${data.discountAmount > 0 ? `
          <tr>
            <td class="text-left">Discount:</td>
            <td class="text-right">-${data.discountAmount.toLocaleString('en-US')}</td>
          </tr>
          ` : ''}
        `}
        <tr class="bold" style="font-size: 12px;">
          <td class="text-left">Total:</td>
          <td class="text-right">${data.total.toLocaleString('en-US')}</td>
        </tr>
        <tr>
          <td class="text-left">Received:</td>
          <td class="text-right">${data.cashReceived.toLocaleString('en-US')}</td>
        </tr>
        <tr>
          <td class="text-left">Change:</td>
          <td class="text-right">${data.cashReturned.toLocaleString('en-US')}</td>
        </tr>
      </table>
      <div class="line"></div>
      <div class="text-center bold">Thank You</div>
      <div style="font-size: 7px; color: #888; text-align: center; margin-top: 25px; font-weight: 500; letter-spacing: 0.5px;">KODIFY SYSTEM</div>
    </body>
    </html>
  `;
}

export async function printReceipt(data: PrintReceiptData, config: { mockMode: boolean; printerType: string; connectionPath: string }) {
  if (config.mockMode) {
    return printMockReceipt(data);
  }

  console.log(`Printing to physical printer: Type=${config.printerType}, Connection=${config.connectionPath}`);
  
  const htmlContent = generateReceiptHtml(data);

  // Save HTML receipt locally for easy preview
  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, 'latest_receipt.html'), htmlContent, 'utf-8');
  } catch (err) {
    console.error('Failed to save preview HTML receipt:', err);
  }

  return new Promise((resolve) => {
    try {
      const win = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        }
      });

      win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));

      win.webContents.on('did-finish-load', () => {
        win.webContents.print({
          silent: true,
          deviceName: config.connectionPath || 'POSPrinter POS80',
          margins: { marginType: 'none' },
          pageSize: { width: 80000, height: 200000 }
        }, (success, errorType) => {
          win.close();
          if (success) {
            resolve({ success: true, message: 'Printed successfully' });
          } else {
            console.error(`Print failed: ${errorType}`);
            resolve({ success: false, error: errorType });
          }
        });
      });
    } catch (e: any) {
      console.error('Print window exception:', e);
      resolve({ success: false, error: e.message });
    }
  });
}

export async function triggerCashDrawer(config: { mockMode: boolean; port: string }) {
  if (config.mockMode) {
    console.log('[Mock Hardware] Cash Drawer Triggered / OPENED');
    return { success: true, message: 'Mock Drawer Triggered' };
  }

  console.log(`[Hardware] Triggering cash drawer pulse on port ${config.port}`);
  // In real hardware, we send pulse command (e.g. [27, 112, 0, 25, 250]) to the serial port or printer
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Drawer triggered' });
    }, 500);
  });
}

export function generateShiftReportHtml(data: ShiftReportData): string {
  const logoBase64 = getLogoBase64();
  const logoHtml = logoBase64 ? `<div style="text-align: center; margin: 10px auto 15px auto; width: 100%;"><img src="${logoBase64}" style="max-width: 85px; max-height: 85px; object-fit: contain; display: inline-block;" /></div>` : '';
  const now = new Date().toLocaleString('en-US');

  return `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          margin: 0;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 100%;
          max-width: 270px;
          box-sizing: border-box;
          margin: 0;
          padding: 10px 10px 80px 10px;
          font-size: 11px;
          color: #000;
          line-height: 1.4;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .header { font-size: 13px; font-weight: 800; margin-bottom: 2px; text-transform: uppercase; }
        .line { border-top: 1px dashed #000; margin: 6px 0; }
        .info-table { width: 100%; margin: 6px 0; }
        .info-table td { padding: 3px 0; font-size: 11px; }
        .section-title {
          font-weight: 800;
          text-align: center;
          background: #f0f0f0;
          padding: 4px;
          margin: 8px 0;
          font-size: 11px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      ${logoHtml}
      <div class="text-center">
        <div class="header">SHIFT CLOSE REPORT</div>
        <div style="font-size: 10px; color: #555;">تقرير إغلاق الوردية</div>
      </div>
      <div class="line"></div>
      
      <table class="info-table">
        <tr>
          <td class="bold">Cashier / الكاشير:</td>
          <td class="text-right">${data.cashierName}</td>
        </tr>
        <tr>
          <td class="bold">Start / البداية:</td>
          <td class="text-right">${data.startTime}</td>
        </tr>
        <tr>
          <td class="bold">End / النهاية:</td>
          <td class="text-right">${data.endTime || 'Active (N/A)'}</td>
        </tr>
      </table>

      <div class="section-title">FINANCIAL SUMMARY / الملخص المالي</div>

      <table class="info-table">
        <tr>
          <td class="bold">Starting Cash / عهدة البداية:</td>
          <td class="text-right">${data.startingCash.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold">Sales (Cash) / مبيعات كاش:</td>
          <td class="text-right">${data.salesCash.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold">Sales (Card) / مبيعات شبكة:</td>
          <td class="text-right">${data.salesCard.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold">Cash In / إيداعات إضافية:</td>
          <td class="text-right">${data.additions.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold">Cash Out / سحوبات مصروفات:</td>
          <td class="text-right">-${data.withdrawals.toLocaleString('en-US')} IQD</td>
        </tr>
      </table>

      <div class="line"></div>

      <table class="info-table">
        <tr>
          <td class="bold">Expected Cash / المتوقع:</td>
          <td class="text-right bold">${data.expectedCash.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold">Actual Cash / الفعلي:</td>
          <td class="text-right bold">${data.actualCash.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold" style="font-size: 12px; padding-top: 5px;">Difference / العجز-الزيادة:</td>
          <td class="text-right bold" style="font-size: 12px; padding-top: 5px; color: ${data.difference < 0 ? '#d32f2f' : '#388e3c'};">
            ${data.difference >= 0 ? '+' : ''}${data.difference.toLocaleString('en-US')} IQD
          </td>
        </tr>
      </table>

      ${data.notes ? `
      <div class="section-title">NOTES / ملاحظات</div>
      <div style="font-size: 10px; padding: 4px; background: #f9f9f9; border: 1px solid #eee; min-height: 30px;">
        ${data.notes}
      </div>
      ` : ''}

      <div class="line"></div>
      <div style="font-size: 9px; color: #555; text-align: center;">
        Printed At: ${now}
      </div>
      <div style="font-size: 7px; color: #888; text-align: center; margin-top: 25px; font-weight: 500; letter-spacing: 0.5px;">KODIFY SYSTEM</div>
    </body>
    </html>
  `;
}

export async function printShiftReport(data: ShiftReportData, config: { mockMode: boolean; printerType?: string; connectionPath?: string }) {
  if (config.mockMode) {
    return printMockShiftReport(data);
  }
  
  console.log(`Printing shift report to physical printer: Type=${config.printerType}, Connection=${config.connectionPath}`);
  
  const htmlContent = generateShiftReportHtml(data);

  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, 'latest_shift_report.html'), htmlContent, 'utf-8');
  } catch (err) {
    console.error('Failed to save preview HTML shift report:', err);
  }

  return new Promise((resolve) => {
    try {
      const win = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        }
      });

      win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));

      win.webContents.on('did-finish-load', () => {
        win.webContents.print({
          silent: true,
          deviceName: config.connectionPath || 'POSPrinter POS80',
          margins: { marginType: 'none' },
          pageSize: { width: 80000, height: 200000 }
        }, (success, errorType) => {
          win.close();
          if (success) {
            resolve({ success: true, message: 'Printed successfully' });
          } else {
            console.error(`Print failed: ${errorType}`);
            resolve({ success: false, error: errorType });
          }
        });
      });
    } catch (e: any) {
      console.error('Print window exception:', e);
      resolve({ success: false, error: e.message });
    }
  });
}

// Generates a text file representation of the printed receipt for verification
function printMockReceipt(data: PrintReceiptData) {
  const line = '------------------------------------------';
  
  let receiptText = '';
  receiptText += `${line}\n`;
  receiptText += `      *** 101 COSMETICS ***\n`;
  receiptText += `      ${data.storeAddress}\n`;
  receiptText += `      Tel: ${data.storePhone}\n`;
  receiptText += `${line}\n`;
  receiptText += `Date: ${data.date}\n`;
  receiptText += `Invoice No: ${data.invoiceNumber}\n`;
  receiptText += `Cashier: ${data.cashierName}\n`;
  if (data.customerName && data.customerName !== 'Walk-in Customer') {
    receiptText += `Customer: ${data.customerName}\n`;
  }
  receiptText += `${line}\n`;
  receiptText += `Item                    Qty   Price    Total\n`;
  receiptText += `${line}\n`;

  data.items.forEach(item => {
    // Basic text alignment
    const nameLimit = item.name.substring(0, 20).padEnd(20, ' ');
    const qtyStr = item.qty.toString().padStart(5, ' ');
    const priceStr = item.price.toLocaleString('en-US').padStart(8, ' ');
    const totalStr = item.total.toLocaleString('en-US').padStart(8, ' ');
    receiptText += `${nameLimit}${qtyStr}${priceStr}${totalStr}\n`;

    const itemDiscount = item.discount || 0;
    const originalPrice = item.originalPrice ?? item.price;
    const hasDiscount = itemDiscount > 0 && originalPrice > item.price;
    if (hasDiscount) {
      const discountPercent = Math.round((itemDiscount / (originalPrice * item.qty)) * 100);
      receiptText += `  [Original: ${originalPrice.toLocaleString('en-US')} | Disc: -${(itemDiscount / item.qty).toLocaleString('en-US')} (${discountPercent}%)]\n`;
    }
  });

  receiptText += `${line}\n`;
  receiptText += `Subtotal:                  ${data.subtotal.toLocaleString('en-US')} IQD\n`;
  receiptText += `VAT:                       ${data.taxAmount.toLocaleString('en-US')} IQD\n`;
  if (data.itemsDiscountAmount !== undefined || data.globalDiscountAmount !== undefined) {
    if (data.itemsDiscountAmount && data.itemsDiscountAmount > 0) {
      receiptText += `Items Discount:           -${data.itemsDiscountAmount.toLocaleString('en-US')} IQD\n`;
    }
    if (data.globalDiscountAmount && data.globalDiscountAmount > 0) {
      const typeLabel = data.globalDiscountType === 'percent' ? `(${data.globalDiscount}%)` : `(Flat)`;
      receiptText += `General Disc ${typeLabel.padEnd(8, ' ')}:       -${data.globalDiscountAmount.toLocaleString('en-US')} IQD\n`;
    }
  } else if (data.discountAmount > 0) {
    receiptText += `Discount:                 -${data.discountAmount.toLocaleString('en-US')} IQD\n`;
  }
  receiptText += `TOTAL:                     ${data.total.toLocaleString('en-US')} IQD\n`;
  receiptText += `${line}\n`;
  receiptText += `Payment Method:            ${data.paymentMethod}\n`;
  receiptText += `Cash Received:             ${data.cashReceived.toLocaleString('en-US')} IQD\n`;
  receiptText += `Change Due:                ${data.cashReturned.toLocaleString('en-US')} IQD\n`;
  
  if (data.headerNote) receiptText += `\n${data.headerNote}\n`;
  if (data.footerNote) receiptText += `\n${data.footerNote}\n`;
  receiptText += `${line}\n`;
  receiptText += `               Thank You\n`;
  receiptText += `${line}\n`;
  receiptText += `            KODIFY SYSTEM\n`;
  receiptText += `${line}\n`;

  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputPath = path.join(outputDir, `receipt_${data.invoiceNumber}.txt`);
    fs.writeFileSync(outputPath, receiptText, 'utf-8');
    
    // Also save as the latest receipt for quick viewing
    fs.writeFileSync(path.join(outputDir, 'latest_receipt.txt'), receiptText, 'utf-8');
    
    // Also generate and save the beautiful HTML receipt for easy previewing
    try {
      const htmlContent = generateReceiptHtml(data);
      fs.writeFileSync(path.join(outputDir, 'latest_receipt.html'), htmlContent, 'utf-8');
    } catch (htmlErr) {
      console.error('Failed to write HTML preview in mock receipt:', htmlErr);
    }
    
    console.log(`[Mock Printer] Receipt printed to: ${outputPath}`);
    return { success: true, path: outputPath, receiptText };
  } catch (error: any) {
    console.error('Failed to write mock receipt:', error);
    return { success: false, error: error.message };
  }
}

function printMockShiftReport(data: ShiftReportData) {
  const line = '==========================================';
  let reportText = '';
  reportText += `${line}\n`;
  reportText += `       تقرير الوردية / SHIFT CLOSE REPORT\n`;
  reportText += `${line}\n`;
  reportText += `Cashier / الكاشير: ${data.cashierName}\n`;
  reportText += `Start Time / البداية: ${data.startTime}\n`;
  reportText += `End Time / النهاية: ${data.endTime || 'Active (N/A)'}\n`;
  reportText += `${line}\n`;
  reportText += `Starting Cash / عهدة البداية:     ${data.startingCash.toFixed(2)} SAR\n`;
  reportText += `Sales (Cash) / مبيعات كاش:       ${data.salesCash.toFixed(2)} SAR\n`;
  reportText += `Sales (Card) / مبيعات شبكة:      ${data.salesCard.toFixed(2)} SAR\n`;
  reportText += `Cash In / إيداعات إضافية:        ${data.additions.toFixed(2)} SAR\n`;
  reportText += `Cash Out / سحوبات مصروفات:       -${data.withdrawals.toFixed(2)} SAR\n`;
  reportText += `${line}\n`;
  reportText += `Expected Drawer Cash / المتوقع:   ${data.expectedCash.toFixed(2)} SAR\n`;
  reportText += `Actual Drawer Cash / الفعلي:      ${data.actualCash.toFixed(2)} SAR\n`;
  
  const diffPrefix = data.difference >= 0 ? '+' : '';
  reportText += `Difference / العجز أو الزيادة:    ${diffPrefix}${data.difference.toFixed(2)} SAR\n`;
  reportText += `${line}\n`;
  reportText += `Notes / ملاحظات:\n${data.notes || 'None - لا يوجد'}\n`;
  reportText += `${line}\n`;

  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputPath = path.join(outputDir, `shift_report_${Date.now()}.txt`);
    fs.writeFileSync(outputPath, reportText, 'utf-8');
    fs.writeFileSync(path.join(outputDir, 'latest_shift_report.txt'), reportText, 'utf-8');
    
    console.log(`[Mock Printer] Shift report printed to: ${outputPath}`);
    return { success: true, path: outputPath, reportText };
  } catch (error: any) {
    console.error('Failed to write mock shift report:', error);
    return { success: false, error: error.message };
  }
}

export function generateDailyReportHtml(data: DailyReportData): string {
  const logoBase64 = getLogoBase64();
  const logoHtml = logoBase64 ? `<div style="text-align: center; margin: 10px auto 15px auto; width: 100%;"><img src="${logoBase64}" style="max-width: 85px; max-height: 85px; object-fit: contain; display: inline-block;" /></div>` : '';
  const now = new Date().toLocaleString('en-US');

  return `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          margin: 0;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 100%;
          max-width: 270px;
          box-sizing: border-box;
          margin: 0;
          padding: 10px 10px 80px 10px;
          font-size: 11px;
          color: #000;
          line-height: 1.4;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .header { font-size: 13px; font-weight: 800; margin-bottom: 2px; text-transform: uppercase; }
        .line { border-top: 1px dashed #000; margin: 6px 0; }
        .info-table { width: 100%; margin: 6px 0; }
        .info-table td { padding: 3px 0; font-size: 11px; }
        .section-title {
          font-weight: 800;
          text-align: center;
          background: #f0f0f0;
          padding: 4px;
          margin: 8px 0;
          font-size: 11px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      ${logoHtml}
      <div class="text-center">
        <div class="header">DAILY SALES REPORT</div>
        <div style="font-size: 10px; color: #555;">تقرير المبيعات اليومية</div>
      </div>
      <div class="line"></div>
      
      <table class="info-table">
        <tr>
          <td class="bold">Date / التاريخ:</td>
          <td class="text-right">${data.reportDate}</td>
        </tr>
        <tr>
          <td class="bold">Printed By / طبع بواسطة:</td>
          <td class="text-right">${data.generatedBy}</td>
        </tr>
      </table>

      <div class="section-title">SUMMARY / الملخص</div>

      <table class="info-table">
        <tr>
          <td class="bold">Total Transactions / العمليات:</td>
          <td class="text-right">${data.totalTransactions}</td>
        </tr>
        <tr>
          <td class="bold">Cash Sales / كاش:</td>
          <td class="text-right">${data.totalCash.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold">Card Sales / بطاقة:</td>
          <td class="text-right">${data.totalCard.toLocaleString('en-US')} IQD</td>
        </tr>
        <tr>
          <td class="bold" style="font-size: 12px; padding-top: 5px;">Total / الإجمالي:</td>
          <td class="text-right bold" style="font-size: 12px; padding-top: 5px;">${data.totalSales.toLocaleString('en-US')} IQD</td>
        </tr>
      </table>

      ${(!data.isSummaryOnly && data.transactions && data.transactions.length > 0) ? `
      <div class="section-title">TRANSACTIONS / العمليات</div>
      <table class="info-table" style="font-size: 9px;">
        <thead>
          <tr style="border-bottom: 1px dashed #ccc;">
            <th class="text-left" style="padding-bottom: 3px;">Inv No</th>
            <th class="text-left" style="padding-bottom: 3px;">Time</th>
            <th class="text-left" style="padding-bottom: 3px;">Method</th>
            <th class="text-right" style="padding-bottom: 3px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.transactions.map(tx => `
            <tr>
              <td>${tx.invoiceNumber.substring(0, 8)}</td>
              <td>${tx.time}</td>
              <td>${tx.method}</td>
              <td class="text-right">${tx.total.toLocaleString('en-US')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ` : ''}

      <div class="line"></div>
      <div style="font-size: 9px; color: #555; text-align: center;">
        Printed At: ${now}
      </div>
      <div style="font-size: 7px; color: #888; text-align: center; margin-top: 25px; font-weight: 500; letter-spacing: 0.5px;">KODIFY SYSTEM</div>
    </body>
    </html>
  `;
}

export async function printDailyReport(data: DailyReportData, config: { mockMode: boolean; printerType?: string; connectionPath?: string }) {
  if (config.mockMode) {
    return printMockDailyReport(data);
  }
  
  console.log(`Printing daily report to physical printer: Type=${config.printerType}, Connection=${config.connectionPath}`);
  
  const htmlContent = generateDailyReportHtml(data);

  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, 'latest_daily_report.html'), htmlContent, 'utf-8');
  } catch (err) {
    console.error('Failed to save preview HTML daily report:', err);
  }

  return new Promise((resolve) => {
    try {
      const win = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        }
      });

      win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));

      win.webContents.on('did-finish-load', () => {
        win.webContents.print({
          silent: true,
          deviceName: config.connectionPath || 'POSPrinter POS80',
          margins: { marginType: 'none' },
          pageSize: { width: 80000, height: 200000 }
        }, (success, errorType) => {
          win.close();
          if (success) {
            resolve({ success: true, message: 'Printed successfully' });
          } else {
            console.error(`Print failed: ${errorType}`);
            resolve({ success: false, error: errorType });
          }
        });
      });
    } catch (e: any) {
      console.error('Print window exception:', e);
      resolve({ success: false, error: e.message });
    }
  });
}

function printMockDailyReport(data: DailyReportData) {
  const line = '==========================================';
  let reportText = '';
  reportText += `${line}\n`;
  reportText += `    تقرير المبيعات اليومية / DAILY SALES REPORT\n`;
  reportText += `${line}\n`;
  reportText += `Date / التاريخ: ${data.reportDate}\n`;
  reportText += `Printed By / طبع بواسطة: ${data.generatedBy}\n`;
  reportText += `Printed At / وقت الطباعة: ${data.generatedAt}\n`;
  reportText += `${line}\n`;
  reportText += `Total Sales / إجمالي المبيعات:    ${data.totalSales.toLocaleString('en-US')} IQD\n`;
  reportText += `Total Transactions / عدد العمليات: ${data.totalTransactions}\n`;
  reportText += `Cash Sales / مبيعات الكاش:       ${data.totalCash.toLocaleString('en-US')} IQD\n`;
  reportText += `Card Sales / مبيعات البطاقة:      ${data.totalCard.toLocaleString('en-US')} IQD\n`;
  reportText += `${line}\n`;

  if (!data.isSummaryOnly && data.transactions && data.transactions.length > 0) {
    reportText += `              تفاصيل العمليات\n`;
    reportText += `             TRANSACTION DETAILS\n`;
    reportText += `${line}\n`;
    reportText += `Inv No    Time    Method      Total (IQD)\n`;
    reportText += `------------------------------------------\n`;
    
    data.transactions.forEach(tx => {
      const invNum = tx.invoiceNumber.substring(0, 8).padEnd(8, ' ');
      const time = tx.time.padStart(6, ' ');
      const method = tx.method.substring(0, 6).padEnd(8, ' ');
      const total = tx.total.toLocaleString('en-US').padStart(14, ' ');
      reportText += `${invNum}  ${time}  ${method} ${total}\n`;
    });
    reportText += `${line}\n`;
  }

  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputPath = path.join(outputDir, `daily_report_${data.reportDate.replace(/\//g, '-')}.txt`);
    fs.writeFileSync(outputPath, reportText, 'utf-8');
    fs.writeFileSync(path.join(outputDir, 'latest_daily_report.txt'), reportText, 'utf-8');
    
    console.log(`[Mock Printer] Daily report printed to: ${outputPath}`);
    return { success: true, path: outputPath, reportText };
  } catch (error: any) {
    console.error('Failed to write mock daily report:', error);
    return { success: false, error: error.message };
  }
}

export function generateProductReportHtml(data: ProductReportData): string {
  const logoBase64 = getLogoBase64();
  const logoHtml = logoBase64 ? `<div style="text-align: center; margin: 10px auto 15px auto; width: 100%;"><img src="${logoBase64}" style="max-width: 85px; max-height: 85px; object-fit: contain; display: inline-block;" /></div>` : '';
  const now = new Date().toLocaleString('en-US');

  return `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          margin: 0;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 100%;
          max-width: 270px;
          box-sizing: border-box;
          margin: 0;
          padding: 10px 10px 80px 10px;
          font-size: 11px;
          color: #000;
          line-height: 1.4;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .header { font-size: 13px; font-weight: 800; margin-bottom: 2px; text-transform: uppercase; }
        .line { border-top: 1px dashed #000; margin: 6px 0; }
        .info-table { width: 100%; margin: 6px 0; }
        .info-table td { padding: 3px 0; font-size: 11px; }
        .section-title {
          font-weight: 800;
          text-align: center;
          background: #f0f0f0;
          padding: 4px;
          margin: 8px 0;
          font-size: 11px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      ${logoHtml}
      <div class="text-center">
        <div class="header">Product Details Report</div>
        <div style="font-size: 10px; color: #555;">تقرير تفاصيل المنتج</div>
      </div>
      <div class="line"></div>
      
      <table class="info-table">
        <tr>
          <td class="bold">Name (AR):</td>
          <td class="text-right">${data.nameAr}</td>
        </tr>
        <tr>
          <td class="bold">Name (EN):</td>
          <td class="text-right">${data.nameEn}</td>
        </tr>
        ${data.nameKu ? `
        <tr>
          <td class="bold">Name (KU):</td>
          <td class="text-right">${data.nameKu}</td>
        </tr>
        ` : ''}
        <tr>
          <td class="bold">Barcode:</td>
          <td class="text-right" style="font-family: monospace;">${data.barcode || '-'}</td>
        </tr>
        <tr>
          <td class="bold">SKU / Code:</td>
          <td class="text-right" style="font-family: monospace;">${data.sku || '-'}</td>
        </tr>
        <tr>
          <td class="bold">Category:</td>
          <td class="text-right">${data.category}</td>
        </tr>
      </table>

      <div class="section-title">PRICING & STOCK / الأسعار والمخزون</div>

      <table class="info-table">
        <tr>
          <td class="bold">Cost Price / التكلفة:</td>
          <td class="text-right">${Math.round(data.cost).toLocaleString()} IQD</td>
        </tr>
        <tr>
          <td class="bold">Sale Price / سعر البيع:</td>
          <td class="text-right">${Math.round(data.price).toLocaleString()} IQD</td>
        </tr>
        <tr>
          <td class="bold">Current Stock / الكمية الحالية:</td>
          <td class="text-right bold">${data.stock}</td>
        </tr>
        <tr>
          <td class="bold">Min Stock Alert / الحد الأدنى:</td>
          <td class="text-right">${data.minStock}</td>
        </tr>
      </table>

      <div class="section-title">SALES PERFORMANCE / أداء المبيعات</div>

      <table class="info-table">
        <tr>
          <td class="bold">Total Units Sold / إجمالي الوحدات:</td>
          <td class="text-right">${data.totalUnitsSold}</td>
        </tr>
        <tr>
          <td class="bold">Total Revenue / الإيرادات:</td>
          <td class="text-right">${Math.round(data.totalRevenue).toLocaleString()} IQD</td>
        </tr>
        <tr>
          <td class="bold">Total Cost / التكلفة الكلية:</td>
          <td class="text-right">${Math.round(data.totalCost).toLocaleString()} IQD</td>
        </tr>
        <tr>
          <td class="bold">Net Profit / الربح الصافي:</td>
          <td class="text-right bold">${Math.round(data.netProfit).toLocaleString()} IQD</td>
        </tr>
        <tr>
          <td class="bold">Profit Margin / هامش الربح:</td>
          <td class="text-right bold">${data.profitMargin.toFixed(1)}%</td>
        </tr>
      </table>

      <div class="line"></div>
      <div style="font-size: 9px; color: #555; text-align: center;">
        Generated: ${now}
      </div>
      <div style="font-size: 7px; color: #888; text-align: center; margin-top: 25px; font-weight: 500; letter-spacing: 0.5px;">KODIFY SYSTEM</div>
    </body>
    </html>
  `;
}

export async function printProductReport(data: ProductReportData, config: { mockMode: boolean; printerType: string; connectionPath: string }) {
  if (config.mockMode) {
    return printMockProductReport(data);
  }

  console.log(`Printing product report to physical printer: Type=${config.printerType}, Connection=${config.connectionPath}`);
  
  const htmlContent = generateProductReportHtml(data);

  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, 'latest_product_report.html'), htmlContent, 'utf-8');
  } catch (err) {
    console.error('Failed to save preview HTML product report:', err);
  }

  return new Promise((resolve) => {
    try {
      const win = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        }
      });

      win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));

      win.webContents.on('did-finish-load', () => {
        win.webContents.print({
          silent: true,
          deviceName: config.connectionPath || 'POSPrinter POS80',
          margins: { marginType: 'none' },
          pageSize: { width: 80000, height: 200000 }
        }, (success, errorType) => {
          win.close();
          if (success) {
            resolve({ success: true, message: 'Printed successfully' });
          } else {
            console.error(`Print failed: ${errorType}`);
            resolve({ success: false, error: errorType });
          }
        });
      });
    } catch (e: any) {
      console.error('Print window exception:', e);
      resolve({ success: false, error: e.message });
    }
  });
}

function printMockProductReport(data: ProductReportData) {
  const line = '------------------------------------------';
  const now = new Date().toLocaleString();
  
  let reportText = '';
  reportText += `${line}\n`;
  reportText += `      PRODUCT DETAILS REPORT\n`;
  reportText += `         تقرير تفاصيل المنتج\n`;
  reportText += `${line}\n`;
  reportText += `Name (AR):                 ${data.nameAr}\n`;
  reportText += `Name (EN):                 ${data.nameEn}\n`;
  if (data.nameKu) {
    reportText += `Name (KU):                 ${data.nameKu}\n`;
  }
  reportText += `Barcode:                   ${data.barcode || '-'}\n`;
  reportText += `SKU:                       ${data.sku || '-'}\n`;
  reportText += `Category:                  ${data.category}\n`;
  reportText += `${line}\n`;
  reportText += `      PRICING & STOCK / الأسعار والمخزون\n`;
  reportText += `${line}\n`;
  reportText += `Cost Price:                ${Math.round(data.cost).toLocaleString()} IQD\n`;
  reportText += `Sale Price:                ${Math.round(data.price).toLocaleString()} IQD\n`;
  reportText += `Current Stock:             ${data.stock}\n`;
  reportText += `Min Stock Level:           ${data.minStock}\n`;
  reportText += `${line}\n`;
  reportText += `      SALES PERFORMANCE / أداء المبيعات\n`;
  reportText += `${line}\n`;
  reportText += `Total Units Sold:          ${data.totalUnitsSold}\n`;
  reportText += `Total Revenue:             ${Math.round(data.totalRevenue).toLocaleString()} IQD\n`;
  reportText += `Total Cost:                ${Math.round(data.totalCost).toLocaleString()} IQD\n`;
  reportText += `Net Profit:                ${Math.round(data.netProfit).toLocaleString()} IQD\n`;
  reportText += `Profit Margin:             ${data.profitMargin.toFixed(1)}%\n`;
  reportText += `${line}\n`;
  reportText += `Generated At:              ${now}\n`;
  reportText += `            KODIFY SYSTEM\n`;
  reportText += `${line}\n`;

  try {
    const outputDir = path.join(process.cwd(), 'mock_hardware_outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputPath = path.join(outputDir, `product_report_${data.sku || 'report'}.txt`);
    fs.writeFileSync(outputPath, reportText, 'utf-8');
    fs.writeFileSync(path.join(outputDir, 'latest_product_report.txt'), reportText, 'utf-8');
    
    console.log(`[Mock Printer] Product report printed to: ${outputPath}`);
    return { success: true, path: outputPath, reportText };
  } catch (error: any) {
    console.error('Failed to write mock product report:', error);
    return { success: false, error: error.message };
  }
}
