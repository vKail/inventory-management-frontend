import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      console.error('Set-cookie API: No token provided');
      return NextResponse.json(
        { success: false, message: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = new Date(decodedToken.exp * 1000);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      //Cuando se obtenga en cerrtificado ssl, se debe colocar process.env.NODE_ENV === 'production'
      secure: false,
      expires: expiresAt,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({
      success: true,
      message: 'Cookie establecida correctamente',
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Set-cookie API: Error setting cookie:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar el token' },
      { status: 500 }
    );
  }
}
