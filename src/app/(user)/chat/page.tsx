{/*Chat Permission, Chatlist*/}
import ChatPermissionError from '@/components/ChatPermissionError';
import Chatlist from '@/components/Chatlist';
import React from 'react'

type Props = {
    params: {},
    searchParams: {
        error: string;
    }
}

const ChatPage = ({searchParams: {error} }: Props) => {
  {error && (
    <div className='m-2'>
      <ChatPermissionError/>
    </div>
  )}
  return (
    <div>
        <Chatlist/>
    </div>
  )
}

export default ChatPage