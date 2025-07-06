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

  console.log('Middleware: Processing request for:', pathname);
  console.log('Middleware: Token present:', !!token);

  // Handle authentication exclusive paths (login, register)
  if (token && authExclusivePaths.includes(pathname)) {
    try {
      console.log('Middleware: User is authenticated, redirecting from auth page to inventory');
      return NextResponse.redirect(new URL('/inventory', request.url));
    } catch (error) {
      console.error('Middleware: Error redirecting authenticated user:', error);
      return NextResponse.next();
    }
  }

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    console.log('Middleware: Public path, allowing access');
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (!token) {
    console.log('Middleware: No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    console.log('Middleware: Decoding JWT token...');
    const decoded = jwtDecode<JWTPayload>(token);
    console.log('Middleware: Token decoded successfully, user role:', decoded.role);

    // Check if the current path matches any protected route
    const matchingRoute = Object.entries(userRoutes).find(([routeBase]) => {
      return pathname.startsWith(routeBase);
    });

    if (matchingRoute) {
      const [routeBase, allowedRoles] = matchingRoute;
      console.log('Middleware: Found matching route:', routeBase, 'Allowed roles:', allowedRoles);

      if (!allowedRoles.includes(decoded.role)) {
        console.log('Middleware: User role not allowed, redirecting to forbidden page');
        return NextResponse.redirect(new URL('/forbidden-page', request.url));
      }
    } else {
      console.log('Middleware: No matching protected route found, general access granted');
    }

    console.log('Middleware: Access granted');
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware: Error decoding JWT:', error);
    console.log('Middleware: Invalid token, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
