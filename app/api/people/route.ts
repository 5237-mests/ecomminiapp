import prisma from "@/utils/prisma";

export async function GET() {
    const people = await prisma.people.findMany();
    return new Response(JSON.stringify(people));
}

export async function POST(request: Request) {
    const user = await request.json();
    const newUser = await prisma.people.create({ data: user });
    return new Response(JSON.stringify(newUser));
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const user = await prisma.people.delete({ where: { id } });
    return new Response(JSON.stringify(user));
}

export async function PUT(request: Request) {
    const user = await request.json();
    const updatedUser = await prisma.people.update({ where: { id: user.id }, data: user });
    return new Response(JSON.stringify(updatedUser));
}
