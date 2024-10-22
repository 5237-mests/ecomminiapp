import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Get all products
export async function GET() {
  const products = await prisma.product.findMany();
  return new Response(JSON.stringify(products), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload file to Cloudinary
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const uploadResponse = await cloudinary.uploader.upload(`data:${file.type};base64,${base64String}`, {
      upload_preset: 'erm5tqn2',
    });

    const imageUrl = uploadResponse.secure_url;

    const { name, description, price, available, category_id } = Object.fromEntries(formData);

    const newProduct = await prisma.product.create({
      data: {
        name: name as string,
        description: description as string,
        price: parseFloat(price as string),
        available: available === 'true',
        category_id: parseInt(category_id as string),
        img: imageUrl,
      },
    });

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Create failed', details: error }, { status: 500 });
  }
};
