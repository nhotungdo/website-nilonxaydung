import { app, BrowserWindow, shell } from 'electron';
import path from 'path';

export let mainWindow: BrowserWindow | null = null;

export const createMainWindow = (): BrowserWindow => {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    title: 'Nilon Invoices - Thermal Autoprint Client',
    backgroundColor: '#070a13', // Match premium deep slate CSS background
    show: false, // Prevent white screen flashing during initialization
    frame: true, // Standard native frame, can be customized later
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  // Load appropriate React resource
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const fs = require('fs');
    const path1 = path.join(__dirname, '../renderer/index.html');
    const path2 = path.join(__dirname, '../renderer/src/renderer/index.html');
    
    if (fs.existsSync(path1)) {
      mainWindow.loadFile(path1);
    } else if (fs.existsSync(path2)) {
      mainWindow.loadFile(path2);
    } else {
      console.error('[Electron Window Error] Could not find index.html at:', path1, 'or', path2);
    }
  }


  // Graceful visual fade-in
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Open external links inside OS native default browser instead of the Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('close', (e) => {
    // In production, minimize to background system tray instead of closing completely
    if (process.platform === 'win32') {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
};

export const getMainWindow = (): BrowserWindow | null => mainWindow;
