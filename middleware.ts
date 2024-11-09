import { NextRequest, NextResponse } from 'next/server';
import { decrypt, updateSession } from '@/app/lib/session';
import { cookies } from 'next/headers';

const publicRoutes = ['/admin/login', '/api/admin/login', '/api/signup', '/'];

const isPublicRoute = (path: string) =>
  publicRoutes.includes(path) || path.match(/\/(admin|api)\/(login|signup)/);

const isProtectedRoute = (path: string) =>
  (path.startsWith('/admin') || path.startsWith('/api')) &&
  !isPublicRoute(path);

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // Check for a session on protected routes
  if (isProtectedRoute(path)) {
    const cookieToken = (await cookies()).get('session')?.value;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : cookieToken;

    let session;
    try {
      session = await decrypt(token);
    } catch (error) {
      console.error('Error decrypting session:', error);
      session = null; // Treat as unauthenticated if decryption fails
    }

    if (!session?.userId) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
    }
  }

  // update session
  await updateSession(req);

  return NextResponse.next();
}

// Middleware matcher configuration
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|.*\\.png$).*)',
  ],
};
