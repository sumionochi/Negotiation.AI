import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Session, User } from 'next-auth'
import Image from 'next/image'
import React from 'react'

type Props = {
  name: string | null | undefined
  image: string | null | undefined
  className?: string
}
const UserAvatar = ({ name, image, className}: Props) => {
  return (
    <Avatar className={cn("flex items-center justify-center", className)}>
      {image && (
          <Image
              fill
              src={image}
              alt='User-Profile'
              referrerPolicy='no-referrer'
              sizes='100px'// Set the height based on your design requirements
              priority
            />
      )}
        <AvatarFallback delayMs={1000} className='bg-secondary text-primary text-lg'>
          {name ?.split(" ").map((n)=>n[0]).join("")}
        </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
