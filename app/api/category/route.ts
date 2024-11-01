import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary'; // Cloudinary setup for image uploads

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Create a new category
export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('img') as Blob | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    let imgUrl = '';

    if (file) {
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`,
        { upload_preset: 'erm5tqn2' },
      );
      imgUrl = uploadResponse.secure_url; // Get the image URL from Cloudinary
    }

    const category = await prisma.category.create({
      data: { name, description, img: imgUrl },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Creation failed', details: error },
      { status: 500 },
    );
  }
};

// Get all categories
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Fetch failed', details: error },
      { status: 500 },
    );
  }
};

// Delete category by ID
export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();
    const { id } = body;
    console.log('first', id);

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Deletion failed', details: error },
      { status: 500 },
    );
  }
};
