import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma'; // Adjust path to your Prisma client instance
import cloudinary from '@/lib/cloudinary';
import { parse } from 'path';

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const productId = formData.get('productId') as string | null;
    const file = formData.get('file') as Blob | null;

    if (!productId || !file) {
      return NextResponse.json({ error: 'Product ID and image file are required' }, { status: 400 });
    }

    // Step 1: Upload file to Cloudinary
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const cloudinaryResponse = await cloudinary.uploader.upload(`data:${file.type};base64,${base64String}`, {
      upload_preset: 'erm5tqn2', // Your Cloudinary upload preset
    });
    
    const newImageUrl = cloudinaryResponse.secure_url;

    // Step 2: Add the Cloudinary URL to the `detail_img` array in the database
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: {
        detail_img: {
          push: newImageUrl,
        },
      },
    });

    return NextResponse.json({ data: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload and add image', details: error }, { status: 500 });
  }
};


export const DELETE = async (req: Request) => {
  try {
    const { productId, imageUrlToRemove } = await req.json();
    if (!productId || !imageUrlToRemove) {
      return NextResponse.json({ error: 'Product ID and image URL to remove are required' }, { status: 400 });
    }

    // Get the current detail_img array
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Filter out the URL to be removed
    const updatedDetailImg = product.detail_img.filter((url) => url !== imageUrlToRemove);
    // Update the product with the filtered array
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: {
        detail_img: {
          set: updatedDetailImg,
        },
      },
    });

    return NextResponse.json({ data: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove image', details: error }, { status: 500 });
  }
};
