import * as _ from 'lodash';
import { Payment } from './payments';


export interface Parcel {
  companyId: string;
  sectionId: string;
  number: number;
  cityId: string;
  areaType: string;
  areaSurface: number;
  trenches: Numbered[];
  drainages: Numbered[];
  appliances: Appliance[];
  membership: boolean;
  membershipActive: boolean;
  legalBasis: string;
  SwMembershipStartDate: string;
  SwMembershipTerminationDate: string;
  foremanDecisions: ForemanDecision[];
  id: string;
}

export interface Numbered {
  number: string;
}

export function emptyNumbered() {
  return {
    number: null
  };
}

export interface Appliance {
  numbering: number;
  applianceType: string;
  applianceDescription: string;
}

export function emptyAppliance(): Appliance {
  return {
    numbering: null,
    applianceType: null,
    applianceDescription: null,
  };
}

export interface ForemanDecision {
  decisionNumber: number;
  decisionDate: string;
  payment: number;
  paymentDate: string;
}

export function emptyForemanDecision(): ForemanDecision {
  return {
    decisionNumber: null,
    decisionDate: null,
    payment: null,
    paymentDate: null
  };
}


export function emptyParcel(): Parcel {
  return {
    companyId: null,
    cityId: null,
    sectionId: null, number: null, areaType: null, areaSurface: null, trenches: [],
    drainages: [], appliances: [], membership: true, membershipActive: true,
    legalBasis: null, SwMembershipStartDate: null, SwMembershipTerminationDate: null,
    foremanDecisions: [], id: null
  };
}
