import { NextRequest, NextResponse } from 'next/server'
import { connectMongoDB } from '@lib/connectDB';
import User from '@lib/models/user';

export async function POST(req : NextRequest) {
    try {

        await connectMongoDB();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");


        return NextResponse.json({ user })

    } catch(error) {
        return NextResponse.json({ message: "An error occured while registering the user." }, { status: 500 })
    }
}