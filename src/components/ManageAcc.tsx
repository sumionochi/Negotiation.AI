import React from 'react'
import { Button } from './ui/button'
import { generatePortal } from '@/actions/generatePortal'

type Props = {}

const ManageAcc = (props: Props) => {
  return (
    <form action={generatePortal}>
      <Button className='bg-transparent text-lg hover:bg-transparent' type='submit'>
          Manage Billing
      </Button>
    </form>
  )
}

export default ManageAcc