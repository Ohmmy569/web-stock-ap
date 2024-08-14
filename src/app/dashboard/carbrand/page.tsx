"use client";
import React from "react";
import BrandTable from "@/app/components/BrandTable";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

function Page() {
  const matches = useMediaQuery("(min-width: 56.25em)");

  return <BrandTable matches={matches} />;
}

export default Page;
