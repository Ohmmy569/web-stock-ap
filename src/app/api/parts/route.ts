import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import Part from "@lib/models/part";


export async function GET() {
  try {
    await connectMongoDB();
    const parts = await Part.find();
    return NextResponse.json(parts);
  } catch (error) {
    return NextResponse.json({ message: "An error occured while fetching parts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
    
    await Part.create({ 
        code,
        name,
        type,
        brand,
        model,
        costPrice,
        sellPrice,
        amount : 0
    });

    return NextResponse.json({ message: "Part created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while creating part." , error},
      { status: 500 }
    );
  }
}
