// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request: Request) {
  const { userId, productId, quantity } = await request.json();

  if (!userId || !productId || quantity <= 0) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    // Ensure the user has a cart, or create one
    const cart = await prisma.cart.upsert({
      where: { user_id: userId },
      create: { user_id: userId },
      update: {},
    });

    // Check if the product already exists in the user's cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.cart_id,
        product_id: productId,
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Update the quantity if the item already exists in the cart
      cartItem = await prisma.cartItem.update({
        where: { cart_item_id: existingCartItem.cart_item_id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Add new item to the cart
      cartItem = await prisma.cartItem.create({
        data: {
          cart_id: cart.cart_id,
          product_id: productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ cartItem }, { status: 200 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 },
    );
  }
}

// PATCH
export async function PATCH(request: Request) {
  const { userId, productId, quantity } = await request.json();

  if (!userId || !productId || quantity < 0) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // First, find the cart item based on cart_id and product_id
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.cart_id,
        product_id: productId,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 },
      );
    }

    // Now, update the cart item by its unique ID
    const cartItem = await prisma.cartItem.update({
      where: {
        cart_item_id: existingCartItem.cart_item_id,
      },
      data: { quantity },
    });

    return NextResponse.json({ cartItem }, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 },
    );
  }
}

// get
export async function GET(request: Request) {
  const userId = request.headers.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json({ cartItems: cart.items }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cart items' },
      { status: 500 },
    );
  }
}

// DELETE
export async function DELETE(request: Request) {
  const { userId, productId } = await request.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Find the cart item by cart_id and product_id
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.cart_id,
        product_id: productId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 },
      );
    }

    // Delete the cart item using its unique cart_item_id
    await prisma.cartItem.delete({
      where: { cart_item_id: cartItem.cart_item_id },
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
