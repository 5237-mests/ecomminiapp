// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { cart_id: id },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Find the cart item by cart_id and product_id
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.cart_id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 },
      );
    }

    // Delete all the cart item using its cart_id
    await prisma.cartItem.deleteMany({
      where: {
        cart_id: cart.cart_id,
      },
    });

    return NextResponse.json(
      { message: 'Item removed from cart' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item' },
      { status: 500 },
    );
  }
}
