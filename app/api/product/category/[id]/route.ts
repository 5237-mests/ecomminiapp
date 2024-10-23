import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";



// Get product by ID
export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id);

    const product = await prisma.product.findMany({
      where: { category_id: id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Fetch failed", details: error },
      { status: 500 }
    );
  }
};
