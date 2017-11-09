import { Address } from "./address";

export interface Company {
  name: string;
  nip: string;
  email: string;
  phone: string;
  address: Address;
  lastPayment?: number;
}


export function sanitizeNip(nip: string): string {
  if (nip) {
    return nip.replace(/\D/, '');
  } else {
    return nip;
  }
}
