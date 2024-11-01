import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import cloudinary from '@/lib/cloudinary';

// Get product by ID
export const GET = async () => {
  try {
    const product = await prisma.product.findMany();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found*' },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Fetch failed', details: error },
      { status: 500 },
    );
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
        { upload_preset: 'erm5tqn2' },
      );
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      return NextResponse.json(
        { error: 'File upload failed', details: uploadError },
        { status: 500 },
      );
    }

    // Parse remaining form data
    const { name, description } = Object.fromEntries(formData);

    // Save product to the database
    const newProduct = await prisma.category.create({
      data: {
        name: name as string,
        description: description as string,
        img: imageUrl,
      },
    });

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Create failed', details: error },
      { status: 500 },
    );
  }
};
