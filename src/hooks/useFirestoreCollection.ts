import { useState, useEffect } from "react";
import { collection, onSnapshot, DocumentData, query, Query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FirestoreCollectionResult {
    data: DocumentData[];
    loading: boolean;
    error: Error | null;
}

export function useFirestoreCollection(
    collectionName: string,
    queryConstraints?: Query
): FirestoreCollectionResult {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!collectionName) {
            setLoading(false);
            return;
        }

        const collectionRef = queryConstraints
            ? queryConstraints
            : collection(db, collectionName);

        const unsubscribe = onSnapshot(
            collectionRef,
            (snapshot) => {
                const documents = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(documents);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, queryConstraints]);

    return { data, loading, error };
}
