import { Address, emptyAddress } from "./address";
import { FinancialRecord } from "./payments";

export class Owner {
  personalData: PersonalData;
  contactData: ContactData;
  authData: AuthData[];
  id: string;
  historicSaldo: Saldo;
  saldo?: Saldo;
  parcelsData?: ParcelDataFull[];
  payments?: FinancialRecord[];
  notes?: Note[];
}

export interface Note {
  id: string;
  text: string;
  date: string;
}

export function emptyNote(): Note {
  return {
    id: null,
    text: null,
    date: null
  };
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
  companyId?: string;
  sectionId?: string;
  id: string;
}

export interface ParcelDataFull extends ParcelData {
  percent: number;
  from: string;
  to: string;
}

export function emptyParcelData(): ParcelData {
  return {
    id: null
  };
}

export function emptyParcelDataFull(): ParcelDataFull {
  return {
    id: null,
    percent: null,
    sectionId: null,
    companyId: null,
    from: null,
    to: null
  };
}
