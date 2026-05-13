import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Note: To implement full server-side auth, we need cookies.
    // Client-side auth check is already implemented in DashboardLayout.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
