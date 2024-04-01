'use client';

import React, { Children, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { onSnapshot } from 'firebase/firestore';
import { subRef } from '@/lib/converters/Subscription';
import { useSubscriptionStore } from '../../store/store';
import { stat } from 'fs';

type Props = {}

const Subprovider = ({children}:{children: React.ReactNode}) => {
  const {data:session} = useSession();  
  const setSubscription = useSubscriptionStore((state)=>state.setSubscription)
  useEffect(()=>{
    if(!session) return;
     return onSnapshot(subRef(session?.user.id), (snapshot)=>{
      if(snapshot.empty){console.log('No user snapshot'); setSubscription(null);}
      else{console.log('User has subscription');setSubscription(snapshot.docs[0].data())}
     },
     (error)=>{
      console.log("Error getting the document", error);
     })
  },[session, setSubscription]);

  return (
    <>{children}</>
  )
}

export default Subprovider