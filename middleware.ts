
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;


  if (!user && path.startsWith("/api/auth")) {

    return NextResponse.next();
  }

  if (!user) {
    
    if (path.startsWith("/api")) {
  
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (user && path === "/login") {
    
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }


  return NextResponse.next();
}


export const config = {
  matcher: [
    "/",
    "/api/addhistory",
    "/api/brandcar",
    "/api/checkUser",
    "/api/instock",
    "/api/modelcar",
    "/api/outstock",
    "/api/parts",
    "/api/register",
    "/api/typeofparts",
    "/api/users",
    "/dashboard/carbrand",
    "/dashboard/carmodel",
    "/dashboard/partHistory",
    "/dashboard/parts",
    "/dashboard/typeofparts",
    "/dashboard/users",
  ],
};
