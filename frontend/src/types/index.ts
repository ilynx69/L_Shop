export interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  phone: string;
}

export interface DeliveryFormData {
  address: string;
  phone: string;
  email: string;
  paymentMethod: 'card' | 'cash';
}