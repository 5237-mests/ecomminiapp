import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma, DeliveryType, OrderStatus } from '@prisma/client';

export async function POST(request: Request) {
  const { userId, deliveryType, pickupAddress, deliveryAddress } =
    await request.json();

  if (!userId || !deliveryType) {
    return NextResponse.json(
      { error: 'User ID and delivery type are required' },
      { status: 400 },
    );
  }

  // Validate deliveryType against the enum
  if (!Object.values(DeliveryType).includes(deliveryType as DeliveryType)) {
    return NextResponse.json(
      { error: 'Invalid delivery type' },
      { status: 400 },
    );
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total.plus(
        new Prisma.Decimal(item.product.price).times(item.quantity),
      );
    }, new Prisma.Decimal(0));

    const deliveryFee =
      deliveryType === 'delivery'
        ? new Prisma.Decimal(5)
        : new Prisma.Decimal(0);

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        total_price: totalAmount.plus(deliveryFee),
        delivery_type: deliveryType as DeliveryType, // Cast after validation
        pickup_address: (pickupAddress as string) || '', // Default if null or undefined
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : '',
        delivery_fee: deliveryFee,
        orderItems: {
          create: cart.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        },
      },
    });

    await prisma.cart.update({
      where: { user_id: userId },
      data: { items: { deleteMany: {} } },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const orderId = url.searchParams.get('orderId');

  try {
    if (orderId) {
      // Retrieve a specific order by ID
      const order = await prisma.order.findUnique({
        where: { order_id: orderId },
        include: { orderItems: { include: { product: true } } },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ order }, { status: 200 });
    } else if (userId) {
      // Retrieve all orders for a specific user
      const orders = await prisma.order.findMany({
        where: { user_id: userId },
        include: { orderItems: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ orders }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'User ID or Order ID required' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 },
    );
  }
}

// Update an order
export async function PATCH(request: Request) {
  const { orderId, status, deliveryType, deliveryAddress, deliveryDate } =
    await request.json();

  try {
    // Validate `status` input
    const validStatus =
      status && Object.values(OrderStatus).includes(status as OrderStatus)
        ? (status as OrderStatus)
        : undefined;

    if (status && !validStatus) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 },
      );
    }

    const order = await prisma.order.update({
      where: { order_id: orderId },
      data: {
        ...(deliveryType && { delivery_type: deliveryType }),
        ...(validStatus && { status: validStatus }),
        ...(deliveryAddress && { delivery_address: deliveryAddress }),
        ...(deliveryDate && { delivery_date: new Date(deliveryDate) }),
      },
    });

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 },
    );
  }
}

// Delete order
export async function DELETE(request: Request) {
  // const { orderId } = await request.json();
  // retrive orderid from request query
  const url = new URL(request.url);
  const orderId = url.searchParams.get('id');

  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 },
    );
  }

  try {
    await prisma.order.delete({
      where: { order_id: orderId },
    });

    return NextResponse.json(
      { message: 'Order deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 },
    );
  }
}
