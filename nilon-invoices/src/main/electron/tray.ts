import { Tray, Menu, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { getMainWindow } from './window';

let trayInstance: Tray | null = null;

export const createSystemTray = (): Tray | null => {
  if (trayInstance) return trayInstance;
  
  // Resolve system tray icon asset pathing cleanly
  const candidates = [
    path.resolve(__dirname, '../../src/assets/icons/icon.png'),
    path.resolve(__dirname, '../src/assets/icons/icon.png'),
    path.join(process.resourcesPath, 'src/assets/icons/icon.png'),
    path.join(process.resourcesPath, 'app.asar/src/assets/icons/icon.png'),
    path.resolve(__dirname, '../../build/icon.png')
  ];

  const iconPath = candidates.find(p => fs.existsSync(p));

  if (!iconPath) {
    console.warn('[Tray] App icon not found in candidate paths. Skipping system tray creation.');
    return null;
  }

  try {
    trayInstance = new Tray(iconPath);
  } catch (err) {
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
      } else {
        win.show();
        win.focus();
      }
    }
  });

  return trayInstance;
};

export const getTray = (): Tray | null => trayInstance;
export default createSystemTray;
