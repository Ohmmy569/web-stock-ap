import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import TypePart from "@lib/models/typeofparts";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();
    const typePart = await TypePart.deleteOne({ _id: id });
    return NextResponse.json(typePart);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while deleting TypeOfPart" },
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
    const { name } = await req.json();

    await connectMongoDB();
    const typePart = await TypePart.findByIdAndUpdate(id, {
      name,
    });
    return NextResponse.json(typePart);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while updating the TypeOfPart." },
      { status: 500 }
    );
  }
}
