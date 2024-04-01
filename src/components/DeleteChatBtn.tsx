"use client"
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast, useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import useAdminId from '@/hooks/useAdminId'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'

type Props = {
    chatId: string
}

const DeleteChatBtn = ({chatId}: Props) => {
    const {data: session} = useSession();
    const [open, setOpen] = useState(false);
    const {toast} = useToast();
    const router = useRouter();
    const adminId = useAdminId({chatId});

    const handleDelete = async ()=>{
        toast({
            title: "Deleting chat",
            description: "Please wait while we delete the chat..."
        })
        console.log("Deleteing - ", chatId)

        await fetch("/api/chat/delete",{
            method: 'DELETE',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({chatId:chatId})
        }).then(res => {
            toast({
                title: "Success",
                description: "Your chat has been deleted",
                className: "bg-green-600 text-white",
                duration: 3000,
            });
            router.replace(`/chat`);
        }).catch((error)=>{
            console.log(error.message);
            toast({
                title: "Error",
                description: "There was an error while deleting the chat...",
                variant: "destructive"
            })
        }).finally(()=>setOpen(false));
    };

    return session?.user.id === adminId && (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className='bg-gradient-to-r text-white shadow-black shadow-md from-rose-500 via-red-400 to-red-500'>
                        <Trash className='w-5 h-5 mr-2'/>
                        Delete Chat
                    </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will delete the chat for all users.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid grid-cols-2 space-x-2'>
                        <Button className='bg-gradient-to-r text-white from-rose-500 via-red-400 to-red-500 ' onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant={'outline'} onClick={()=>setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
    )
}

export default DeleteChatBtn