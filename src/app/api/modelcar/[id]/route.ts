import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import Modelcar from "@lib/models/modelcar";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();
    const modelcar = await Modelcar.deleteOne({ _id: id });
    return NextResponse.json(modelcar);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while deleting car model" },
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
    const { brand , model } = await req.json();

    await connectMongoDB();
    const modelcar = await Modelcar.findByIdAndUpdate(id, {
        name :  model,
        brand,
       
    });
    return NextResponse.json(modelcar);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while updating the car model." },
      { status: 500 }
    );
  }
}
