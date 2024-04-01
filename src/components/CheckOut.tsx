"use client";
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Loader2 } from 'lucide-react';
import { useSubscriptionStore } from '../../store/store';
import ManageAcc from './ManageAcc';

function CheckOut(){
  const {data: session} = useSession();
  const [loading, setLoading] = useState(false);
  const subscription = useSubscriptionStore((state)=>state.subscription);

  const isLoading = subscription === undefined;
  const isSubscribed = subscription?.status === 'active' && subscription?.role === null;

  const createCheckOut = async() => {
    if(!session?.user.id) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, 'customers', session.user.id, "checkout_sessions"),{
      price: "price_1OBI3mSH9srfznyTuyRVGmpJ",
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    })
    return onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;

      if(error){
        alert(`An error occurred: ${error.message}`);
        setLoading(false);
      }

      if(url){
        window.location.assign(url);
        setLoading(false);
      }

    })
  }
    
  return (
    <div className='text-white rounded-lg flex justify-center items-center hover:opacity-80 shadow-md shadow-black border-none font-semibold text-xl px-4 py-1 h-12 bg-gradient-to-br from-rose-500 to-orange-400 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-9000 dark:to-violet-700'> 
        {isSubscribed && (
          <>
            <hr className='mt-5' />
            <p className='pt-5 text-center text-xs text-indigo-600'>You are subscribed to Health Pro</p>
          </>
        )}
        {isSubscribed ? (<ManageAcc/>) : isLoading || loading ? <Loader2 className='w-7 h-7 animate-spin'/> : <Button className='bg-transparent text-lg hover:bg-transparent' onClick={()=>createCheckOut()}>Sign Up</Button>}
    </div>
  )
}

export default CheckOut