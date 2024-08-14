import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import Brandcar from "@lib/models/brandcar";

export async function GET() {
  try {
    await connectMongoDB();
    const brandcar = await Brandcar.find();
    return NextResponse.json(brandcar);
    // await Brandcar.create({
    //     brand: "Toyota",
    // });
    // await Brandcar.create({
    //     brand: "Honda",
    // });
    return NextResponse.json({ message: "brand created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while fetching brandcar." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { brand } = await req.json();
    await connectMongoDB();
    await Brandcar.create({
        brand,
    });

    return NextResponse.json({ message: "brand created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while creating brand.", error },
      { status: 500 }
    );
  }
}
