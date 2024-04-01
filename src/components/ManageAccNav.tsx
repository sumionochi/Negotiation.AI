import { generatePortal } from '@/actions/generatePortal'
import React from 'react'
import { Button } from './ui/button'

type Props = {}

const ManageAccNav = (props: Props) => {
  return (
    <form action={generatePortal}>
      <button className='bg-transparent text-lg hover:bg-transparent' type='submit'>
          Manage Billing
      </button>
    </form>
  )
}

export default ManageAccNav