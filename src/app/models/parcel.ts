import * as _ from 'lodash';

export interface Parcel {
  sectionId: string;
  number: number;
  areaType: string;
  areaSurface: number;
  trench: boolean;
  yearNumber: number;
  drainage: boolean;
  numbering: number;
  applianceType: string;
  applianceDescription: string;
  membership: boolean;
  membershipActive: boolean;
  legalBasis: string;
  SwMembershipStartDate: string;
  SwMembershipTerminationDate: string;
  foremanDecisions: ForemanDecision[];
}

export interface ForemanDecision {
  decisionNumber: number;
  decisionDate: string;
}
