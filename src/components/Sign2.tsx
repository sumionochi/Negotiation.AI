"use client";
import React from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import { ArrowRight } from 'lucide-react';

type Props = {};

const Sign2 = (props: Props) => {
  const router = useRouter(); 

  const handleSignIn = async () => {
    const result =  await signIn('google', { callbackUrl: '/chat' });
    if (result?.error) {
      console.error('Sign-in error:', result.error);
    }
  };

  return (
    <Button className='text-white hover:opacity-80 shadow-md shadow-black border-none font-semibold text-lg px-4 py-6 bg-gradient-to-br from-rose-500 to-orange-400 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-9000 dark:to-violet-700' onClick={handleSignIn}> 
      Let's Start 
    </Button>
  );
};

export default Sign2;
