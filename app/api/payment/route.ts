import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
export async function POST(request: Request) {
  const { orderId, paymentMethod } = await request.json();

  if (!orderId || !paymentMethod) {
    return NextResponse.json(
      { error: 'Order ID and payment method are required' },
      { status: 400 },
    );
  }

  try {
    // Retrieve order to get the total amount
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create a payment entry
    const payment = await prisma.payment.create({
      data: {
        order_id: orderId,
        amount: order.total_price,
        payment_method: paymentMethod,
        status: 'pending',
      },
    });

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const { paymentId, status } = await request.json();

  if (!paymentId || !status) {
    return NextResponse.json(
      { error: 'Payment ID and status required' },
      { status: 400 },
    );
  }

  try {
    const payment = await prisma.payment.update({
      where: { payment_id: paymentId },
      data: {
        status,
        // transactionId,
      },
    });

    // Update the order status if payment is completed
    if (status === 'completed') {
      await prisma.order.update({
        where: { order_id: payment.order_id },
        data: { status: 'ACCEPTED' },
      });
    }

    return NextResponse.json({ payment }, { status: 200 });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get('paymentId');
  const orderId = url.searchParams.get('orderId');

  try {
    let payment;
    if (paymentId) {
      payment = await prisma.payment.findUnique({
        where: { payment_id: paymentId },
      });
    } else if (orderId) {
      payment = await prisma.payment.findFirst({
        where: { order_id: orderId },
      });
    }

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ payment }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving payment:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment' },
      { status: 500 },
    );
  }
}
