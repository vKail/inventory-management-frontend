import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { userRoutes } from './shared/data/user-routes';
import { JWTPayload } from './shared/data/interfaces/JWTPayload';

const publicPaths = ['/login', '/register', '/forgot-password', '/forbidden-page'];
const authExclusivePaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  if (token && authExclusivePaths.includes(pathname)) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      console.log('Usuario ya autenticado intentando acceder a:', pathname);
      return NextResponse.redirect(new URL('/inventory', request.url));
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      return NextResponse.next();
    }
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    console.log('Token decoded:', decoded);

    const matchingRoute = Object.entries(userRoutes).find(([routeBase]) => {
      return pathname.startsWith(routeBase);
    });

    if (matchingRoute) {
      const [routeBase, allowedRoles] = matchingRoute;
      console.log(`Route ${routeBase} requires roles:`, allowedRoles);
      console.log(`User role: ${decoded.role}`);

      if (!allowedRoles.includes(decoded.role)) {
        console.log('Access denied, redirecting to forbidden page');
        return NextResponse.redirect(new URL('/forbidden-page', request.url));
      }
      console.log('Access granted');
    } else {
      console.log('No matching protected route found, general access granted');
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT decode error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
