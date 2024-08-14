"use client";
import React from "react";
import HistoryTable from "@/app/components/HistoryTable";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

function Page() {
  const matches = useMediaQuery("(min-width: 56.25em)");

  return (
    <div>
      <HistoryTable matches={matches} />
    </div>
  );
}

export default Page;
