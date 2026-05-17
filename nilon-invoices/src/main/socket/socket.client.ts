import { io, Socket } from 'socket.io-client';
import { db } from '../database/sqlite';
import IPC_CHANNELS from '../../shared/events';
import { BrowserWindow } from 'electron';
import { invoiceService } from '../services/invoice.service';

class SocketClient {
  private socket: Socket | null = null;
  private isConnected = false;

  constructor() {}

  /**
   * Spawns Socket.IO connection based on dynamic database configs
   */
  public connect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    // 1. Read configs from local SQLite settings store
    const getSetting = (key: string): string => {
      const row = db.prepare('SELECT setting_value FROM app_settings WHERE setting_key = ?').get(key) as { setting_value: string } | undefined;
      return row ? row.setting_value : '';
    };

    const apiUrl = getSetting('api_url') || 'http://localhost:3000';
    const branchId = getSetting('branch_id');
    const apiKey = getSetting('api_key');

    console.log(`[SocketClient] Connecting to NestJS API at: ${apiUrl} (Branch: ${branchId})`);

    // 2. Instantiate Socket.io connection with auth handshakes
    this.socket = io(apiUrl, {
      auth: {
        token: apiKey,
        branchId: branchId,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.registerEvents();
  }

  /**
   * Registers Webhook/Real-time socket events
   */
  private registerEvents(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[SocketClient] Connected to cloud NestJS backend API.');
      this.isConnected = true;
      this.notifyStatusChange('CONNECTED');
      
      // Update SQLite online status cache
      db.prepare("UPDATE app_settings SET setting_value = 'true' WHERE setting_key = 'is_online'").run();
      
      // Join branch specific room
      const branchId = db.prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'branch_id'").get() as { setting_value: string };
      if (branchId) {
        this.socket?.emit('join:branch', branchId.setting_value);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`[SocketClient] Disconnected from server: ${reason}`);
      this.isConnected = false;
      this.notifyStatusChange('DISCONNECTED');
      
      // Update SQLite offline status cache
      db.prepare("UPDATE app_settings SET setting_value = 'false' WHERE setting_key = 'is_online'").run();
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketClient] Connection handshake error:', error.message);
      this.isConnected = false;
      this.notifyStatusChange('ERROR');
    });

    // 3. Main Real-time Order Reception Hook
    this.socket.on('order:created', async (orderPayload: any) => {
      console.log('[SocketClient] Received real-time order alert event:', orderPayload.orderCode || orderPayload.id);
      
      // Play new order sound alert in Renderer Process
      this.emitToRenderer(IPC_CHANNELS.SOCKET.ON_NEW_ORDER, orderPayload);

      try {
        // Run full Print/Download pipeline
        await invoiceService.processIncomingOrder(orderPayload);
      } catch (err: any) {
        console.error('[SocketClient] Failed to process received real-time order:', err.message);
      }
    });
  }

  /**
   * Disconnects current active session
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }

  public getStatus(): 'CONNECTED' | 'DISCONNECTED' | 'ERROR' {
    return this.isConnected ? 'CONNECTED' : 'DISCONNECTED';
  }

  private notifyStatusChange(status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'): void {
    this.emitToRenderer(IPC_CHANNELS.SOCKET.ON_STATUS_CHANGE, status);
  }

  private emitToRenderer(channel: string, data: any): void {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
      win.webContents.send(channel, data);
    });
  }
}

export const socketClient = new SocketClient();
export default socketClient;
