import React from 'react'
import Logo from './Logo'
import { Themetoggle } from './ui/Themetoggle'
import UserAccountNav from './UserAccountNav'
import { authOptions, getAuthSession } from '@/lib/auth'
import Sign from './Sign'
import Link from 'next/link'
import { MessageSquareIcon } from 'lucide-react'
import { Button } from './ui/button'
import CreateChatBtn from './CreateChatBtn'
import UpgradeBanner from './UpgradeBanner'
import LangSelect from './LangSelect'

type Props = {}

const NavHeader = async (props: Props) => {
  const session = await getAuthSession();
  console.log(session);
  return (
    <header className='sticky top-0 z-50 backdrop-blur-sm mx-auto'>
      <nav className='flex max-w-7xl gap-2 flex-col sm:flex-row items-center p-5 pl-2 bg-none mx-auto'>
        <Logo/>
        <div className='flex-1 flex items-center justify-end space-x-4'>
          <div className='flex flex-col sm:flex-row bg-secondary p-2 rounded-lg'>
            <div className='flex items-center justify-center'>
              <LangSelect/> 
            </div>   
            <div className='flex flex-row gap-2 items-center sm:ml-2'>
            {session ? (
              <>
                <Link href={'/chat'} prefetch={false}>
                  <Button variant={'ghost'} className=''>
                    <MessageSquareIcon className='text-primary w-5 h-5'/>
                  </Button>
                </Link>
                <CreateChatBtn/>
              </>
            ):(
              <Link href={'/pricing'}>
                <Button className='bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-80 text-white shadow-sm shadow-black border-none hover:bg-white/10'>
                  Pricing
                </Button>
              </Link>
            )}
            <Themetoggle className=''/>
            {session?.user ? <UserAccountNav session={session}/> : <Sign/>}
            </div>
          </div>
        </div>
      </nav>
      <div className='w-full flex'>
        <UpgradeBanner/>
      </div>
    </header>
  )
}

export default NavHeader