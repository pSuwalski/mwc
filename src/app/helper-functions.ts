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
