import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONOGO_URI ?? "");
  } catch (error: any) {
    throw new Error(error);
  }
};
