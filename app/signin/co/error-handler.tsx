"use client"

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
  error: string;
  error_description: string;
}

export default function ErrorHandler({error,error_description}: Props) {
    const router =useRouter();
  return (
    <div className='h-screen bg-sky-50 flex items-center gap-y-4 flex-col justify-center text-secondary-foreground'>
        <h1 className='text-3xl font-bold'>{error}</h1>
        <p className='text-lg'>{error_description}</p>
        <Button size={'lg'} variant={'outline'} onClick={() => router.push('/signin')}>Go Back</Button>
    </div>
  )
}