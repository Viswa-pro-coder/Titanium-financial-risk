'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface AuthContextType {
    user: User | null
    tier: 'consumer' | 'institution' | 'analyst' | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    tier: null,
    loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [tier, setTier] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            if (user) {
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                setTier(docSnap.data()?.tier || 'consumer')
            } else {
                setTier(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={{ user, tier, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)