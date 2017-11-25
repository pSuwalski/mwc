export interface Resolution {
    companyId: string;
    year: number;
    number: number;
    date: string;
    paymentCount: number;
    payments: Payment[];
    paymentMoreOneHour: number;
    paymentLessOneHour: number;
    id: string;
}

export interface Payment {
  paymentDate: number;
  paymentPercent: number;
}

export const emptyPayment = {
  paymentDate: null,
  paymentPercent: null
};

export const emptyResolution: Resolution = {
  companyId: null, year: null, number: null, date: null,
  paymentCount: null, payments: [], paymentMoreOneHour: null,
  paymentLessOneHour: null, id: null
};
