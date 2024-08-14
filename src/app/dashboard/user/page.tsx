"use client";
import React from 'react'
import UserTable from '@/app/components/UserTable';
import { useMediaQuery } from '@mantine/hooks';

function Page() {
  const matches = useMediaQuery("(min-width: 56.25em)");
  return (
    <div>
      <UserTable matches={matches} />
    </div>
  )
}

export default Page