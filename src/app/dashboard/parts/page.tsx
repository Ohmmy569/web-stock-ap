"use client";
import PartTable from "@/app/components/PartTable";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";


export default function Page() {
  const matches = useMediaQuery("(min-width: 56.25em)");
  return(
    <div>
      <PartTable matches={matches} />
  
    </div>
  )
}

Page.requiredAuth = true;
