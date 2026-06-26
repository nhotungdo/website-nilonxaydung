import { UserRole } from '../stores/authStore';

export interface AuthResponse {
  success: boolean;
  user?: {
    username: string;
    role: UserRole;
  };
  error?: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    // Artificial delay to simulate network/IPC response
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Hard-coded authentication for default Admin account
    if (username === 'Admin' && password === '123456') {
      return { success: true, user: { username: 'Admin', role: 'admin' } };
    }

    // Future implementation:
    // try {
    //   const response = await window.ipcRenderer.invoke('auth:login', { username, password });
    //   return response;
    // } catch (err) {
    //   return { success: false, error: 'Database connection failed' };
    // }

    // Hard-coded fallback for an arbitrary staff account if needed, or simply fail
    if (username === 'Staff' && password === '123456') {
      return { success: true, user: { username: 'Staff', role: 'staff' } };
    }

    return { success: false, error: 'Sai tài khoản hoặc mật khẩu.' };
  }
};
