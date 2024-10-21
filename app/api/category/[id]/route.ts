import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary'; // Cloudinary setup for image uploads


export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
    try {
      const id = parseInt(params.id); // Parse the product ID from the URL params
      const formData = await req.formData(); // Get form data from the request
      const data = Object.fromEntries(formData.entries()); // Convert formData to a plain object

      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });
      
      if (!existingCategory) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }      
  
      // Type assertion for formData entries
      //@typescript-eslint/no-explicit-any
      const productCategory: Record<string, any> = { ...data };
  
      // Remove the 'id' field from the product data as it should not be updated
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
        // Set the image URL in the product data
        productCategory.img = uploadResponse.secure_url; // Set the image URL in the product data
      }
  
      // Remove the file entry from the product data object
      delete productCategory.file;
  
      // Update the product in the database using Prisma
      const updatedProduct = await prisma.category.update({
        where: { id },
        data: productCategory,
      });
  
      // Respond with the updated product
      return NextResponse.json({ data: updatedProduct }, { status: 200 });
    } catch (error: unknown) {
      // Handle errors and return a 500 response with the error message
      return NextResponse.json({ error: 'Update failed', details: error }, { status: 500 });
    }
};
