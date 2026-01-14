import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// All routes except public paths require authentication
const isPublicPath = (pathname) => {
    // Exact match for home page
    if (pathname === '/') return true;

    // Check if it's an auth path
    if (pathname.startsWith('/auth/')) return true;

    // Check if it's a public API path
    if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/weather/')) return true;

    return false;
};

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow static files
    if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
        return NextResponse.next();
    }

    // Check if path is public
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // All other paths require authentication
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    try {
        // Verify JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key');
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        // Invalid token, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        url.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(url);
        response.cookies.delete('auth_token');
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
