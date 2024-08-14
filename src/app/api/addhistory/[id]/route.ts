import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import History from "@lib/models/history";
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();
    const history = await History.deleteOne({ _id: id });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while deleting history" },
      { status: 500 }
    );
  }
}




