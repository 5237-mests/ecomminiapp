import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await prisma.user.findMany();
  return new Response(JSON.stringify(user));
}

// POST /api/user
export async function POST(request: Request) {
  const user = await request.json();
  const newUser = await prisma.user.create({ data: user });
  return new Response(JSON.stringify(newUser));
}

// DELETE /api/user
export async function DELETE(request: Request) {
  try {
    // search params
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const user_id = searchParams.get('user_id');

    // Ensure user_id is provided
    if (!user_id) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Delete the user from the database
    const user = await prisma.user.delete({
      where: { id: user_id },
    });

    return new NextResponse(JSON.stringify({ message: 'User deleted', user }), {
      status: 200,
    });
  } catch (error) {
    console.error('rerer', error);
    return new NextResponse(
      JSON.stringify({
        message: 'An error occurred while deleting the user',
        error: error,
      }),
      { status: 500 },
    );
  }
}
