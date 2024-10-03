import prisma from "@/backend/database/db";

export async function GET() {
    // list all tables in the database
    // const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    // return new Response(JSON.stringify(tables));

    // LIST of databases
    // const databases = await prisma.$queryRaw`SELECT datname FROM pg_database`;
    // return new Response(JSON.stringify(databases));
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users));
}

// delete user
export async function DELETE(request: Request) {
    const { id } = await request.json();
    const user = await prisma.user.delete({ where: { id } });
    return new Response(JSON.stringify(user));
}