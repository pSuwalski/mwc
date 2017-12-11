import { firestore } from 'firebase/app';
import * as _ from 'lodash';

export async function checkIfExists(ref: firestore.DocumentReference) {
  const dataRef = await ref.get();
  return dataRef.exists;
}

export function createDbObject(object: any) {
  return _.reduce(_.keys(object), (dbObject, key) => {
    return _.assign(dbObject, object[key]);
  }, {});
}

export function capitalizeStrings<T>(object: T): T {
  _.keys(object).forEach((k) => {
    if (
      _.isString(object[k]) &&
      k !== 'id' &&
      k !== 'sectionId' &&
      k !== 'companyId' &&
      k !== 'id' &&
      k !== 'evidenceNumber' &&
      k.toLocaleLowerCase().indexOf('date') === -1 &&
      k !== 'type' &&
      k !== 'for' &&
      k !== 'from' &&
      k !== 'legalBasis'
    ) {
      object[k] = _.capitalize(object[k]);
    } else if (_.isObject(object[k]) && (!_.isArray(object[k]) || !_.isString(object[k][0]))) {
      object[k] = capitalizeStrings(object[k]);
    }
  });
  return object;
}
