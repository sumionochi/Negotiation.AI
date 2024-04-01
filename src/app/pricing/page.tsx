import PricingCards from '@/components/PricingCards'
import Sign2 from '@/components/Sign2'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import React from 'react'

type Props = {}

const PricingPage = (props: Props) => {
  return (
    <div className='antialiased gap-4 mt-28 mb-10 max-w-7xl text-white p-4 flex flex-col text-center justify-start items-center mx-auto'>
        <h2 className='text-pink-900 dark:text-purple-300'>Pricing</h2>
        <h1 className='text-center font-semibold text-3xl md:text-5xl xl:text-6xl'>A prefect price for effective negotiation</h1>
        <h2 className='text-pink-900 dark:text-purple-300'>We are 99% sure to have a plan that match 100% of your needs</h2>
        <PricingCards redirect={true}/>
    </div>
  )
}

export default PricingPage