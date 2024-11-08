import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
// import { retrieveLaunchParams } from '@telegram-apps/sdk';

const publicRoutes = ['/admin/login', '/api/admin/login', '/api/signup'];

const isPublicRoute = (path: string) =>
  publicRoutes.includes(path) || path.match(/\/(admin|api)\/(login|signup)/);

const isProtectedRoute = (path: string) =>
  (path.startsWith('/admin') || path.startsWith('/api')) &&
  !isPublicRoute(path);

// Check if the request is coming from Telegram
// const isTelegramRequest = () => {
//   try {
//     const { initDataRaw, initData, platform } = retrieveLaunchParams();
//     console.log('Launch Params', initDataRaw, initData, platform);
//     return true;
//   } catch (error) {
//     console.error('Error retrieving launch params:', error);
//     return false;
//   }
// };

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Bypass for public routes
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

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
