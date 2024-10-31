import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';


// Get comments by ID
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const id = params.id;

        const comments = await prisma.comment.findMany({
            where: { product_id: id },
            include: { user: true },
        })

        if (!comments) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        return NextResponse.json({ data: comments }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Fetch failed', details: error }, { status: 500 });
    }
};

// Add comment
export const POST = async (req: Request, { params }: { params: { id: string } }) => {
    // Add comment
    try {
        const id = params.id;
        const formData = await req.formData();
        const {content, user_id} = Object.fromEntries(formData.entries());
        const comment = await prisma.comment.create({
            data: {
                content : content as string,
                user_id: user_id as string,
                product_id: id as string,
            }
        });
        return NextResponse.json({ data: comment }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Fetch failed', details: error }, { status: 500 });
    }
}
