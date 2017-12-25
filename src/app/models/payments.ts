export interface FinancialRecord {
  id: string;
  value: number;
  type: 'payment' | 'additionalCosts' | 'cancelation';
  date: string;
  forYear: number;
}


export interface Payment extends FinancialRecord {
  type: 'payment';
  from: 'account' | 'postalOrder' | 'cash';
  for: 'capital' | 'costs' | 'interests' | 'everything';
}


export interface AdditionalCosts extends FinancialRecord {
  type: 'additionalCosts';
}

export interface Cancelation extends FinancialRecord {
  type: 'cancelation';
  for: 'capital' | 'costs' | 'interests' | 'everything';
  reason: string;
}


export function emptyCancelation(): Cancelation {
  return {
    id: null,
    value: null,
    type: null,
    for: null,
    date: null,
    reason: null,
    forYear: null
  };
}

export function emptyPayment(): Payment {
  return {
    id: null,
    value: null,
    type: null,
    for: null,
    date: null,
    from: null,
    forYear: null
  };
}

export function emptyAdditionalCosts(): AdditionalCosts {
  return {
    id: null,
    value: null,
    type: null,
    forYear: null,
    date: null
  };
}
