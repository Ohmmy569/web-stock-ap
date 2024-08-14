import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import UserMember from "@lib/models/user";
import bcrypt from "bcryptjs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectMongoDB();
    const user = await UserMember.deleteOne({ _id: id });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while deleting the user." },
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
    const { email, role } = await req.json();
    await connectMongoDB();
    const user = await UserMember.findByIdAndUpdate(id, { email, role });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while updating the user." },
      { status: 500 }
    );
  }
}


export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try{
    const { id } = params;
    const { password } = await req.json();
    const hashedPassword = bcrypt.hashSync(password, 10);
    await connectMongoDB();
    const user = await UserMember.findByIdAndUpdate(id, { password: hashedPassword });
    return NextResponse.json(user);

    }
    catch(error){
        return NextResponse.json(
            { message: "An error occured while updating the user." },
            { status: 500 }
          );
    }
}


