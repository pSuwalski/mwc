export interface Resolution {
  companyId: string;
  sectionId: string;
  parcelId: string;
  year: number;
  number: number;
  date: string;
  paymentCount: number;
  payments: Payment[];
  paymentMoreOneHour: number;
  paymentLessOneHour: number;
  id: string;
  wholeCompany?: boolean;
}

export interface Payment {
  paymentDate: number;
  paymentPercent: number;
}

export function emptyPayment() {
  return {
    paymentDate: null,
    paymentPercent: null
  };
}

export function emptyResolution(): Resolution {
  return {
    companyId: null, sectionId: null, year: null, number: null, date: null,
    paymentCount: null, payments: [], paymentMoreOneHour: null,
    paymentLessOneHour: null, id: null, parcelId: null,
  };
}
