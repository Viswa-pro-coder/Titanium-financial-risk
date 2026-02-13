import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for the session/auth cookie if using Firebase Auth with session cookies
    // Or check for a custom token.

    // NOTE: Firebase Client SDK auth state is NOT available in middleware efficiently without session cookies.
    // Standard middleware approach with Firebase usually involves:
    // 1. Client gets ID token -> Calls API -> Set server-side session cookie
    // 2. Middleware checks session cookie.

    // FOR NOW, due to MVP status, we will implement a basic "protected routes" check
    // that relies on client-side redirection in `useAuth` mostly, 
    // BUT we can check for a 'auth_token' cookie if we were setting one.

    // Since we don't have a login API that sets a cookie yet, we will rely on Client-Side Protection
    // for the actual auth check (in useAuth / layouts),
    // but we can use Middleware to redirect root to dashboard or login if we had the cookie.

    // Given constraints, this middleware is a placeholder for future server-side protection.
    // Real protection currently happens in:
    // - src/hooks/useAuth.ts (checking auth state)
    // - protected layouts (need to be implemented)

    const path = request.nextUrl.pathname;

    // Simple redirect: if visiting root, go to login for now (or dashboard/consumer)
    if (path === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
