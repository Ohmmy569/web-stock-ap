"use client";
import React from "react";
import CarTable from "@/app/components/ModelCartable";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

function Page() {
  const matches = useMediaQuery("(min-width: 56.25em)");
    return <CarTable matches={matches} />;

}

export default Page;
