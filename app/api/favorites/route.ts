import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request: Request) {
  const { userId, productId } = await request.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  // Check if the product already exists in the user's favorites
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });

  if (existingFavorite) {
    return NextResponse.json(
      { error: 'Product already exists in favorites' },
      { status: 400 },
    );
  }

  try {
    const favorite = await prisma.favorite.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    });

    return NextResponse.json(
      { message: 'Added to favorites', favorite },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { userId, productId } = await request.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    await prisma.favorite.deleteMany({
      where: {
        user_id: userId,
        product_id: productId,
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

export async function GET(request: Request) {
  const userId = request.headers.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: { product: true },
    });

    return NextResponse.json({ favorites }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve favorites' },
      { status: 500 },
    );
  }
}
