import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import TypePart from "@lib/models/typeofparts";

export async function GET() {
  try {
    await connectMongoDB();
    const typePart = await TypePart.find();
    return NextResponse.json(typePart);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while fetching TypeOfParts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    await connectMongoDB();

    await TypePart.create({
      name,
    });

    return NextResponse.json({ message: "TypeOfPart created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while creating part.", error },
      { status: 500 }
    );
  }
}
