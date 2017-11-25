import * as _ from 'lodash';
import { Tree } from '@angular/router/src/utils/tree';

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

export const emptyNumbered = {
  number: null
};

export interface Appliance {
  numbering: number;
  applianceType: string;
  applianceDescription: string;
}

export const emptyAppliance: Appliance = {
  numbering: null,
  applianceType: null,
  applianceDescription: null,
};

export interface ForemanDecision {
  decisionNumber: number;
  decisionDate: string;
}

export const emptyForemanDecision: ForemanDecision = {
  decisionNumber: null,
  decisionDate: null
};


export const emptyParcel: Parcel = {
  companyId: null,
  cityId: null,
  sectionId: null, number: null, areaType: null, areaSurface: null, trenches: [],
  drainages: [], appliances: [], membership: true, membershipActive: true,
  legalBasis: null, SwMembershipStartDate: null, SwMembershipTerminationDate: null,
  foremanDecisions: [{
    decisionNumber: null,
    decisionDate: null
  }], id: null
};
