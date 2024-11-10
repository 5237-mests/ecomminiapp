import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  console.log('id', id);
  if (!id) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    await prisma.favorite.deleteMany({
      where: {
        user_id: id,
      },
    });

    return NextResponse.json(
      { message: 'Removed from favorites' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 },
    );
  }
}
