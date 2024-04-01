import CheckOut from '@/components/CheckOut'
import PricingCards from '@/components/PricingCards'
import { Button } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import { Check } from 'lucide-react'
import React from 'react'

type Props = {}

const Register = async (props: Props) => {
  const session = await getAuthSession();
  return (
    <div className='mt-20 flex p-4 flex-col gap-10 max-w-7xl mx-auto'>
      <h1 className='text-center text-white font-semibold text-3xl md:text-5xl xl:text-6xl'>Let's unlock the full potential {session?.user?.name?.split(" ")?.[0]}</h1>
      <div className='mx-auto mb-10'>
      <h2 className='text-pink-900 dark:text-purple-300 text-center'>We are 99% sure to have a plan that match 100% of your needs</h2>
      <PricingCards redirect={false}/>
      </div>
    </div>
  )
}

export default Register