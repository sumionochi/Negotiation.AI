import React, { Dispatch, SetStateAction } from 'react'
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { DialogHeader, DialogTitle, Dialog, DialogContent, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';

type Props = {
    isOpen: boolean,
    chatId: string,
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ShareLink = ({isOpen,chatId,setIsOpen}: Props) => {
    const {toast} = useToast();
    const host = window.location.host;
    const linkOfTheChat = process.env.NODE_ENV === "development" ? `http://${host}/chat/${chatId}` : `https://${host}/chat/${chatId}`
    
    async function copyToClipboard() {
        try{
            await navigator.clipboard.writeText(linkOfTheChat);
            console.log("Text is copied");
            toast({
                title: "Copied Successfully",
                description: "Share this to the person you want to chat with. (NOTE: They mush be added to the chat to access it)",
                className: "bg-green-600 text-white",
            });
        } catch(error){
            console.error("Failed to copy text: ", error)
        }
    }

    return (
        <Dialog onOpenChange={(open)=> setIsOpen(open)} open={isOpen} defaultOpen={isOpen}>
            <DialogTrigger asChild>
                <Button className='bg-gradient-to-r text-black from-gray-100 to-gray-300 shadow-md shadow-black' variant={'outline'}>
                    <Copy className='mr-2 w-5 h-5'/>
                    Share Link
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Share Link</DialogTitle>
                    <DialogDescription>
                        Any user who has been {" "}
                        <span>granted access</span>{" "}
                        can use this link
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div>
                        <Label htmlFor='link' className='sr-only'>
                            Link
                        </Label>
                        <Input id='link' defaultValue={linkOfTheChat} readOnly/>
                    </div>
                    <Button type='submit' onClick={()=>copyToClipboard()} size={'sm'} className='px-3 mt-4'>
                        <span className='sr-only'>Copy</span>
                        <Copy className='h-4 w-4'/>
                    </Button>
                </div>
                <DialogFooter className='sm:justify-start'>
                    <DialogClose asChild>
                        <Button type='button' variant={"secondary"}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareLink