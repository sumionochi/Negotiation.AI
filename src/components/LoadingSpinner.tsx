import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {}

const LoadingSpinner = (props: Props) => {
  return (
    <div role='status' className='flex justify-start items-center'>
        <Loader2 className='w-8 h-8 animate-spin'/>
    </div>
  )
}

export default LoadingSpinner