"use client";
import { Check} from 'lucide-react'
import React from 'react'
import Sign2 from './Sign2'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import CheckOut from './CheckOut';

const tiers = [
    {
        name: 'Free',
        id: null,
        href: "#",
        priceMonthly: null,
        description: "Get started to have an ideal negotiation right away.",
        features: [
            "40 Messages Chat Limit per Chat",
            "3 Participants capacity per Chat",
            "3 Chatroom capacity per Account",
            "5 Supported Languages",
            "62 hour support response time",
            "No Multimedia support in chats",
            "Standard access to features",
        ],
    },
    {
        name: 'Pro',
        id: 'id_forPRO',
        href: "#",
        priceMonthly: "₹699.00",
        description: "Unlock full potential of Negotiation.AI Platform.",
        features: [
            "Unlimited Messages Chat",
            "Unlimited Participants capacity",
            "Unlimited Chatroom capacity",
            "10 Supported Languages",
            "2 hour dedicated support response time",
            "Multimedia support in chats",
            "Early access to new features",
        ],
    }
]

const PricingCards = ({redirect}:{redirect:boolean}) => {
    const router = useRouter();
    const handleStripe = async () => {
        router.push('/register');
    };
    const handleRegister = async () => {
        router.push('/home');
    };
    console.log(redirect)
  return (
    <div>
        <div className='mt-24 flex flex-col sm:flex-row gap-6'>
            {tiers.map(tier=>(
                <div key={tier.id} className='bg-secondary text-primary p-6 text-start flex gap-4 flex-col rounded-xl shadow-md shadow-black border-none'>
                    <p id={tier.id + tier.name}>{tier.name}</p>
                    <h1 className='font-semibold text-3xl md:text-5xl xl:text-6xl'>
                        {tier.priceMonthly === null ? '₹0.00' : (
                            <>
                            <span>{tier.priceMonthly}</span>
                            <span className='text-base'>/month</span>
                            </>
                        )}
                    </h1>
                    <p>{tier.description}</p>
                    <ul role='list' className='flex flex-col gap-4 my-4'>
                        {tier.features.map(feature=>(
                            <li key={feature} className='flex flex-row gap-2'>
                                <Check/>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    {
                        redirect ? tier.id===null ? <Sign2/> : <Link href={'/register'}><Button className='text-white hover:opacity-80 shadow-md shadow-black border-none font-semibold text-lg px-4 py-6 bg-gradient-to-br from-rose-500 to-orange-400 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-9000 dark:to-violet-700 w-full'> 
                        Upgrade 
                      </Button></Link> : tier.id===null ? <></> : <CheckOut/>
                    }
                </div>
            ))}
        </div>    
    </div>
  )
}

export default PricingCards