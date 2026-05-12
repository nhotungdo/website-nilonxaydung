export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
