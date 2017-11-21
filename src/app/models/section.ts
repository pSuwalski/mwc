import { Parcel } from './parcel';

export interface Section {
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
