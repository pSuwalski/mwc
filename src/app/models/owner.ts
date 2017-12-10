import { Address, emptyAddress } from "./address";

export class Owner {
  personalData: PersonalData;
  contactData: ContactData;
  authData: AuthData[];
  id: string;
  historicSaldo: Saldo;
  saldo?: Saldo;
  parcelsData?: ParcelData[];
}

export interface PersonalData {
  type: 'person' | 'company';
  evidenceNumber: number;
  name: string;
  surname?: string;
  pesel?: number;
  address: Address;
  krs?: number;
  nip?: number;
  regon?: number;
}

export function emptyOwnerPersonal(): PersonalData {
  return {
    evidenceNumber: null, krs: null, name: null, nip: null, pesel: null,
    regon: null, surname: null, type: 'person', address: emptyAddress()
  };
}


export interface ContactData {
  address: Address;
  email: string;
  deskPhoneNumber: number;
  cellPhoneNumber: number;
}

export function emptyOwnerContact(): ContactData {
  return {
    cellPhoneNumber: null, deskPhoneNumber: null, email: null, address: emptyAddress()
  };
}

export interface AuthData {
  name: string;
  surname?: string;
  pesel: number;
  phoneNumber: number;
  email: string;
  correspondenceAddress: Address;
  authScope: string;
  validFrom: string;
  validTill: string;
}


export function emptyOwnerAuth(): AuthData {
  return {
    authScope: null, correspondenceAddress: emptyAddress(), email: null, name: null, surname: null, pesel: null,
    phoneNumber: null, validFrom: null, validTill: null
  };
}


export interface Saldo {
  capital: number;
  interest: number;
  costs: number;
  untilDate?: string;
}

export function emptySaldo(): Saldo {
  return {
    capital: null,
    interest: null,
    costs: null
  };
}

export interface ParcelData {
  id: string;
  percent?: number;
  companyId?: string;
  sectionId?: string;
  from?: string;
  to?: string;
}

export function emptyParcelData(): ParcelData {
  return {
    id: null,
    percent: null,
    from: null
  };
}
