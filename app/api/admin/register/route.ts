import { createSession } from '@/app/lib/session';
import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const body = await request.json();

  //   create admin user
  const admin = await prisma.admin.create({
    data: {
      first_name: body.name,
      username: body.email,
      password: body.password,
    },
  });

  // create session
  await createSession(admin.id, admin.role);
  return NextResponse.json({ data: admin }, { status: 201 });
}
