import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token no proporcionado" }, 
      { status: 400 }
    );
  }
  
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = new Date(decodedToken.exp * 1000);
    
    (await cookies()).set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al establecer la cookie:', error);
    return NextResponse.json(
      { success: false, message: "Error al procesar el token" }, 
      { status: 500 }
    );
  }
}
