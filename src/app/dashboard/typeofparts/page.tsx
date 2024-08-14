"use client"
import React from 'react'
import PartTypeTable from '@/app/components/PartTypeTable'

import { useDisclosure, useMediaQuery } from "@mantine/hooks";


function Page() {
  
  const matches = useMediaQuery("(min-width: 56.25em)");
  return (
    <div>
      <PartTypeTable matches={matches}/>
    </div>
  )
}

export default Page