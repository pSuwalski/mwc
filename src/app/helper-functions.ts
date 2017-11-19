import { firestore } from 'firebase/app';

export async function checkIfExists(ref: firestore.DocumentReference) {
  const dataRef = await ref.get();
  return dataRef.exists;
}
