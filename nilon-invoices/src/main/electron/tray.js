import { Tray, Menu, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { getMainWindow } from './window';
let trayInstance = null;
export const createSystemTray = () => {
    if (trayInstance)
        return trayInstance;
    const isDev = process.env.NODE_ENV !== 'production';
    // Resolve system tray icon asset pathing
    const iconPath = isDev
        ? path.resolve(__dirname, '../../src/assets/icons/icon.png')
        : path.join(process.resourcesPath, 'src/assets/icons/icon.png');
    if (!fs.existsSync(iconPath)) {
        console.warn(`[Tray] App icon not found at: ${iconPath}. Skipping system tray creation.`);
        return null;
    }
    try {
        trayInstance = new Tray(iconPath);
    }
    catch (err) {
        console.warn('[Tray] Failed to instantiate system tray:', err);
        return null;
    }
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Restore Dashboard',
            click: () => {
                const win = getMainWindow();
                if (win) {
                    win.show();
                    win.focus();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Printer Status: Online',
            enabled: false,
        },
        { type: 'separator' },
        {
            label: 'Shutdown Client',
            click: () => {
                // Prevent background cancellation and force app termination
                const win = getMainWindow();
                if (win) {
                    win.destroy();
                }
                app.quit();
            }
        }
    ]);
    trayInstance.setToolTip('Nilon Invoices - Thermal Autoprinter');
    trayInstance.setContextMenu(contextMenu);
    // Click tray icon directly to restore/hide UI easily
    trayInstance.on('double-click', () => {
        const win = getMainWindow();
        if (win) {
            if (win.isVisible()) {
                win.hide();
            }
            else {
                win.show();
                win.focus();
            }
        }
    });
    return trayInstance;
};
export const getTray = () => trayInstance;
export default createSystemTray;
