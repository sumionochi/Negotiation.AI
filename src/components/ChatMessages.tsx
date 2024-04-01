"use client";
import { Message, sortedMessagesRef } from '@/lib/converters/Message'
import { Session } from 'next-auth'
import React, { createRef, useEffect } from 'react'
import { useLanguageStore } from '../../store/store'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import { MessageCircleIcon } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner';
import UserAvatar from './UserAvatar';

type Props = {
    chatId: string,
    initialMessages: Message[],
    session: Session | null,
}

const ChatMessages = ({chatId, initialMessages, session}: Props) => {
    const language = useLanguageStore((state)=>state.language);
    const messageEndRef = createRef<HTMLDivElement>();
    const [messages, loading, error] = useCollectionData<Message>(
        sortedMessagesRef(chatId),{initialValue: initialMessages}
    )
    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior: "smooth"});
    },[messages, messageEndRef]);
    return (
    <div className='p-5'>
        {!loading && messages?.length === 0 && (
            <div className='flex flex-col justify-center items-center p-20 text-center rounded-xl space-y-2 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-extralight'>
                <MessageCircleIcon className='h-10 w-10'/>
                <h2>
                    <span className='font-bold'>Invite a friend </span>&{" "}
                    <span className='font-bold'>
                        Send your first message in any language
                    </span>{" "}
                    below to get started.
                </h2>
                <p>The AI will auto-detect and translate it all for you</p>
            </div>
        )}
        {messages?.map((message)=>{
            const sender = message.user.id === session?.user.id;
            return (
                <div key={message.id} className={`flex items-end w-full ${sender ? "justify-end" : "justify-start"}`}>
                    <div className='flex my-2 border-2 gap-4 p-2 rounded-lg bg-gradient-to-r from-violet-300 to-violet-400 items-center'>
                        <div className={`flex flex-col relative space-y-2 p-4 w-fit line-clamp-1 mx-2 rounded-lg ${sender ? "ml-auto bg-violet-600 text-white rounded-br-none" : "bg-gray-100 dark:text-gray-100 dark:bg-slate-700 rounded-bl-none"}`}>
                            <p className={`text-xs italic font-normal line-clamp-1 ${sender ? "text-right" : "text-left"}`}>
                                {message.user.name.split(" ")[0]}
                            </p>
                        </div>
                        <div className='flex space-x-2'>
                            <p>{message.translated?.[language] || message.input}</p>
                            {!message.translated && <LoadingSpinner/>}
                        </div>
                        <UserAvatar name={message.user.image} image={message.user.image} className={`${!sender && "-order-1"}`}/>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default ChatMessages