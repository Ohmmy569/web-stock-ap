import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import Brandcar from "@lib/models/brandcar";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();
    const brandcar = await Brandcar.deleteOne({ _id: id });
    return NextResponse.json(brandcar);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while deleting brandcar" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { brand } = await req.json();

    await connectMongoDB();
    const brandcar = await Brandcar.findByIdAndUpdate(id, {
        brand,
    });
    return NextResponse.json(brandcar);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while updating the brandcar." },
      { status: 500 }
    );
  }
}
