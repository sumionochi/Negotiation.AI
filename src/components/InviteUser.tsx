"use client";
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import * as z from 'zod';
import { useToast } from './ui/use-toast';
import useAdminId from '@/hooks/useAdminId';
import { useSubscriptionStore } from '../../store/store';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { PlusCircle, PlusCircleIcon } from 'lucide-react';
import { DialogHeader } from './ui/dialog';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { addchatRef, chatMembersRef } from '@/lib/converters/ChatMembers';
import { ToastAction } from './ui/toast';
import { getUserByEmailRef } from '@/lib/converters/User';
import ShareLink from './ShareLink';

type Props = {
    chatId: string
}

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const InviteUser = ({chatId}: Props) => {
    const {data:session} = useSession()
    const {toast} = useToast()
    const adminId = useAdminId({chatId})
    const subscription = useSubscriptionStore((state)=>state.subscription)
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [openInviteLink, setOpenInviteLink] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values:z.infer<typeof formSchema>) {
        if(!session?.user.id) return;
        toast({
            title: "Sending invite",
            description: "Please wait while we send the invite"
        })

        const freeUsers = (await getDocs(chatMembersRef(chatId))).docs.map(
            (doc)=> doc.data()
        ).length

        const Pro = subscription?.role === null && subscription.status === "active"

        if(!Pro && freeUsers >=2){
            toast({
                title: 'Free plan limit exceeded',
                description: "You have exceeded the limit of users in a single chat for the Free plan. Please upgrade to Negotiation Pro plan to continue adding users to chats.",
                variant: "destructive",
                action: (
                    <ToastAction altText='Upgrade' onClick={()=>router.push("/register")}>
                        Upgrade to Health Pro
                    </ToastAction>
                )
            })

            return;
        }
        const querySnapshot = await getDocs(getUserByEmailRef(values.email))
        if(querySnapshot.empty){
            toast({
                title: "User not found",
                description: "Please enter an email address of a registered user or resend the invitation once they have signed up.",
                variant:"destructive",
            })
            return
        }
        else{
            const user = querySnapshot.docs[0].data();
            await setDoc(addchatRef(chatId, user.id), {
                userId:user.id!,
                email:user.email!,
                timestamp: serverTimestamp(),
                chatId: chatId,
                isAdmin: false,
                image: user.image || "",
            }).then(()=>{
                setOpen(false);
                toast({
                    title: "Added to room",
                    description:"The user has been added to the chat successfully",
                    className: "bg-green-600 text-white",
                    duration: 3000,
                })
                setOpenInviteLink(true);
            })
        }
        form.reset();
    }
    
    return (
        adminId === session?.user.id && (
            <>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className='shadow-md text-white shadow-black bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600'>
                            <PlusCircleIcon className='mr-2 w-5 h-5'/>
                            Add User To Chat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-md'>
                        <DialogHeader>
                            <DialogTitle>Add User to Chat</DialogTitle>
                            <DialogDescription>
                                Simply enter another users email address to invite them to this chat {" "}
                                <span className='text-indigo-600 font-bold'>
                                    (Note: they must be registered)
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-2'>
                                <FormField control={form.control} name='email' render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder='buyer@gmail.com' {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                                <Button className='ml-auto sm:w-fit w-full shadow-md shadow-black bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600' type='submit'>
                                    Add to chat
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <ShareLink isOpen={openInviteLink} setIsOpen={setOpenInviteLink} chatId={chatId}/>
            </>
        )
    )
}

export default InviteUser