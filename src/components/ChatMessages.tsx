"use client";
import { Message, sortedMessagesRef } from '@/lib/converters/Message'
import { Session } from 'next-auth'
import React, { createRef, useEffect } from 'react'
import { useLanguageStore } from '../../store/store'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import { Loader2, MessageCircleIcon, Play, PlayCircle } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner';
import UserAvatar from './UserAvatar';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Props = {
    chatId: string,
    initialMessages: Message[],
    session: Session | null,
}

type Emotion = {
    name: string;
    value: number;
}

const ChatMessages = ({chatId, initialMessages, session}: Props) => {
    const emotions: Emotion[] = [
        { name: 'Anger', value: Math.random() },
        { name: 'Fear', value: Math.random() },
        { name: 'Disappointment', value: Math.random() },
        { name: 'Joy', value: Math.random() },
        { name: 'Sadness', value: Math.random() },
        { name: 'Surprise', value: Math.random() },
        { name: 'Love', value: Math.random() },
        { name: 'Excitement', value: Math.random() },
        { name: 'Anxiety', value: Math.random() },
        { name: 'Confusion', value: Math.random() },
        { name: 'Hope', value: Math.random() },
        { name: 'Guilt', value: Math.random() },
        { name: 'Jealousy', value: Math.random() },
        { name: 'Regret', value: Math.random() },
        { name: 'Relief', value: Math.random() },
        { name: 'Shame', value: Math.random() },
        // Add more emotions as needed
    ];
    
    const getTopEmotions = () => {
        const sortedEmotions = emotions.slice().sort((a, b) => b.value - a.value);
        return sortedEmotions.slice(0, 3);
    };

    const language = useLanguageStore((state)=>state.language);
    const messageEndRef = createRef<HTMLDivElement>();
    const [messages, loading, error] = useCollectionData<Message>(
        sortedMessagesRef(chatId), {initialValue: initialMessages}
    );

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, messageEndRef]);

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
                const topEmotions = getTopEmotions();
                return (
                    <div key={message.id} className={`flex items-end w-full ${sender ? "justify-end" : "justify-start"}`}>
                        <div className={`flex p-2 relative flex-col my-8 border-2 gap-4 rounded-lg ${!sender ? "bg-white/30" : " bg-lime-300/60 dark:bg-lime-300/70"}`} >
                            <div className='flex flex-row justify-between gap-6'>
                                <p className='border-2 p-2 px-4 rounded-lg'>{message.user.name.split(" ")[0]}</p>
                                <div className='border-2 p-2 px-4 rounded-lg'>{message?.timestamp?.toDateString() || ""}</div>
                            </div>
                            <div className='flex flex-row justify-between gap-6'>
                                <div className='w-full'>
                                    <div className='border-l-4 p-4 flex flex-row items-center justify-start gap-4'>
                                        <p>{message.translated?.[language] || message.input}</p>
                                        <div>{!message.translated && <Loader2 className='w-6 h-6 animate-spin'/>}</div>   
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 w-full border-2 rounded-lg p-4'> 
                                    <p className='underline underline-offset-2 whitespace-nowrap'>Detected Expressions</p>
                                    {topEmotions.map(emotion => (
                                        <div className='gap-2' key={emotion.name}>
                                            <div className='flex gap-6 whitespace-nowrap mb-1 flex-row justify-between'>
                                                <p>{emotion.name}</p>
                                                <div>{emotion.value.toFixed(3)}</div>
                                            </div>
                                            <Progress value={Math.random() * 100} className='rounded-sm'/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* <div className='flex flex-row gap-4 items-center'>
                                <Button className='bg-transparent m-0 p-0 hover:bg-transparent'>
                                    <PlayCircle/>
                                </Button>
                                <p>Intent : <i>Given Intent that was extracted from audio.</i></p>
                            </div> */}
                            {/* <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger><Progress className='absolute rounded-full -top-5 left-0' value={63}/></TooltipTrigger>
                                    <TooltipContent className='absolute rounded-lg p-4 whitespace-nowrap -top-88 left-0'>
                                        Probable Negotiation Meter
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider> */}
                            
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default ChatMessages;
