import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { userRoutes } from './shared/data/user-routes';
import { JWTPayload } from './shared/data/interfaces/JWTPayload';

const publicPaths = ['/login', '/register', '/forgot-password', '/forbidden-page', '/'];
const authExclusivePaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Handle authentication exclusive paths (login, register)
  if (token && authExclusivePaths.includes(pathname)) {
    try {
      return NextResponse.redirect(new URL('/inventory', request.url));
    } catch (error) {
      console.error('Middleware: Error redirecting authenticated user:', error);
      return NextResponse.next();
    }
  }

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);

    // Check if the current path matches any protected route
    const matchingRoute = Object.entries(userRoutes).find(([routeBase]) => {
      return pathname.startsWith(routeBase);
    });

    if (matchingRoute) {
      const [routeBase, allowedRoles] = matchingRoute;

      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.redirect(new URL('/forbidden-page', request.url));
      }
    } else {
      // No matching protected route found — allow access by default
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware: Error decoding JWT:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
