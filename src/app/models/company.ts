import { Address } from "./address";
import { Leesee } from './leesee';
import { Parcel } from './parcel';
import { Resolution } from './resolution';

export interface Company {
  name: string;
  nip: string;
  email: string;
  phone: string;
  address: Address;
  lastPayment?: number;
  parcels: Parcel[];
  leesees: Leesee[];
  resolutions: Resolution[];
}


export function sanitizeNip(nip: string): string {
  if (nip) {
    return nip.replace(/\D/, '');
  } else {
    return nip;
  }
}
