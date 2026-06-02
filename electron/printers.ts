import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';

// Interface for print data
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

function generateReceiptHtml(data: PrintReceiptData): string {
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
          width: 270px;
          margin: 0;
          padding: 10px 15px 80px 15px;
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
        <div style="font-size: 11px; font-weight: 600; color: #444; letter-spacing: 3px; margin-top: 2px;">1OF1</div>
      </div>
      <div class="text-center">${data.storeAddress}</div>
      <div class="text-center">Tel: 0750 101 0964</div>
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
                <span style="text-decoration: line-through; color: #888;">Original: ${originalPrice.toFixed(2)}</span>
                <span>Disc: -${(itemDiscount / item.qty).toFixed(2)} (${discountPercent}%)</span>
              </div>
            `;
          }

          return `
            <div class="item-row">
              <div class="item-name">${item.name}</div>
              <div class="item-details">
                <span>${item.qty} x ${item.price.toFixed(2)}</span>
                <span class="bold">${item.total.toFixed(2)}</span>
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
          <td class="text-right">${data.subtotal.toFixed(2)}</td>
        </tr>
        ${data.discountAmount > 0 ? `
        <tr>
          <td class="text-left">Discount:</td>
          <td class="text-right">-${data.discountAmount.toFixed(2)}</td>
        </tr>
        ` : ''}
        <tr class="bold" style="font-size: 12px;">
          <td class="text-left">Total:</td>
          <td class="text-right">${data.total.toFixed(2)}</td>
        </tr>
        <tr>
          <td class="text-left">Received:</td>
          <td class="text-right">${data.cashReceived.toFixed(2)}</td>
        </tr>
        <tr>
          <td class="text-left">Change:</td>
          <td class="text-right">${data.cashReturned.toFixed(2)}</td>
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

export async function printShiftReport(data: ShiftReportData, config: { mockMode: boolean }) {
  if (config.mockMode) {
    return printMockShiftReport(data);
  }
  return { success: true };
}

// Generates a text file representation of the printed receipt for verification
function printMockReceipt(data: PrintReceiptData) {
  const line = '------------------------------------------';
  
  let receiptText = '';
  receiptText += `${line}\n`;
  receiptText += `      *** 101 COSMETICS ***\n`;
  receiptText += `             *** 1OF1 ***\n`;
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
    const priceStr = item.price.toFixed(2).padStart(8, ' ');
    const totalStr = item.total.toFixed(2).padStart(8, ' ');
    receiptText += `${nameLimit}${qtyStr}${priceStr}${totalStr}\n`;

    const itemDiscount = item.discount || 0;
    const originalPrice = item.originalPrice ?? item.price;
    const hasDiscount = itemDiscount > 0 && originalPrice > item.price;
    if (hasDiscount) {
      const discountPercent = Math.round((itemDiscount / (originalPrice * item.qty)) * 100);
      receiptText += `  [Original: ${originalPrice.toFixed(2)} | Disc: -${(itemDiscount / item.qty).toFixed(2)} (${discountPercent}%)]\n`;
    }
  });

  receiptText += `${line}\n`;
  receiptText += `Subtotal:                  ${data.subtotal.toFixed(2)} IQD\n`;
  receiptText += `VAT:                       ${data.taxAmount.toFixed(2)} IQD\n`;
  if (data.discountAmount > 0) {
    receiptText += `Discount:                 -${data.discountAmount.toFixed(2)} IQD\n`;
  }
  receiptText += `TOTAL:                     ${data.total.toFixed(2)} IQD\n`;
  receiptText += `${line}\n`;
  receiptText += `Payment Method:            ${data.paymentMethod}\n`;
  receiptText += `Cash Received:             ${data.cashReceived.toFixed(2)} IQD\n`;
  receiptText += `Change Due:                ${data.cashReturned.toFixed(2)} IQD\n`;
  
  if (data.headerNote) receiptText += `\n${data.headerNote}\n`;
  if (data.footerNote) receiptText += `\n${data.footerNote}\n`;
  receiptText += `${line}\n`;
  receiptText += `               Thank You\n`;
  receiptText += `${line}\n`;
  receiptText += `            SYSTEM BY KODIFY\n`;
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
