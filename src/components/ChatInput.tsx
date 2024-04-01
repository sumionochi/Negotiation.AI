'use client';
import { useSession } from 'next-auth/react';
import React from 'react'
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
import { ArrowBigLeft, ArrowBigRight, ArrowRight } from 'lucide-react';

const formSchema = z.object({
    input: z.string().max(1000),
})

const ChatInput = ({chatId}: {chatId: string}) => {
    const subscription = useSubscriptionStore((state)=>state.subscription);
    const {data:session} = useSession();
    const {toast} = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            input: "",
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
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex space-x-2 p-2 rounded-t-xl w-full mx-auto bg-white border dark:bg-slate-800'>
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