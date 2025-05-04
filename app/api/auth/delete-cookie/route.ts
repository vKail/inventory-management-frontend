import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    (await cookies()).delete('auth_token');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar la cookie:', error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar la cookie" }, 
      { status: 500 }
    );
  }
}