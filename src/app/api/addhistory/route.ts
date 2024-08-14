import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import History from "@lib/models/history";

export async function GET() {
  try {
    await connectMongoDB();

    const history = await History.find().sort({ createdAt: -1 });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching history.", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      action,
      user,
      partCode,
      type,
      partName,
      amount,
      brand,
      costPrice,
      salePrice,
    } = await req.json();

    await connectMongoDB();

   
    await History.create({
      action,
      user,
      partCode,
      type,
      partName,
      amount,
      brand,
      costPrice,
      salePrice,
    });


    const allHistory = await History.find().sort({ createdAt: 1 });

    if (allHistory.length > 1000) {

      const excessEntries = allHistory.slice(0, allHistory.length - 20);
      const excessIds = excessEntries.map(entry => entry._id);
      await History.deleteMany({ _id: { $in: excessIds } });
    }

    return NextResponse.json({ message: "History created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while creating history.", error },
      { status: 500 }
    );
  }
}
