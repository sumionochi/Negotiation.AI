'use client'
import React from 'react'
import { useSubscriptionStore } from '../../store/store'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

type Props = {}

const UpgradeBanner = (props: Props) => {
    const subscription = useSubscriptionStore((state)=> state.subscription);
    const Pro = subscription?.role === null;
    const router = useRouter();

    //console.log(subscription);
    if(subscription === undefined || Pro) return null;

    return (
        <Button className='text-white top-20 hover:opacity-80 font-semibold text-sm sm:text-lg px-4 py-6 w-full bg-gradient-to-r from-fuchsia-600 rounded-none to-pink-600' onClick={()=>router.push('/register')}> 
            Upgrade to Negotiation Pro to unlock all features 
        </Button>
    )
}

export default UpgradeBanner