import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary'; // Cloudinary setup for image uploads

// Define a type for your category fields
type CategoryData = {
  id?: number;
  name?: string;
  description?: string;
  img?: string;
  file?: File;
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id); // Parse the category ID from the URL params
    const formData = await req.formData(); // Get form data from the request
    const data = Object.fromEntries(formData.entries()); // Convert formData to a plain object

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Type assertion for formData entries
    const productCategory: CategoryData = { ...data } as CategoryData;

    // Remove the 'id' field from the category data as it should not be updated
    delete productCategory.id;

    // Check if there's a file to upload
    const file = formData.get('img') as Blob | null;

    // If there's a file, upload it to Cloudinary
    if (file) {
      // Convert the file to a base64 string and upload it to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`, 
        {
          upload_preset: 'erm5tqn2', // Your Cloudinary preset
        }
      );
      // Set the image URL in the category data
      productCategory.img = uploadResponse.secure_url;
    }

    // Remove the file entry from the category data object
    delete productCategory.file;

    // Update the category in the database using Prisma
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: productCategory,
    });

    // Respond with the updated category
    return NextResponse.json({ data: updatedCategory }, { status: 200 });
  } catch (error: unknown) {
    // Handle errors and return a 500 response with the error message
    return NextResponse.json({ error: 'Update failed', details: error }, { status: 500 });
  }
};
