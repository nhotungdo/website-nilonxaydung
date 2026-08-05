import { create } from 'zustand';

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PRINT' | 'SYSTEM' | 'UPDATE';
  level: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  addNotification: (noti: Omit<INotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
}

const initialNotifications: INotification[] = [
  {
    id: 'n_1',
    title: 'Đơn hàng mới từ Website',
    message: 'Đơn hàng mới #DH-9921 từ Nguyễn Văn Nam - Tự động đẩy in K80',
    type: 'ORDER',
    level: 'success',
    timestamp: 'Vừa xong',
    read: false,
    link: '/orders'
  },
  {
    id: 'n_2',
    title: 'Hệ thống tự động in sẵn sàng',
    message: 'Máy in nhiệt Xprinter XP-K80 đã hoàn tất khởi tạo Spooler queue',
    type: 'PRINT',
    level: 'info',
    timestamp: '5 phút trước',
    read: false,
    link: '/printers'
  },
  {
    id: 'n_3',
    title: 'Đồng bộ kết nối Máy chủ',
    message: 'Đã thiết lập kết nối thời gian thực Socket.IO tới hệ thống trung tâm',
    type: 'SYSTEM',
    level: 'info',
    timestamp: '12 phút trước',
    read: true,
    link: '/settings'
  }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter(n => !n.read).length,

  addNotification: (noti) => {
    const newNoti: INotification = {
      ...noti,
      id: `noti_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Vừa xong',
      read: false
    };
    const updated = [newNoti, ...get().notifications];
    set({
      notifications: updated,
      unreadCount: updated.filter(n => !n.read).length
    });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  markAsRead: (id) => {
    const updated = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    set({
      notifications: updated,
      unreadCount: updated.filter(n => !n.read).length
    });
  }
}));
