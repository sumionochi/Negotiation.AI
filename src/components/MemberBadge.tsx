"use client"
import useAdminId from '@/hooks/useAdminId'
import { ChatMembers, chatMembersRef } from '@/lib/converters/ChatMembers'
import React from 'react'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import LoadingSpinner from './LoadingSpinner'
import { Badge } from './ui/badge'
import UserAvatar from './UserAvatar'
import { getAuthSession } from '@/lib/auth'

type Props = {
    chatId: string
}

const MemberBadge = async({chatId}: Props) => {
    const [members, loading, error] = useCollectionData<ChatMembers>(
        chatMembersRef(chatId)
    )
    const adminId = useAdminId({chatId});
    if(loading && !members) return <LoadingSpinner/>
    return (
        !loading && (
            <div className='p-2 border-2 bg-primary/50 rounded-xl m-5'>
                <div className='flex flex-wrap md:justify-start items-center gap-2 p-2'>
                    {members?.map((member)=>(
                        <Badge variant={"secondary"} key={member.email} className='h-14 p-5 pl-2 pr-5 flex space-x-2'>
                            <div className='flex items-center sm:space-x-2'>
                                <UserAvatar name={member.email} image={member.image} />
                            </div>
                            <div className='max-sm:hidden'>
                                <p>{member.email}</p>
                                {member.userId === adminId && (
                                    <p className='text-indigo-400 animate-pulse'>Admin</p>
                                )}
                            </div>
                        </Badge>
                    ))}
                </div>
            </div>
        )
    )
}

export default MemberBadge