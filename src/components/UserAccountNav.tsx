'use client'

import React from 'react'
import { Button } from './ui/button'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { LogOut, Sparkle, Sparkles, StarIcon } from 'lucide-react'
import UserAvatar from './UserAvatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
import { useSubscriptionStore } from '../../store/store'
import ManageAcc from './ManageAcc'
import ManageAccNav from './ManageAccNav'
import { generatePortal } from '@/actions/generatePortal'

type Props = {
    session: Session | null
};

const UserAccountNav = ({session}: Props) => {
  const subscription = useSubscriptionStore((state)=>state.subscription);
  
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <UserAvatar name={session?.user.name} image={session?.user.image}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='rounded-lg shadow-md p-2 bg-secondary border border-gray-300'>
                        <DropdownMenuItem>
                            <p className='font-medium text-primary flex flex-row gap-1'>
                                My Account 
                                {subscription?.role === null && <span className='flex flex-row justify-center items-center gap-1'><span>(Pro)</span><Sparkles className='w-4 h-4'/></span>}
                            </p>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        {
                            subscription?.role === null && (
                                <DropdownMenuItem>
                                    <form action={generatePortal}>
                                        <button className='bg-transparent font-semibold hover:bg-transparent' type='submit'>
                                            Manage Billing
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            )
                        }
                        <DropdownMenuItem className='cursor-pointer'>
                       {session?.user?.name && (<p className=' font-medium text-primary'>{session.user.name}</p>)}
                       </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer'>
                        {session?.user?.email && (<p className='font-medium text-primary'>{session.user.email}</p>)}
                        </DropdownMenuItem>
                <>
                    <DropdownMenuItem onSelect={()=>{
                    signOut();
                }} className=' text-red-600 cursor-pointer flex flex-row items-center px-2 focus:outline-none'>
                    Sign Out
                    <LogOut className='w-4 h-4 ml-2'/>
                    </DropdownMenuItem>
                </>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav