import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// Get product by ID
export const GET = async () => {
  try {
    const product = await prisma.comment.findMany({
      include: { user: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Fetch failed', details: error },
      { status: 500 },
    );
  }
};

// Add comment
export const POST = async (req: Request) => {
  // Add comment
  try {
    // const formData = await req.formData();
    // const {content, user_id, product_id} = Object.fromEntries(formData.entries());
    const { content, user_id, product_id } = await req.json();

    const comment = await prisma.comment.create({
      data: {
        content: content as string,
        user_id: user_id as string,
        product_id: product_id as string,
      },
    });
    return NextResponse.json({ data: comment }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Fetch failed', details: error },
      { status: 500 },
    );
  }
};
