import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import Part from "@lib/models/part";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();
    const part = await Part.deleteOne({ _id: id });
    return NextResponse.json(part);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while deleting part" },
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
    const { 
      code,
      name,
      type,
      brand,
      model,
      costPrice,
      sellPrice,
     } = await req.json();
    await connectMongoDB();
    const part = await Part.findByIdAndUpdate(id, {
      code,
      name,
      type,
      brand,
      model,
      costPrice,
      sellPrice,
     });
    return NextResponse.json(part);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while updating the part." },
      { status: 500 }
    );
  }
}



