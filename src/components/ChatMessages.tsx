"use client";
import { Message, sortedMessagesRef } from '@/lib/converters/Message'
import { Session } from 'next-auth'
import React, { createRef, useEffect, useRef } from 'react'
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
    label: string;
    score: number;
  };

const ChatMessages = ({chatId, initialMessages, session}: Props) => {
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
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
                        <span className='font-bold'>Invite </span>&{" "}
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
                let parseInput;
                let audioInputCheck;
                let audioSrc;

                console.log(message.id);

                if(message.inputBhashini['en'] == "Call Recording"){
                    audioInputCheck = message.inputBhashini[language];
                    audioSrc = message.audioBhashini?.audios![language];
                    console.log(audioSrc);
                }

                if(message.input == "Your Negotiation is being Analysed"){
                    parseInput = message.input;
                } else {
                    parseInput = JSON.parse(message.input);
                }

                return (
                    <div key={message.id} className={`flex items-end w-full ${sender ? "justify-end" : "justify-start"}`}>
                        <div className={`flex w-96 p-2 relative flex-col my-8 border-2 gap-4 rounded-lg ${!sender ? "bg-white/30" : " bg-lime-300/60 dark:bg-lime-300/70"}`} >
                            <div className='flex flex-row justify-between gap-4 text-xs'>
                                <p className='border-2 p-2 px-4 rounded-lg'>{message.user.name.split(" ")[0]}</p>
                                <div className='border-2 p-2 px-4 rounded-lg'>{message?.timestamp?.toDateString() || ""}</div>
                            </div>
                            <div className='flex flex-row justify-between gap-6 p-2 py-0'>
                                <p>{message.inputBhashini[language]}</p>
                            </div>

                            {typeof audioInputCheck === "string" ? (
                                <>
                                    <div className='flex flex-row justify-start gap-2 bg-white/50 dark:bg-black/50 rounded-xl p-2'>
                                        <div className='flex flex-col p-2 gap-2 text-xs'>
                                        <audio
                                            ref={(ref) => (audioRefs.current[message.id!] = ref)}
                                            src={audioSrc}
                                            controls
                                            autoPlay
                                            hidden
                                        />
                                        <p><b>Transcript : </b> {message.audioBhashini!.transcriptions[language]}</p>
                                        <p className='flex flex-row gap-2'>
                                        {message.emotionBhashini
                                            ?.sort((a:any, b:any) => b.score - a.score) // Sort in descending order of score
                                            .slice(0, 3) // Take the first 3 elements
                                            .map((emotion:Emotion, index:number) => (
                                            <p key={index} className="bg-secondary rounded-md px-2 py-1">
                                                {emotion.label}: {emotion.score.toFixed(4)}
                                            </p>
                                            ))}
                                        </p>
                                        </div>
                                    </div>
                                    
                                </>
                            ):(
                                <></>
                            )}

                            {typeof parseInput === "string" ? (
                                <></>
                                ) : (
                                <>
                                    <div className='flex flex-row justify-start gap-2 bg-white/50 dark:bg-black/50 rounded-xl p-2'>
                                        <div className='flex flex-col p-2 gap-2 text-xs mb-1'>
                                            <p className='underline'>Current Negotiation Analysis</p>
                                            <div className='flex flex-col gap-1'>
                                                <div className='flex flex-row gap-1'>
                                                    <p className='font-semibold'>• Likness Of Successful Negotiation : ({parseInput.lm1}%)</p>
                                                    <Progress value={parseInput.lm1} className='rounded-sm w-14'/>
                                                </div>
                                                <p><b className='font-semibold'>• Initial Offer :</b> {parseInput.sm1.io1 || "pending"}</p>
                                                <p><b className='font-semibold'>• Negotiation Process :</b> {parseInput.sm1.np1 || "pending"}</p>
                                                <p className='bg-green-300 dark:bg-green-600 p-1 rounded-md'><b className='font-semibold'>• Suggested Final Agreement :</b> {parseInput.sm1.fa1 || "pending"}</p>
                                                <p><b className='font-semibold'>• Deal Status :</b> {parseInput.sm1.ds1 || "pending"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default ChatMessages;


