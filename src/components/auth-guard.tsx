'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            const publicPaths = ['/login', '/signup'];
            if (!user && !publicPaths.includes(pathname)) {
                router.push('/login');
            }
            // Optional: Redirect logged-in users away from login/signup
            if (user && publicPaths.includes(pathname)) {
                // Default to consumer, ideally check tier in context
                router.push('/dashboard/consumer');
            }
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
    }

    // If on a public path, or if user is authenticated, render children
    // (The useEffect handles the redirect if logic fails)
    return <>{children}</>;
}
