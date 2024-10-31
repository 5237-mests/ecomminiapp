import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// Add or remove like based on user action
export const POST = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const product_id = params.id;
        const { user_id, action } = await req.json();  // Pass userId and action in the body

        if (action === 'like') {
            // Check if the user already liked this product
            const existingLike = await prisma.productLike.findUnique({
                where: {
                    user_id_product_id: { user_id, product_id }
                }
            });

            if (existingLike) {
                return NextResponse.json({ message: 'Product already liked by user.' }, { status: 400 });
            }

            // Add a new like record
            await prisma.productLike.create({
                data: { user_id, product_id }
            });

            // Increment the product's like count
            const updatedProduct = await prisma.product.update({
                where: { product_id },
                data: { likes: { increment: 1 } }
            });

            return NextResponse.json({ data: updatedProduct, message: 'Product liked successfully!' }, { status: 200 });
        }

        if (action === 'unlike') {
            // Remove the like record
            await prisma.productLike.delete({
                where: { user_id_product_id: { user_id, product_id } }
            });

            // Decrement the product's like count
            const updatedProduct = await prisma.product.update({
                where: { product_id },
                data: { likes: { decrement: 1 } }
            });

            return NextResponse.json({ data: updatedProduct, message: 'Product unliked successfully!' }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Failed to handle like action', details: error }, { status: 500 });
    }
};
