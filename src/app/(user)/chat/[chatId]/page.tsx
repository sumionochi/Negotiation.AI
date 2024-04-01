{/*Admin Controls, ChatMembership, ChatMessage, ChatInput*/}
import AdminCtrl from '@/components/AdminCtrl'
import ChatInput from '@/components/ChatInput'
import ChatMessages from '@/components/ChatMessages'
import MemberBadge from '@/components/MemberBadge'
import { getAuthSession } from '@/lib/auth'
import { chatMembersRef } from '@/lib/converters/ChatMembers'
import { sortedMessagesRef } from '@/lib/converters/Message'
import { getDocs } from 'firebase/firestore'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params:{
    chatId: string
  }
}

const ChatScreen = async ({params: {chatId}}: Props) => {
  const session = await getAuthSession()
  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map((doc)=>doc.data());
  const hasAccess = (await getDocs (chatMembersRef(chatId))).docs
  .map((doc)=>doc.id)
  .includes(session?.user.id!);

  if(!hasAccess) redirect(`/chat?error=permission`)
  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <div>
        <AdminCtrl chatId={chatId}/>
        <MemberBadge chatId={chatId}/>
      </div>
      <div className='flex-1'>
        <ChatMessages chatId={chatId} session={session} initialMessages={initialMessages}/>
      </div>
      <div className='w-full sticky bottom-0 px-4'>
        <ChatInput chatId={chatId}/>
      </div>
    </div>
  )
}

export default ChatScreen