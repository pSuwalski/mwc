import { Parcel } from './models/parcel';
import { FinancialRecord, Fee, Payment, Cancelation } from './models/payments';
import { ParcelData, Saldo, ParcelDataFull, Owner, emptySaldo } from './models/owner';
import { Resolution } from './models/resolution';
import * as _ from 'lodash';

export function calculateOwnerSaldos(owner: Owner, unionId: string) { // resolutions as an input
    const resolutionsRef = this.db.collection('unions').doc(unionId).collection('resolutions').ref.get();
    const resolutions: Resolution[] = resolutionsRef.empty ? [] : resolutionsRef.docs.map((p) => p.data() as Resolution);
    const saldo: Saldo = emptySaldo();
    const parcels: Parcel[] = owner.parcelsData.map((pd) => {
        const ref = this.db.doc('unions/' + unionId + '/parcels/' + pd.id).ref.get();
        if (ref.exists) {
            return ref.data() as Parcel;
        } else {
            return undefined;
        }
    }).filter((p) => !p);
    resolutions.forEach((r) => {
        const ownerParcels = owner.parcelsData.filter(
            r.wholeCompany ?
                ((pd) => pd.companyId === r.companyId) :
                ((pd) => pd.companyId === r.companyId && _.contains(r.sectionIds, pd.sectionId))
        );
        ownerParcels.forEach((p) => {
            const matchingParcel = parcels.find((parcel) => parcel.id === p.id);
            p.area = matchingParcel ? matchingParcel.areaSurface : 0;
            if (r.year >= new Date(p.from).getFullYear()) {
                r.payments.forEach((payment) => {
                    const fee: Fee = {
                        value: p.percent * p.area > 1 ? r.paymentMoreOneHour * p.percent * p.area : r.paymentLessOneHour,
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
        owner.parcelsData.forEach((pd) => {
            const payments = owner.payments.filter((p) => p.type === 'payment' && (p as Payment).parcelId === pd.id);
            const cancelations = owner.payments.filter((p) => p.type === 'cancelation' && (p as Cancelation).parcelId === pd.id);
            const fees = owner.fees.filter((f) => f.parcelId === pd.id);
            calculateParcelSaldos(fees, payments as Payment[], cancelations as Cancelation[], pd, owner);
        });
    });
}

export function calculateParcelSaldos(fs: Fee[], ps: Payment[], cs: Cancelation[], parcel: ParcelDataFull, owner: Owner) {
    const fees: { [key: number]: Fee[] } = _.cloneDeep(_.groupBy(fs, (f) => f.forYear));
    const payments: { [key: number]: Payment[] } = _.cloneDeep(_.groupBy(ps, (p) => p.forYear));
    const cancelations: { [key: number]: Payment[] } = _.cloneDeep(_.groupBy(cs, (c) => c.forYear));
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
            let lastPaymentDate;
            payments[k].sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime()).forEach((p, pi) => {
                if (cancelationsSum) {
                    f.value -= cancelationsSum;
                    cancelationsSum = f.value < 0 ? - f.value : 0;
                    if (cancelationsSum) {
                        f.value = 0;
                    }
                } else if (everythingCancelationsSum) {
                    f.value -= everythingCancelationsSum;
                    everythingCancelationsSum = f.value < 0 ? - f.value : 0;
                    if (everythingCancelationsSum) {
                        f.value = 0;
                    }
                }
                if (f.value > 0) {
                    const timeDifference = Math.floor(
                        (new Date(p.date).getTime() - new Date(f.date).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    if (timeDifference > 0) {
                        parcel.saldos[k].interest = parcel.saldos[k].interest ?
                            parcel.saldos[k].interest + getIntrests(timeDifference, new Date(f.date).getTime(), f.value) :
                            getIntrests(timeDifference, new Date(f.date).getTime(), f.value);
                    }
                    f.value -= p.value;
                    p.value = f.value < 0 ? - f.value : 0;
                    if (p.value) {
                        f.value = 0;
                    }
                    lastPaymentDate = p.date;
                }
            });
            if (f.value > 0) {
                parcel.saldos[k].capital = parcel.saldos[k].capital ? parcel.saldos[k].capital - f.value : -f.value;
                const timeDifference = (Date.now() - new Date(lastPaymentDate).getTime()) / (1000 * 60 * 60 * 24);
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
        owner.saldos[k].capital = owner.saldos[k].capital ? owner.saldos[k].capital + parcel.saldos[k].capital : parcel.saldos[k].capital;
        owner.saldos[k].interest = owner.saldos[k].interest ?
            owner.saldos[k].interest + parcel.saldos[k].interest :
            parcel.saldos[k].interest;
    });
}


export function getIntrests(days: number, date: number, value: number) {
    if (date >= new Date('01-01-2016').getTime()) {
        return value * 0.07 * days / 365;
    } else if (date >= new Date('23-12-2014').getTime()) {
        return value * 0.08 * days / 365;
    } else if (date > new Date('15-12-2008').getTime()) {
        return value * 0.13 * days / 365;
    } else if (date > new Date('15-10-2005').getTime()) {
        return value * 0.115 * days / 365;
    } else if (date > new Date('10-01-2005').getTime()) {
        return value * 0.135 * days / 365;
    } else if (date > new Date('25-09-2003').getTime()) {
        return value * 0.125 * days / 365;
    } else if (date > new Date('01-02-2003').getTime()) {
        return value * 0.13 * days / 365;
    } else if (date > new Date('25-07-2002').getTime()) {
        return value * 0.16 * days / 365;
    } else {
        return value * 0.16 * days / 365;
    }
}

