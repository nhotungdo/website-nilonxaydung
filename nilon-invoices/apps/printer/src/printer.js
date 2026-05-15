const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const ptp = require('pdf-to-printer');
const { updateOrderStatus, log } = require('./database');

async function generateAndPrint(order) {
  try {
    log(`Generating PDF for ${order.orderCode}...`);
    
    // Create an invisible window to render the invoice
    let win = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Path to the HTML template
    const templatePath = path.join(__dirname, 'views/invoice.html');
    
    // Read template and replace placeholders (simple way)
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Replace logic
    html = html.replace('{{orderCode}}', order.orderCode);
    html = html.replace('{{customerName}}', order.customerName);
    html = html.replace('{{phone}}', order.phone);
    html = html.replace('{{address}}', order.address);
    html = html.replace('{{totalAmount}}', order.totalAmount.toLocaleString('vi-VN'));
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.productName}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toLocaleString('vi-VN')}đ</td>
        <td>${(item.quantity * item.price).toLocaleString('vi-VN')}đ</td>
      </tr>
    `).join('');
    
    html = html.replace('{{items}}', itemsHtml);
    html = html.replace('{{date}}', new Date().toLocaleString('vi-VN'));

    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

    const pdfPath = path.join(__dirname, `../temp/invoice_${order.orderCode}.pdf`);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, '../temp'))) {
      fs.mkdirSync(path.join(__dirname, '../temp'));
    }

    // Generate PDF
    const data = await win.webContents.printToPDF({
      printBackground: true,
      marginsType: 1, // No margins
      pageSize: 'A4'
    });

    fs.writeFileSync(pdfPath, data);
    log(`PDF saved: ${pdfPath}`);
    
    win.close();

    // Auto Print
    log(`Sending ${order.orderCode} to printer...`);
    await ptp.print(pdfPath);
    
    log(`Order ${order.orderCode} printed successfully`);
    updateOrderStatus(order.orderCode, 'printed');

  } catch (error) {
    console.error('Print Error:', error);
    log(`Print Error for ${order.orderCode}: ${error.message}`, 'error');
    updateOrderStatus(order.orderCode, 'failed');
  }
}

module.exports = { generateAndPrint };
