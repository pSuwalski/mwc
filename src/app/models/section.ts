import { Parcel } from './parcel';

export interface Section {
  companyId: string;
  evidenceNumber: number;
  name: string;
  areaType: areaType;
  parcels: Parcel[];
  id: string;
}

enum areaType {
  wojewodztwo = 'Województwo',
  powiat = 'Powiat',
  gmina = 'Gmina',
  miasto = 'Miasto',
  wioska = 'Wioska',
  solectwo = 'Sołectwo',
  zlewnia = 'Zlewnia',
  inne = 'Inne'
}

export function emptySection(): Section {
  return {
    companyId: null, areaType: null, evidenceNumber: null, name: null, parcels: null, id: null
  };
}
