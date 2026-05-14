const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options?.headers },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Lỗi kết nối' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (body: Record<string, string>) =>

    request<{ success: boolean; data: LoginResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => request<{ success: boolean; data: DashboardStats }>('/dashboard/stats'),
  getRevenueChart: () =>
    request<{ success: boolean; data: RevenueChartPoint[] }>('/dashboard/revenue-chart'),
  getTopProducts: () =>
    request<{ success: boolean; data: TopProduct[] }>('/dashboard/top-products'),
  getOrderStatusCounts: () =>
    request<{ success: boolean; data: OrderStatusCount[] }>('/dashboard/order-status'),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ success: boolean; data: Product[] }>(`/products${q}`);
  },
  search: (query: string) => {
    return request<{ success: boolean; data: Product[] }>(`/products/search?q=${encodeURIComponent(query)}`);
  },
  getLowStock: () => request<{ success: boolean; data: Product[] }>('/products/low-stock'),
  getOne: (id: string) => request<{ success: boolean; data: Product }>(`/products/${id}`),
  create: (body: Partial<Product>) =>
    request<{ success: boolean; data: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Partial<Product>) =>
    request<{ success: boolean; data: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    request<{ success: boolean; data: null }>(`/products/${id}`, { method: 'DELETE' }),
};

// ─── Customers ────────────────────────────────────────────────────────────────

export const customersApi = {
  getAll: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ success: boolean; data: Customer[] }>(`/customers${q}`);
  },
  search: (query: string) => {
    return request<{ success: boolean; data: Customer[] }>(`/customers/search?q=${encodeURIComponent(query)}`);
  },
  getOne: (id: string) => request<{ success: boolean; data: Customer }>(`/customers/${id}`),
  create: (body: Partial<Customer>) =>
    request<{ success: boolean; data: Customer }>('/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Partial<Customer>) =>
    request<{ success: boolean; data: Customer }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    request<{ success: boolean; data: null }>(`/customers/${id}`, { method: 'DELETE' }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  getAll: (search?: string, status?: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    const q = params.toString() ? `?${params}` : '';
    return request<{ success: boolean; data: Order[] }>(`/orders${q}`);
  },
  getRecent: (limit = 5) =>
    request<{ success: boolean; data: Order[] }>(`/orders/recent?limit=${limit}`),
  getOne: (id: string) => request<{ success: boolean; data: Order }>(`/orders/${id}`),
  create: (body: {
    customerId: string;
    items: { productId: string; quantity: number }[];
    notes?: string;
  }) =>
    request<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateStatus: (id: string, status: string) =>
    request<{ success: boolean; data: Order }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  remove: (id: string) =>
    request<{ success: boolean; data: null }>(`/orders/${id}`, { method: 'DELETE' }),
};

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const invoicesApi = {
  getAll: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ success: boolean; data: Invoice[] }>(`/invoices${q}`);
  },
  getStats: () =>
    request<{ success: boolean; data: InvoiceStats }>('/invoices/stats'),
  getOne: (id: string) => request<{ success: boolean; data: Invoice }>(`/invoices/${id}`),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  getProfile: () => request<{ success: boolean; data: User }>('/users/profile'),
  updateProfile: (body: { fullName?: string; email?: string; phone?: string }) =>
    request<{ success: boolean; data: User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  changePassword: (body: { oldPass: string; newPass: string }) =>
    request<{ success: boolean; message: string }>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalInvoices: number;
  todayOrders: number;
  todayRevenue: number;
  totalRevenue: number;
  lowStockProducts: number;
}

export interface RevenueChartPoint {
  name: string;
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  totalSold: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock: number;
  unit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxCode?: string;
  createdAt: string;
  _count?: { orders: number };
}

export interface Order {
  id: string;
  orderCode: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  total: number;
  totalItems: number;
  totalQuantity: number;
  note?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; phone?: string; email?: string; address?: string };
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot?: string;
  priceSnapshot: number;
  quantity: number;
  subtotal: number;
  product?: { id: string; name: string };
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'VOID';
  totalAmount: number;
  issueDate: string;
  dueDate?: string;
  pdfUrl?: string;
  order: {
    id: string;
    orderCode: string;
    customer: { id: string; name: string };
    items?: OrderItem[];
  };
}

export interface InvoiceStats {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}
