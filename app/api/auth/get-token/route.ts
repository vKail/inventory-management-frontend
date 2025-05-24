import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ token: null });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error al obtener la cookie:', error);
    return NextResponse.json({ token: null });
  }
}
