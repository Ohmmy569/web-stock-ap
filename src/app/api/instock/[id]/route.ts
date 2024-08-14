import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import Part from "@lib/models/part";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      const { 
          amount
      } = await req.json();
      await connectMongoDB();
      const part = await Part.findByIdAndUpdate(id, { 
          amount : amount
      });
      return NextResponse.json(part);
    } catch (error) {
      return NextResponse.json(
        { message: "An error occured while updating parts" },
        { status: 500 }
      );
    }
  }
  
  