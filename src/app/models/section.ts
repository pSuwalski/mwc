import { Parcel } from './parcel';

export interface Section {
  companyId: string;
  evidenceNumber: number;
  name: string;
  areaType: areaType;
  parcels: Parcel[];
}

enum areaType {
  wojewodztwo = 'województwo',
  powiat = 'powiat',
  gmina = 'gmina',
  miasto = 'miasto',
  wioska = 'wioska',
  solectwo = 'sołectwo',
  zlewnia = 'zlewnia',
  inne = 'inne'
}

export const emptySection: Section = {
  companyId: null, areaType: null, evidenceNumber: null, name: null, parcels: null
};
