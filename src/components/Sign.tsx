// Import necessary dependencies
"use client";
import React from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 

type Props = {};

const Sign = (props: Props) => {
  const router = useRouter(); 

  const handleSignIn = async () => {
    const result =  await signIn('google', { callbackUrl: '/chat' });
    if (result?.error) {
      console.error('Sign-in error:', result.error);
    }
  };

  return (
    <Button variant="ghost" onClick={handleSignIn} className="text-white hover:opacity-80 hover:text-white bg-gradient-to-br from-rose-500 to-orange-400 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-9000 dark:to-violet-700 shadow-sm shadow-black border-none">
      Sign In
    </Button>
  );
};

export default Sign;
