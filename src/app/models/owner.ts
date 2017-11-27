export class Owner {
  personalData: PersonalData;
  contactData: ContactData;
  authData: AuthData[];
  id: string;
  historicSaldo: Saldo;
  saldo?: Saldo;
  parcelsData?:  ParcelData[];
}

export interface PersonalData {
  type: 'person' | 'company';
  evidenceNumber: number;
  name: string;
  surname?: string;
  pesel?: number;
  postalCode: string;
  city: string;
  street: string;
  number: number;
  krs?: number;
  nip?: number;
  regon?: number;
}

export function emptyOwnerPersonal(): PersonalData {
  return {
    city: null, evidenceNumber: null, krs: null, name: null, nip: null, number: null, pesel: null,
    postalCode: null, regon: null, street: null, surname: null, type: 'person'
  };
}


export interface ContactData {
  postalCode: number;
  city: string;
  street: string;
  number: number;
  email: string;
  deskPhoneNumber: number;
  cellPhoneNumber: number;
}

export function emptyOwnerContact(): ContactData {
  return {
    cellPhoneNumber: null, city: null, deskPhoneNumber: null, email: null, number: null,
    postalCode: null, street: null
  };
}

export interface AuthData {
  nameSurname: string;
  pesel: number;
  phoneNumber: number;
  email: string;
  correspondenceAddress: string;
  authScope: string;
  validFrom: string;
  validTill: string;
}


export function emptyOwnerAuth(): AuthData {
  return {
    authScope: null, correspondenceAddress: null, email: null, nameSurname: null, pesel: null,
    phoneNumber: null, validFrom: null, validTill: null
  };
}


export interface Saldo {
  capital: number;
  interest: number;
  costs: number;
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
  percent: number;
  companyId?: string;
  sectionId?: string;
}

export function emptyParcelData(): ParcelData {
  return {
    id: null,
    percent: null
  };
}
