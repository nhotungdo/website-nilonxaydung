const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { startServer } = require('./server');
const { generateAndPrint } = require('./printer');
const { db } = require('./database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'Nilon Printer Dashboard'
  });

  mainWindow.loadFile(path.join(__dirname, 'views/index.html'));
  
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // Start Express API Server
  startServer(5000);

  // Global function to trigger printing from API
  global.printOrder = (order) => {
    generateAndPrint(order);
    if (mainWindow) {
      mainWindow.webContents.send('new-order', order);
    }
  };

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for UI
ipcMain.handle('get-stats', async () => {
  const total = db.prepare('SELECT COUNT(*) as count FROM print_orders').get();
  const printed = db.prepare("SELECT COUNT(*) as count FROM print_orders WHERE status = 'printed'").get();
  const failed = db.prepare("SELECT COUNT(*) as count FROM print_orders WHERE status = 'failed'").get();
  const recentOrders = db.prepare('SELECT * FROM print_orders ORDER BY createdAt DESC LIMIT 10').all();
  const logs = db.prepare('SELECT * FROM logs ORDER BY createdAt DESC LIMIT 20').all();

  return {
    total: total.count,
    printed: printed.count,
    failed: failed.count,
    recentOrders,
    logs
  };
});
