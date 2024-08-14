import NextAuth from "next-auth";
import { connectMongoDB } from "@lib/connectDB";
import UserMember from "@lib/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          // Connect to the MongoDB database
          await connectMongoDB();

          // Find the user by email
          const user = await UserMember.findOne({ email: credentials?.email });

          // If user does not exist

          const input = credentials?.password;
          const isValidPassword = await bcrypt.compare(
            input as string,
            user.password
          );

          if (user && isValidPassword) {
            return {
              id: user._id,
              email: user.email,
              role: user.role,
            };
          }

          return null;
        } catch (error: any) {
          throw new Error(
            JSON.stringify({ code: error.code, message: error.message })
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      session.user = token;
      session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);
