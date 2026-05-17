import { BrowserWindow, shell } from 'electron';
import path from 'path';
export let mainWindow = null;
export const createMainWindow = () => {
    const isDev = process.env.NODE_ENV !== 'production';
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
    if (isDev) {
        const devUrl = process.env.VITE_DEV_SERVER_URL;
        if (devUrl) {
            mainWindow.loadURL(`${devUrl}src/renderer/index.html`);
        }
        else {
            mainWindow.loadURL('http://localhost:5173/src/renderer/index.html');
        }
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
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
export const getMainWindow = () => mainWindow;
