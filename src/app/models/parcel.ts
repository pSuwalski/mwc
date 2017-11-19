import * as _ from 'lodash';

export interface Parcel {
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
  legalBasis: string;
  SwMembershipStartDate: string;
  SwMembershipTerminationDate: string;
  foremanDecision: boolean;
  decisionNumber: number;
  decisionDate: string;
}

