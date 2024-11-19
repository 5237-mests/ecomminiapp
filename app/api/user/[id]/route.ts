import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// Get user by ID
export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const userId = params.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Fetch failed', details: error },
      { status: 500 },
    );
  }
};
