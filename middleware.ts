import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection
 * Checks for Firebase session cookie before allowing access to protected routes
 */

// Routes that require authentication
const protectedRoutes = [
    '/profile',
    '/add-funds',
    '/purchase',
    '/transactions',
];

// Routes that require admin role (checked in page, not middleware)
const adminRoutes = [
    '/admin',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute || isAdminRoute) {
        // Check for Firebase session cookie
        const sessionCookie = request.cookies.get('__session')?.value;
        const firebaseAuth = request.cookies.get('firebase-auth-token')?.value;
        
        // Also check localStorage token passed as cookie
        const hasAuth = sessionCookie || firebaseAuth;
        
        if (!hasAuth) {
            // Redirect to home with login modal trigger
            const url = request.nextUrl.clone();
            url.pathname = '/';
            url.searchParams.set('auth', 'required');
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }
    
    // API routes protection
    if (pathname.startsWith('/api/purchase') || pathname.startsWith('/api/admin')) {
        // These routes check auth via Bearer token in the route handler
        // Just let them through, they'll return 401 if unauthorized
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/add-funds/:path*',
        '/purchase/:path*',
        '/transactions/:path*',
        '/admin/:path*',
    ],
};
