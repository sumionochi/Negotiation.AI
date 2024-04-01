"use client";
import React, { useState } from 'react'
import { Button } from './ui/button'
import { MessageSquarePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { useToast } from './ui/use-toast';
import { useSubscriptionStore } from '../../store/store';
import LoadingSpinner from './LoadingSpinner';
import {v4 as uuidv4} from 'uuid';
import { addchatRef } from '@/lib/converters/ChatMembers';
import { serverTimestamp, setDoc } from 'firebase/firestore';

type Props = {}

const CreateChatBtn = ({isLarge}: {isLarge?: boolean}) => {
    const router = useRouter()
    const {data:session} = useSession();
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();
    const subscription = useSubscriptionStore((state)=>state.subscription);

    const NewChat = async() => {
        if(!session?.user.id) return;
        setLoading(true);
        toast({
            title: "Creating your chat room...",
            description: 'Wait Patiently, your negotiation will start soon',
            duration: 3000,
        });

        //Check if pro or not to limit chat
        const chatId = uuidv4();
        await setDoc(addchatRef(chatId, session.user.id), {
            userId: session.user.id!,
            email: session.user.email!,
            timestamp: serverTimestamp(),
            isAdmin: true, //when i create chat, imm the admin
            chatId: chatId,
            image: session.user.image || "",
        }).then(()=> {
            toast({
                title: "Success: Chatroom is ready",
                description: "Let's begin with your negotiation",
                className:"bg-green-500 text-white border-none",
                duration: 2000,
            });
            router.push(`/chat/${chatId}`);
        }).catch((error)=>{
            console.error(error);
            toast({
                title: "Error: Chatroom isn't created",
                description: "Please Retry for your negotiation",
                variant: "destructive",
                duration: 2000,
            });
        }).finally(()=>{
            setLoading(false);
        })


        router.push('/chat/abc')
    }

    if(isLarge) return(
        <div>
            <Button className='text-white font-semibold text-lg p-5 shadow-md shadow-black bg-gradient-to-r from-pink-400 to-pink-600' onClick={NewChat}>
                {loading ? <LoadingSpinner/> : 'Create a New Chat'}
            </Button>
        </div>
    )

    return (
    <Button variant={'ghost'} onClick={NewChat}>
        <MessageSquarePlus className='w-5 h-5' />
    </Button>
  )
}

export default CreateChatBtn