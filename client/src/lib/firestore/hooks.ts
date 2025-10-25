import { useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  Query,
  DocumentReference,
  QueryConstraint,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';

export interface FirestoreHookOptions {
  enabled?: boolean;
}

export interface UseFirestoreCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export interface UseFirestoreDocumentResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFirestoreCollection<T = any>(
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  options: FirestoreHookOptions = {}
): UseFirestoreCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const enabled = options.enabled !== false;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe: Unsubscribe;

    try {
      const collectionRef = collection(db, collectionPath);
      const q = constraints.length > 0 
        ? query(collectionRef, ...constraints)
        : collectionRef;

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(documents);
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching collection ${collectionPath}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(`Error setting up listener for ${collectionPath}:`, err);
      setError(err as Error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionPath, enabled, ...constraints]);

  return { data, loading, error };
}

export function useFirestoreDocument<T = any>(
  collectionPath: string,
  documentId: string | null,
  options: FirestoreHookOptions = {}
): UseFirestoreDocumentResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const enabled = options.enabled !== false && documentId !== null;

  useEffect(() => {
    if (!enabled || !documentId) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe: Unsubscribe;

    try {
      const docRef = doc(db, collectionPath, documentId);

      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData({
              id: snapshot.id,
              ...snapshot.data()
            } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching document ${collectionPath}/${documentId}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(`Error setting up listener for ${collectionPath}/${documentId}:`, err);
      setError(err as Error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionPath, documentId, enabled]);

  return { data, loading, error };
}

export { where, orderBy, limit };
