export interface FinancialRecord {
  value: number;
  type: 'payment' | 'additionalCosts' | 'cancelation';
  for: 'capital' | 'costs' | 'interests';
  date: string;
}


export interface Payment extends FinancialRecord {
  type: 'payment';
  from: 'account' | 'postalOrder' | 'cash';
  forYear: number;
}


export interface AdditionalCosts extends FinancialRecord {
  type: 'additionalCosts';
}

export interface Cancelation extends FinancialRecord {
  type: 'cancelation';
  for: 'capital' | 'costs' | 'interests';
}
