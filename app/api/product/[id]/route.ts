import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import cloudinary from '@/lib/cloudinary';

// Define types for Product
type ProductData = {
  product_id?: string;
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  available?: boolean;
  img?: string;
};

// Update product
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const product_id = params.id;
    const formData = await req.formData();
    const data = Object.fromEntries(formData);

    // Convert form data to the correct types
    const productData: ProductData = {
      ...data,
      price: data.price ? parseFloat(data.price as string) : undefined,
      category_id: data.category_id ? parseInt(data.category_id as string) : undefined,
      available: data.available === 'true',
    };

    // Remove the 'id' field if present (shouldn't be updated)
    delete productData['product_id'];

    // Check if there is a file to upload
    const file = formData.get('file') as Blob | null;
    if (file) {
      const uploadResponse = await cloudinary.uploader.upload(`data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`, {
        upload_preset: 'erm5tqn2',
      });
      productData.img = uploadResponse.secure_url; // Add image URL to product data
    }

    // Update product in the database
    const updatedProduct = await prisma.product.update({
      where: { product_id },
      data: productData,
    });

    return NextResponse.json({ data: updatedProduct }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Update failed', details: error }, { status: 500 });
  }
};

// Delete product
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const product_id = params.id;

    const deletedProduct = await prisma.product.delete({
      where: { product_id },
    });

    return NextResponse.json({ data: deletedProduct }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Delete failed', details: error }, { status: 500 });
  }
};

// // Get product by ID
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const productId  = params.id;
        // const userId = req.headers.get('user-id'); // Retrieve user ID from request headers or session
        const user_id = "cm2w8sjta00009lg4w2152lwo";

        // Fetch the product data
        const product = await prisma.product.findUnique({
            where: { product_id: productId },
            include: {
                category: true,
                comments: {
                    include: { user: true },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Check if the product is liked by the user
        const isLiked = Boolean(
            await prisma.productLike.findUnique({
                where: {
                    user_id_product_id: { user_id, product_id: productId },
                },
            })
        );

        // Include `isLiked` in the response
        return NextResponse.json({ data: { ...product, isLiked } }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Failed to fetch product', details: error }, { status: 500 });
    }
};
