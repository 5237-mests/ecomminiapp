import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// // Get all products
export const GET = async () => {
    try {
        // const userId = req.headers.get('user-id'); // Retrieve user ID from request headers or session
        const user_id = "cm2w8sjta00009lg4w2152lwo";
        // Fetch all products
        const products = await prisma.product.findMany({
            include: {
                category: true,
                comments: {
                    include: { user: true },
                },
            },
        });

        // Retrieve all product likes for the current user in one query
        const userLikes = await prisma.productLike.findMany({
            where: { user_id },
            select: { product_id: true },
        });

        // Convert user likes to a set of product IDs for easy lookup
        const likedProductIds = new Set(userLikes.map((like) => like.product_id));

        // Add `isLiked` property to each product based on whether it exists in likedProductIds
        const productsWithLikes = products.map((product) => ({
            ...product,
            isLiked: likedProductIds.has(product.product_id),
        }));

        return NextResponse.json({ data: productsWithLikes }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Failed to fetch products', details: error }, { status: 500 });
    }
};


export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload file to Cloudinary
    let imageUrl: string;
    try {
      const fileBuffer = await file.arrayBuffer();
      const base64String = Buffer.from(fileBuffer).toString('base64');
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${file.type};base64,${base64String}`, 
        { upload_preset: 'erm5tqn2' }
      );
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      return NextResponse.json({ error: 'File upload failed', details: uploadError }, { status: 500 });
    }

    // Parse remaining form data
    const { name, description, price, available, category_id } = Object.fromEntries(formData);

    // Save product to the database
    const newProduct = await prisma.product.create({
      data: {
        name: name as string,
        description: description as string,
        price: parseFloat(price as string),
        available: available === 'true',
        category_id: parseInt(category_id as string, 10),
        img: imageUrl,
      },
    });

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Create failed', details: error }, { status: 500 });
  }
};
