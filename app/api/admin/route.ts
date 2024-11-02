import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

//Get all admin users
export const GET = async () => {
  try {
    const admin = await prisma.admin.findMany();
    return NextResponse.json({ data: admin }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Fetch failed', details: error },
      { status: 500 },
    );
  }
};

//delete admin user
export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();
    const { id } = body;
    console.log('first', id);

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Admin deleted successfully' },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Deletion failed', details: error },
      { status: 500 },
    );
  }
};
