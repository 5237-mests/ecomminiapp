import { createSession } from '@/app/lib/session';
import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const body = await request.json();

  const admin = await prisma.admin.findUnique({
    where: {
      username: body.email,
    },
  });

  // Check if admin exists
  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(body.password, admin.password);
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Create a session after successful login
  const session = await createSession(admin.id, admin.role);
  return NextResponse.json({ data: session }, { status: 200 });
}
