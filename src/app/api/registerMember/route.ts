//src/app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import UserMember from "@lib/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password , role } = await req.json();
    
    const hashedPassword = bcrypt.hashSync(password, 10) ;

    await connectMongoDB();
    const user = await UserMember.findOne({ email });
    if (user) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }
    await UserMember.create({ email, password: hashedPassword , role });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while registering the user." , error},
      { status: 500 }
    );
  }
}
