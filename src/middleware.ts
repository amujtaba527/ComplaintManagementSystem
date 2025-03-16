import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define allowed paths for each role
const roleAccess = {
  employee: ['/complaints', '/api/complaints'],
  owner: ['/reports', '/api/reports'],
  admin: ['*'], // Admin has access to everything
  manager: ['/complaintsaction', '/api/complaint/action', '/api/complaints'],
  it_manager: ['/complaintsaction', '/api/complaint/action', '/api/complaints'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (!token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  const userRole = token.role as keyof typeof roleAccess;
  const path = request.nextUrl.pathname;

  // Admin has access to everything
  if (userRole === 'admin') {
    return NextResponse.next();
  }

  // Check if user has access to the requested path
  const allowedPaths = roleAccess[userRole] || [];
  const hasAccess = allowedPaths.some(allowedPath => {
    if (allowedPath === '*') return true;
    return path.startsWith(allowedPath);
  });
  
  if (!hasAccess) {
    // Redirect to unauthorized page or home page
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/complaints/:path*',
    '/reports/:path*',
    '/admin/:path*',
    '/api/complaints/:path*',
    '/api/reports/:path*',
  ],
};
