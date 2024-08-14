"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "next-auth/react";


function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return router.push("/dashboard/parts");
  }
}

export default Page;
