import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import cloudinary from '@/lib/cloudinary';

//Update product
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id);
    const formData = await req.formData();
    let data = Object.fromEntries(formData);

    //Type assertion for FormData entries
    const productData: Record<string, any> = { ...data };

    // parsefloat price
    if (productData.price) {
      productData.price = parseFloat(productData.price); //convert price to float
    }

    if (data.category_id) {
      productData.category_id = parseInt(productData.category_id);
    }

    if (productData.available) {
      productData.available = productData.available === 'true' ? true : false;
    }

    // delete id from data
    delete productData.id;

    //check if there is a file
    const file = formData.get('file') as Blob | null;
    if (file) {
      const uploadResponse = await cloudinary.uploader.upload(`data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`, {
        upload_preset: 'erm5tqn2',
      });
      data.img = uploadResponse.secure_url;
    }

    // delete file from data
    delete productData.file;
  
    const updatedProduct = await prisma.product.update({
      where: { id },
      data : productData,
    });

    return NextResponse.json({ data: updatedProduct }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Update failed', details: error.message }, { status: 500 });
  }
};

// Delete product
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id);

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ data: deletedProduct }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Delete failed', details: error.message }, { status: 500 });
  }
};

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Fetch failed', details: error.message }, { status: 500 });
  }
};
