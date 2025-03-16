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

// Paths that should be excluded from middleware
const excludedPaths = [
  '/api/auth',
  '/_next',
  '/images',
  '/favicon.ico',
  '/login',
  '/'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path should be excluded
  if (excludedPaths.some(excludedPath => path.startsWith(excludedPath))) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = token.role as keyof typeof roleAccess;

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
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api/auth routes
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|public|login).*)',
  ],
};
