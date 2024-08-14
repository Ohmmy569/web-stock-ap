import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import Modelcar from "@lib/models/modelcar";

export async function GET() {
  try {
    await connectMongoDB();
    const modelcar = await Modelcar.find();
    return NextResponse.json(modelcar);
    // await Brandcar.create({
    //     brand: "Toyota",
    // });
    // await Brandcar.create({
    //     brand: "Honda",
    // });
    // return NextResponse.json({ message: "car model created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while fetching car model." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { brand , model} = await req.json();
    await connectMongoDB();
    await Modelcar.create({
        name : model,
        brand,
    });

    return NextResponse.json({ message: "car model created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while creating car model.", error },
      { status: 500 }
    );
  }
}
