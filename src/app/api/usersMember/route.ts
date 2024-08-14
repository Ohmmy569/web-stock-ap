import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import UserMember from "@lib/models/user";


export async function GET() {
  try {
    await connectMongoDB();
    const users = await UserMember.find();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "An error occured while fetching users." }, { status: 500 });
  }
}
