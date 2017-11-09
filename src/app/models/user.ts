export interface User {
  email: string;
  name: string;
  companyName: string;
  companyId: string;
  phone?: string;
  id?: string;
  role?: 'basic' | 'companyAdmin' | 'editor' | 'admin';
}
