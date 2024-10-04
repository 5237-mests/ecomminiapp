import prisma from "@/utils/prisma";

export async function GET() {
    const user = await prisma.user.findMany();
    return new Response(JSON.stringify(user));
}

// POST /api/user
export async function POST(request: Request) {
    const user = await request.json();
    const newUser = await prisma.user.create({ data: user });
    return new Response(JSON.stringify(newUser));
}
