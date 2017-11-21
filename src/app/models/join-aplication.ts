import { User } from './user';
import { Company } from './company';

export interface JoinApplication {
  user: User;
  password: string;
  company: Company;
}

export function createEmptyJoinApplication(): JoinApplication {
  const user: User = {
    name: null,
    phone: null,
    email: null,
    companyName: null,
    companyId: null
  };
  const company: Company = {
    name: null,
    nip: null,
    email: null,
    phone: null,
    address: {
      streetAndNumber: null,
      postCode: null,
      city: null
    },
    lastPayment: null,
    leesees: null,
    parcels: null,
    resolutions: null
  };
  return {
    user,
    company,
    password: null
  };
}

export function acceptJoinApplication() { }

export function applyJoinApplication() { }

export function declineJoinApplication() { }
