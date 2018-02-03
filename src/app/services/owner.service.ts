import { Saldo } from '../models/owner';
import { Resolution } from '../models/resolution';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import {
  AuthData,
  ContactData,
  emptyOwnerAuth,
  emptyOwnerContact,
  emptyOwnerPersonal,
  emptyParcelData,
  emptyParcelDataFull,
  emptySaldo,
  Owner,
  PersonalData,
  Note,
  ParcelDataFull,
  ParcelData,
} from '../models/owner';
import * as hf from '../helper-functions';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';
import { Fee, FinancialRecord, Payment, Cancelation, AdditionalCosts } from '../models/payments';
import { Parcel, OwnersHistory } from '../models/parcel';

let storedOwner: Owner;

@Injectable()
export class OwnerService {

  searchString: any;
  secondSearchString: any;
  unionId: any;

  editedOwner: Owner;
  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  owners: Owner[];

  constructor(
    public db: AngularFirestore
  ) { }

  storeOwner(owner: Owner) {
    storedOwner = owner;
  }

  async getOwnersFinancialRecords(unionId: string, ownerId: string): Promise<FinancialRecord[]> {
    const paymentSnapshots = await this.ownersRef(unionId).doc(ownerId).collection('financialRecords').ref.get();
    if (paymentSnapshots.empty) {
      return [];
    } else {
      const financialRecords = [];
      paymentSnapshots.docs.forEach((ps) => {
        const financialRecord = ps.data();
        if (financialRecord.type === 'payment') {
          financialRecords.push(financialRecord as Payment);
        } else if (financialRecord.type === 'cancelation') {
          financialRecords.push(financialRecord as Cancelation);
        } else {
          financialRecords.push(financialRecord as AdditionalCosts);
        }
      });
      return financialRecords;
    }
  }

  async getOwnersParcelsData(unionId: string, ownerId: string): Promise<ParcelData[]> {
    const parcelsDataSnapshots = await this.ownersRef(unionId).doc(ownerId).collection('parcelsData').ref.get();
    if (parcelsDataSnapshots.empty) {
      return [];
    } else {
      const parcelsData = [];
      parcelsDataSnapshots.docs.forEach((pds) => {
        const parcel = pds.data();
        parcelsData.push(parcel as ParcelData);
      });
      return parcelsData;
    }
  }

  async restoreOwner(unionId: string, id: string): Promise<Owner> {
    if (storedOwner && storedOwner.id === id) {
      return storedOwner;
    } else {
      const ownerRef = await this.ownersRef(unionId).doc(id).ref.get();
      const paymentsRef = await this.ownersRef(unionId).doc(id).collection('payments').ref.get();
      const notesRef = await this.ownersRef(unionId).doc(id).collection('notes').ref.get();
      const parcelsDataRef = await this.ownersRef(unionId).doc(id).collection('parcels').ref.get();
      const payments = [];
      const notes = [];
      const parcelsData = [];
      if (!paymentsRef.empty) {
        paymentsRef.docs.forEach((p) => payments.push(p.data()));
      }
      if (!parcelsDataRef.empty) {
        parcelsDataRef.docs.forEach((p) => parcelsData.push(p.data()));
      }
      if (!notesRef.empty) {
        notesRef.docs.forEach((n) => notes.push(n.data()));
      }
      if (ownerRef.exists) {
        const owner = this.parse(ownerRef.data(), payments, notes, parcelsData);
        await this.calculateOwnerSaldos(owner, unionId);
        console.log(owner);
        return owner;
      } else {
        return null;
      }
    }
  }

  async addOwner(owner: Owner, unionId: string): Promise<any> {
    const id = this.db.createId();
    const address = _.cloneDeep(owner.personalData.address);
    const personalData = { personalData: _.cloneDeep(owner.personalData) };
    delete personalData.personalData.address;
    owner.parcelsData.filter((pd) => pd.id && pd.sectionId).forEach(async (pd: ParcelDataFull) => {
      await this.db.doc(`unions/${unionId}/owners/${owner.id}/parcelsData/${pd.id}`).set(pd);
      const ownersHistory: OwnersHistory = { id, percent: pd.percent, from: pd.from, to: pd.to };
      await this.db
        .doc(`unions/${unionId}/company/${pd.companyId}/parcels/${pd.id}`)
        .collection('ownersHistory')
        .doc(owner.id)
        .set(ownersHistory);
    });
    const dbOwner = _.assign(address, { id },
      owner.contactData, personalData.personalData, {
        authData: owner.authData
      });
    return this.db
      .collection('unions')
      .doc(unionId)
      .collection('owners')
      .doc(id)
      .set(hf.capitalizeStrings(dbOwner));

  }

  async replaceOwner(owner: Owner, unionId: string): Promise<any> {
    const id = owner.id;
    if (await this.checkIfExists(`unions/${unionId}/owners/${owner.id}`)) {
      const address = _.cloneDeep(owner.personalData.address);
      const personalData = { personalData: _.cloneDeep(owner.personalData) };
      delete personalData.personalData.address;
      const dbOwner = _.assign(address, { id },
        owner.contactData, personalData.personalData, {
          authData: owner.authData
        });
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('owners')
        .doc(owner.id)
        .set(hf.capitalizeStrings(dbOwner));
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getUnionOwners(unionId: string): Promise<Owner[]> {
    this.loadedFromBegining = 0;
    const leeseesRef = await this.ownersRef(unionId).ref.limit(this.limit).get();
    const output: Owner[] = [];
    if (!leeseesRef.empty) {
      this.moreToBeLoadedIndicator = leeseesRef.docs.length === 30;
      this.loadedFromBegining = leeseesRef.docs.length;
      return leeseesRef.docs.map((p) => this.parse(p.data()));
    } else {
      return [];
    }
  }

  isOnArray(array: any[], obj: any): boolean {
    let returnVal = false;

    array.forEach((o) => {
      if (_.isEqual(o, obj)) {
        returnVal = true;
      }
    });

    return returnVal;
  }

  async SearchUnionOwnersByName(unionId: string): Promise<string> {
    const name = this.searchString ? _.capitalize(this.searchString) : '';
    const surname = this.secondSearchString ? _.capitalize(this.secondSearchString) : '';
    if (name.length < 1 && surname.length < 1) {
      this.owners = await this.getUnionOwners(this.unionId);
      return 'ok';
    }
    this.loadedFromBegining = 0;
    const ownerSurnameRef = surname.length > 0 ? await this.ownersRef(unionId).ref.
      where('surname', '>=', surname)
      .where('surname', '<=', surname + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const ownerNameRef = name.length > 0 ? await this.ownersRef(unionId).ref
      .where('name', '>=', name).where('name', '<=', name + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const output: Owner[] = [];
    const outputtemp: Owner[] = [];
    if (ownerNameRef && !ownerNameRef.empty) {
      this.moreToBeLoadedIndicator = ownerNameRef.docs.length === this.limit;
      this.loadedFromBegining = ownerNameRef.docs.length;
      ownerNameRef.docs.forEach((p) => outputtemp.push(this.parse(p.data())));
    }
    if (ownerSurnameRef && !ownerSurnameRef.empty) {
      this.moreToBeLoadedIndicator = ownerSurnameRef.docs.length === this.limit;
      this.loadedFromBegining = ownerSurnameRef.docs.length;
      ownerSurnameRef.docs.forEach((p) => {
        outputtemp.push(this.parse(p.data()));
      });
    }
    outputtemp.forEach((o) => {
      if (!this.isOnArray(output, o)) {
        output.push(o);
      }
    });
    this.owners = output;
    return 'ok';
  }

  async SearchUnionOwnersByEvidenceNumber(unionId: string): Promise<string> {
    const evidenceNumber = _.capitalize(this.searchString);
    let ownerEvidenceNumberRef;
    if (!evidenceNumber) {
      ownerEvidenceNumberRef = await this.ownersRef(unionId).ref.get();
    } else {
      this.loadedFromBegining = 0;
      ownerEvidenceNumberRef = await this.ownersRef(unionId).ref
        .orderBy('evidenceNumber')
        .where('evidenceNumber', '>=', evidenceNumber)
        .where('evidenceNumber', '<=', evidenceNumber + String.fromCharCode(1000))
        .limit(this.limit * 10).get();
    }
    const output: Owner[] = [];
    if (!ownerEvidenceNumberRef.empty) {
      this.moreToBeLoadedIndicator = ownerEvidenceNumberRef.docs.length === this.limit;
      this.loadedFromBegining = ownerEvidenceNumberRef.docs.length;
      ownerEvidenceNumberRef.docs.forEach((p) => {
        output.push(this.parse(p.data()));
      });
    }
    this.owners = output;
    return 'ok';
  }

  async SearchUnionOwnersByAddress(unionId: string): Promise<string> {
    const street = this.searchString ? _.capitalize(this.searchString) : '';
    const city = this.secondSearchString ? _.capitalize(this.secondSearchString) : '';
    console.log(street, city);
    if (street.length < 1 && city.length < 1) {
      this.owners = await this.getUnionOwners(this.unionId);
      return 'ok';
    }
    this.loadedFromBegining = 0;
    const leeseesStreetRef = street.length > 0 ? await this.ownersRef(unionId).ref
      .orderBy('streetAndNumber')
      .where('streetAndNumber', '>=', street)
      .where('streetAndNumber', '<=', street + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const ownerCityRef = city.length > 0 ? await this.ownersRef(unionId).ref
      .orderBy('city')
      .where('city', '>=', city)
      .where('city', '<=', city + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const output: Owner[] = [];
    const outputtemp: Owner[] = [];
    if (leeseesStreetRef && !leeseesStreetRef.empty) {
      this.moreToBeLoadedIndicator = leeseesStreetRef.docs.length === this.limit;
      this.loadedFromBegining = leeseesStreetRef.docs.length;
      leeseesStreetRef.docs.forEach((p) => outputtemp.push(this.parse(p.data())));
    }
    if (ownerCityRef && !ownerCityRef.empty) {
      this.moreToBeLoadedIndicator = ownerCityRef.docs.length === this.limit;
      this.loadedFromBegining = ownerCityRef.docs.length;
      ownerCityRef.docs.forEach((p) => {
        outputtemp.push(this.parse(p.data()));
      });
    }

    outputtemp.forEach((o) => {
      if (!this.isOnArray(output, o)) {
        output.push(o);
      }
    });
    this.owners = output;
    return 'ok';
  }


  parse(dbOwner: any, payments?: FinancialRecord[], notes?: Note[], parcelsData?: ParcelDataFull[]): Owner {
    notes = notes ? notes : [];
    payments = payments ? payments : [];
    const personalData: PersonalData = this.parsePersonalData(dbOwner);
    const contactData = this.parseFromInterface(dbOwner, emptyOwnerContact());
    const authData = [];
    const historicSaldo = dbOwner.historicSaldo;
    const saldo = dbOwner.saldo;
    if (dbOwner.authData) {
      dbOwner.authData = dbOwner.authData ? dbOwner.authData : [];
      dbOwner.authData.forEach((ad) => authData.push(this.parseFromInterface(ad, emptyOwnerAuth())));
    }
    if (parcelsData) {
      dbOwner.parcelsData = dbOwner.parcelsData ? dbOwner.parcelsData : [];
      dbOwner.parcelsData.forEach((pd, i) => {
        parcelsData[i] = this.parseFromInterface(pd, emptyParcelDataFull());
      });
    }
    return { personalData, contactData, authData, id: dbOwner.id, parcelsData, payments, notes };
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }

  parsePersonalData(parsed: any): PersonalData {
    return _.omitBy({
      type: parsed.type,
      evidenceNumber: parsed.evidenceNumber,
      name: parsed.name,
      surname: parsed.surname,
      address: _.omitBy({
        streetAndNumber: parsed.streetAndNumber,
        city: parsed.city,
        postCode: parsed.postCode,
        apartment: parsed.apartment,
      }, (v) => _.isNull(v) || _.isUndefined(v)),
      nip: parsed.nip,
      regon: parsed.regon,
      krs: parsed.krs,
      pesel: parsed.pesel
    }, (v) => _.isNull(v) || _.isUndefined(v));
  }


  ownersRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('owners');
  }

  setParcel(parcel: ParcelDataFull, ownerId: string, unionId: string) {
    console.log(parcel);
    parcel.id = parcel.id ? parcel.id : this.db.createId();
    return this.ownersRef(unionId).doc(ownerId).collection('parcels').doc(parcel.id).set(parcel);
  }

  setPayment(payment: FinancialRecord, ownerId: string, unionId: string) {
    payment.id = this.db.createId();
    return this.ownersRef(unionId).doc(ownerId).collection('payments').doc(payment.id).set(payment);
  }

  removePayment(payment: FinancialRecord, ownerId: string, unionId: string) {
    payment.id = this.db.createId();
    return this.ownersRef(unionId).doc(ownerId).collection('payments').doc(payment.id).delete();
  }

  async removeParcel(parcelData: ParcelData, ownerId: string, unionId: string) {
    await this.ownersRef(unionId).doc(ownerId).collection('parcels').doc(parcelData.id).delete();
    return this.db.doc(`unions/${unionId}/companies/${parcelData.companyId}/parcels/${parcelData.id}`)
      .collection('ownersHistory').doc(ownerId).delete();
  }

  setNote(note: Note, ownerId: string, unionId: string) {
    note.id = this.db.createId();
    console.log(note);
    return this.ownersRef(unionId).doc(ownerId).collection('notes').doc(note.id).set(note);
  }

  removeNote(note: Note, ownerId: string, unionId: string) {
    return this.ownersRef(unionId).doc(ownerId).collection('notes').doc(note.id).delete();
  }

  async restoreNotes(unionId: string, id: string) {
    const notesRef = await this.ownersRef(unionId).doc(id).collection('notes').ref.get();
    const notes = [];
    if (!notesRef.empty) {
      notesRef.docs.forEach((n) => notes.push(n.data()));
    }
    return notes;
  }

  async calculateOwnerSaldos(owner: Owner, unionId: string) { // resolutions as an input
    owner.fees = owner.fees ? owner.fees : [];
    owner.saldos = owner.saldos ? owner.saldos : {};
    const resolutionsRef = await this.db.collection('unions').doc(unionId).collection('resolutions').ref.get();
    const resolutions: Resolution[] = resolutionsRef.empty ? [] : resolutionsRef.docs.map((p) => p.data() as Resolution);
    const saldo: Saldo = emptySaldo();
    const parcels: Parcel[] = [];
    for (let i = 0; i < owner.parcelsData.length; i++) {
      const pd = owner.parcelsData[i];
      const ref = await this.db.doc('unions/' + unionId + '/parcels/' + pd.id).ref.get();
      if (ref.exists) {
        const parcel = ref.data() as Parcel;
        pd.number = parcel.number;
        pd.cityId = parcel.cityId;
        parcels.push(parcel);
      }
    }
    resolutions.forEach((r) => {
      const ownerParcels = owner.parcelsData.filter(
        r.wholeCompany ?
          ((pd) => pd.companyId === r.companyId) :
          ((pd) => pd.companyId === r.companyId && _.contains(r.sectionIds, pd.sectionId))
      );
      console.log(ownerParcels, parcels, r);
      ownerParcels.forEach((p) => {
        const matchingParcel = parcels.find((parcel) => parcel.id === p.id);
        p.area = matchingParcel ? matchingParcel.areaSurface : 0;
        console.log('matchingParcel : ', matchingParcel);
        if (r.year >= new Date(p.from).getFullYear()) {
          r.payments.forEach((payment) => {
            const fee: Fee = {
              value: p.percent / 100 * matchingParcel.areaSurface > 1 ?
                r.paymentMoreOneHour * p.percent / 100 * p.area : r.paymentLessOneHour,
              type: 'fee',
              parcelId: p.id,
              id: Math.random().toString(36).substr(2, 5),
              date: payment.paymentDate,
              forYear: r.year
            };
            if (owner.fees) {
              owner.fees.push(fee);
            } else {
              owner.fees = [fee];
            }
          });
        }
      });
    });

    const addtionalCostsPayments = _.groupBy(_.cloneDeep(
      owner.payments.filter((p) => p.type === 'payment' && (p as Payment).for === 'costs')
    ), (ac) => ac.forYear);

    const addtionalCostsCancelations = _.groupBy(_.cloneDeep(
      owner.payments.filter((p) => p.type === 'cancelation' && (p as Cancelation).for === 'costs')
    ), (ac) => ac.forYear);

    const groupedAdditionalCosts = _.groupBy(owner.payments.filter((p) => p.type === 'additionalCosts'), (ac) => ac.forYear);
    _.keys(groupedAdditionalCosts).forEach((k) => {
      let addtionalCostsPaymentsSum = (addtionalCostsPayments[k] ? addtionalCostsPayments[k] : []).reduce((acc, v) => acc + v.value, 0);
      let addtionalCostsCancelationsSum = (addtionalCostsCancelations[k] ? addtionalCostsCancelations[k] : []).reduce((acc, v) => acc + v.value, 0);
      const additionalCosts = groupedAdditionalCosts[k];
      additionalCosts.forEach((ac) => {
        ac.value -= addtionalCostsCancelationsSum;
        addtionalCostsCancelationsSum = ac.value < 0 ? - ac.value : 0;
        if (addtionalCostsCancelationsSum) {
          ac.value = 0;
        }
        if (ac.value > 0) {
          ac.value -= addtionalCostsPaymentsSum;
          addtionalCostsPaymentsSum = ac.value < 0 ? - ac.value : 0;
          if (addtionalCostsPaymentsSum) {
            ac.value = 0;
          }
          if (ac.value > 0) {
            owner.saldos[k] = owner.saldos[k] ? owner.saldos[k] : { costs: 0, capital: 0, interest: 0 };
            owner.saldos[k].costs -= ac.value;
          }
        }
      });
      owner.saldos[k] = owner.saldos[k] ? owner.saldos[k] : { costs: 0, capital: 0, interest: 0 };
      owner.saldos[k].costs += addtionalCostsPaymentsSum;
      owner.saldos[k].costs += addtionalCostsCancelationsSum;
    });

    owner.parcelsData.forEach((pd) => {
      const payments = owner.payments.filter((p) => p.type === 'payment' && (p as Payment).parcelId === pd.id);
      const cancelations = owner.payments.filter((p) => p.type === 'cancelation' && (p as Cancelation).parcelId === pd.id);
      const fees = owner.fees.filter((f) => f.parcelId === pd.id);
      calculateParcelSaldos(fees, payments as Payment[], cancelations as Cancelation[], pd, owner);
    });
  }
}


export function calculateParcelSaldos(fs: Fee[], ps: Payment[], cs: Cancelation[], parcel: ParcelDataFull, owner: Owner) {
  const fees: { [key: number]: Fee[] } = _.cloneDeep(_.groupBy(fs, (f) => f.forYear));
  console.log('groupedFees', fees)
  const payments: { [key: number]: Payment[] } = _.cloneDeep(_.groupBy(ps, (p) => p.forYear));
  console.log('##########', payments)
  const cancelations: { [key: number]: Payment[] } = _.cloneDeep(_.groupBy(cs, (c) => c.forYear));
  let leftovers = 0;
  _.keys(fees).forEach((k) => {
    const financialRecords = [];
    financialRecords.concat(fees[k]).concat(payments[k] ? payments[k] : []).concat(cancelations[k] ? cancelations[k] : []);
    let cancelationsSum = (cancelations[k] ? cancelations[k] : [])
      .filter((c) => c.for === 'capital')
      .reduce((acc, v) => acc += v.value, 0);
    let interetsCancelationsSum = (cancelations[k] ? cancelations[k] : [])
      .filter((c) => c.for === 'interests')
      .reduce((acc, v) => acc += v.value, 0);
    let everythingCancelationsSum = (cancelations[k] ? cancelations[k] : [])
      .filter((c) => c.for === 'everything')
      .reduce((acc, v) => acc += v.value, 0);
    fees[k].forEach((f) => {
      parcel.saldos[k] = parcel.saldos[k] ? parcel.saldos[k] : { interest: 0, costs: 0, capital: 0 }
      const firstValue = f.value;
      let lastPaymentDate;
      if (cancelationsSum) {
        f.value -= cancelationsSum;
        cancelationsSum = f.value < 0 ? - f.value : 0;
        if (cancelationsSum) {
          f.value = 0;
        }
      }
      if (everythingCancelationsSum) {
        f.value -= everythingCancelationsSum;
        everythingCancelationsSum = f.value < 0 ? - f.value : 0;
        if (everythingCancelationsSum) {
          f.value = 0;
        }
      }
      if (leftovers) {
        f.value -= leftovers;
        leftovers = f.value < 0 ? - f.value : 0;
        if (leftovers) {
          f.value = 0;
        }
      }
      if (payments[k] && f.value) {
        payments[k].sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime()).forEach((p, pi) => {

          if (f.value > 0) {
            const timeDifference = Math.floor(
              (new Date(p.date).getTime() - new Date(f.date).getTime()) / (1000 * 60 * 60 * 24)
            )
            if (timeDifference > 0) {
              parcel.saldos[k].interest = parcel.saldos[k].interest ?
                parcel.saldos[k].interest - getIntrests(timeDifference, new Date(f.date).getTime(), f.value) :
                - getIntrests(timeDifference, new Date(f.date).getTime(), firstValue);
            }
            f.value -= p.value;
            p.value = f.value < 0 ? - f.value : 0;
            if (p.value) {
              f.value = 0;
              leftovers += p.value;
            }
            lastPaymentDate = p.date;
          }
        });
      }
      if (f.value > 0) {
        parcel.saldos[k] = parcel.saldos[k] ? parcel.saldos[k] : { capital: 0, interest: 0, costs: 0 };
        parcel.saldos[k].capital = parcel.saldos[k].capital ? parcel.saldos[k].capital - f.value : -f.value;
        const timeDifference = (Date.now() - new Date(lastPaymentDate ? lastPaymentDate : f.date).getTime()) / (1000 * 60 * 60 * 24);
        parcel.saldos[k].interest = parcel.saldos[k].interest ?
          parcel.saldos[k].interest - getIntrests(timeDifference, new Date(f.date).getTime(), f.value) :
          - getIntrests(timeDifference, new Date(f.date).getTime(), f.value);
      }
    });
    if (parcel.saldos[k].interest && interetsCancelationsSum) {
      parcel.saldos[k].interest -= interetsCancelationsSum;
      interetsCancelationsSum = parcel.saldos[k].interest < 0 ? - parcel.saldos[k].interest : 0;
      if (interetsCancelationsSum) {
        parcel.saldos[k].interest = 0;
      }
    }
    if (parcel.saldos[k].interest && everythingCancelationsSum) {
      parcel.saldos[k].interest -= everythingCancelationsSum;
      everythingCancelationsSum = parcel.saldos[k].interest < 0 ? - parcel.saldos[k].interest : 0;
      if (everythingCancelationsSum) {
        parcel.saldos[k].interest = 0;
      }
    }
    parcel.saldos[k].capital = parcel.saldos[k].capital + everythingCancelationsSum + cancelationsSum;
    owner.saldos[k] = owner.saldos[k] ? owner.saldos[k] : { capital: 0, interest: 0, costs: 0 }
    owner.saldos[k].capital = owner.saldos[k].capital ? owner.saldos[k].capital + parcel.saldos[k].capital : parcel.saldos[k].capital;
    owner.saldos[k].interest = owner.saldos[k].interest ?
      owner.saldos[k].interest + parcel.saldos[k].interest :
      parcel.saldos[k].interest;
    for (let i = 0; i < 3; i++) {
      if (leftovers > 0) {
        leftovers = leftoversToSaldo(owner.saldos[k], leftovers);
      }
    }
    if (leftovers > 0) {
      owner.saldos[k].capital += leftovers;
      leftovers = 0;
    }
  });
}

export function leftoversToSaldo(saldo: Saldo, leftovers: number): number {
  if (saldo.capital <= saldo.interest && saldo.capital <= saldo.costs && saldo.capital < 0) {
    saldo.capital += leftovers;
    if (saldo.capital > 0) {
      leftovers = saldo.capital;
      saldo.capital = 0;
    } else {
      leftovers = 0;
    }
  }
  if (saldo.interest <= saldo.capital && saldo.interest <= saldo.costs && saldo.interest < 0) {
    console.log('saldo.interest', saldo.interest, 'leftovers', leftovers);
    saldo.interest += leftovers;
    if (saldo.interest > 0) {
      leftovers = saldo.interest;
      saldo.interest = 0;
    } else {
      leftovers = 0;
    }
    console.log('saldo.interest', saldo.interest, 'leftovers', leftovers);
  }
  if (saldo.costs <= saldo.interest && saldo.costs <= saldo.capital && saldo.costs < 0) {
    saldo.costs += leftovers;
    if (saldo.costs > 0) {
      leftovers = saldo.costs;
      saldo.costs = 0;
    } else {
      leftovers = 0;
    }
  }
  return leftovers;
}




export function getIntrests(days: number, date: number, value: number) {
  if (date >= new Date('01-01-2016').getTime()) {
    return Math.floor(value * 0.07 * days / 365 * 100) / 100;
  } else if (date >= new Date('12-23-2014').getTime()) {
    return Math.floor(value * 0.08 * days / 365 * 100) / 100;
  } else if (date > new Date('12-15-2008').getTime()) {
    return Math.floor(value * 0.13 * days / 365 * 100) / 100;
  } else if (date > new Date('10-15-2005').getTime()) {
    return Math.floor(value * 0.115 * days / 365 * 100) / 100;
  } else if (date > new Date('01-10-2005').getTime()) {
    return Math.floor(value * 0.135 * days / 365 * 100) / 100;
  } else if (date > new Date('09-25-2003').getTime()) {
    return Math.floor(value * 0.125 * days / 365 * 100) / 100;
  } else if (date > new Date('02-01-2003').getTime()) {
    return Math.floor(value * 0.13 * days / 365 * 100) / 100;
  } else if (date > new Date('07-25-2002').getTime()) {
    return Math.floor(value * 0.16 * days / 365 * 100) / 100;
  } else {
    return Math.floor(value * 0.16 * days / 365 * 100) / 100;
  }
}



