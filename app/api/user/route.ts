import prisma from "@/backend/database/db";

export async function GET() {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users));
}

// add user
export async function POST(request : Request) {
    const user = await request.json();
    const newUser = await prisma.user.create({ data: user });
    return new Response(JSON.stringify(newUser));    
}

// update user
export async function PUT(request: Request) {
    const user = await request.json();
    const updatedUser = await prisma.user.update({ where: { id: user.id }, data: user });
    return new Response(JSON.stringify(updatedUser));
}

// delete user
export async function DELETE(request: Request) {
    const { id } = await request.json();
    const user = await prisma.user.delete({ where: { id } });
    return new Response(JSON.stringify(user));
}
