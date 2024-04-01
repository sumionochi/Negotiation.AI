import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {}

const loading = (props: Props) => {
  return (
    <div role='status' className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Loader2 className='w-8 h-8 animate-spin'/>
    </div>
  )
}

export default loading