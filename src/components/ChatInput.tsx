'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, Form, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { User, limitedMessagesRef, messageRef } from '@/lib/converters/Message';
import { Button } from './ui/button';
import { useSubscriptionStore } from '../../store/store';
import { useToast } from './ui/use-toast';

import { useRouter } from 'next/navigation';
import { ToastAction } from './ui/toast';
import { ArrowRight, Mic, MicOff } from 'lucide-react';

const formSchema = z.object({
    input: z.string().max(1000),
})

declare global {
    interface Window {
      webkitSpeechRecognition: any;
    }
  }

const ChatInput = ({chatId}: {chatId: string}) => {
    // State variables to manage recording status, completion, and transcript
    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [transcript, setTranscript] = useState("");

    // Reference to store the SpeechRecognition instance
    const recognitionRef = useRef<any>(null);

    // Function to start recording
    const startRecording = () => {
        setIsRecording(true);
        // Create a new SpeechRecognition instance and configure it
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // Event handler for speech recognition results
        recognitionRef.current.onresult = (event: any) => {
        const { transcript } = event.results[event.results.length - 1][0];

        // Log the recognition results and update the transcript state
        console.log(event.results);
        setTranscript(transcript);
        };

        // Start the speech recognition
        recognitionRef.current.start();
    };

    // Cleanup effect when the component unmounts
    useEffect(() => {
        return () => {
            // Stop the speech recognition if it's active
            if (recognitionRef.current) {
            recognitionRef.current.stop();
            }
        };
    }, []);

    // Function to stop recording
    const stopRecording = () => {
        if (recognitionRef.current) {
            // Stop the speech recognition and mark recording as complete
            recognitionRef.current.stop();
            setRecordingComplete(true);
        }
    };

    // Toggle recording state and manage recording actions
    const handleToggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    const subscription = useSubscriptionStore((state)=>state.subscription);
    const {data:session} = useSession();
    const {toast} = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            input: transcript,
        }
    })

    async function onSubmit(values:z.infer<typeof formSchema>) {
        const inpValue = values.input.trim();
        form.reset();
        if(inpValue.length === 0){
            return
        }
        if(!session?.user){
            return;
        }
        const messages = (await getDocs(limitedMessagesRef(chatId))).docs.map(
            (doc)=>doc.data()
        ).length
        const Pro = subscription?.role === null && subscription.status === 'active';
        if(!Pro && messages >=20){
            toast({
                title: "Free plan limit exceeded",
                description: "The 20 messages per chat limit has exceeded. Upgrade to Health Pro for unlimited chat consultation",
                variant: "destructive",
                action: (
                    <ToastAction altText='Upgrade' onClick={()=>router.push('/register')}>
                        Upgrade to Health Pro plan.
                    </ToastAction>
                )
            })
        }
        const userToStore: User = {
            id: session.user.id!,
            name: session.user.name!,
            email: session.user.email!,
            image: session.user.image || "",
        };
        addDoc(messageRef(chatId),{
            input: inpValue,
            timestamp: serverTimestamp(),
            user: userToStore,
        });
    }

    return (
        <div className='w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-center gap-4 p-2 rounded-t-xl w-full mx-auto bg-white border dark:bg-slate-800'>
                    {!isRecording ? (
                        <Button onClick={handleToggleRecording} className='rounded-full bg-gradient-to-tr text-white from-violet-500 to-orange-300 shadow-md shadow-black flex flex-row gap-2'>
                            <Mic className='cursor-pointer'/>
                        </Button>
                    ):(
                        <Button onClick={handleToggleRecording} className='bg-gradient-to-tl from-red-200 to-red-600 text-white shadow-md shadow-black flex flex-row gap-2 rounded-full'>
                            <MicOff className='cursor-pointer'/>
                        </Button>
                    )}
                    
                    <FormField control={form.control} name='input' render={({field})=>(
                        <FormItem className='flex-1'>
                            <FormControl>
                                <Input className='border-none bg-transparent dark:placeholder:text-white/70' placeholder="Enter message" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <Button type='submit' className='bg-gradient-to-tr text-white from-violet-500 to-orange-300 shadow-md shadow-black flex flex-row gap-2' text-white>
                        <p>Send</p>
                        <ArrowRight className='w-5 h-5'/>
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ChatInput