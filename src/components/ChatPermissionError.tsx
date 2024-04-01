import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

type Props = {}

const ChatPermissionError = (props: Props) => {
  return (
    <Alert>
        <AlertCircle className='h-4 w-4'/>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className='flex'>
            <p className='flex-1'>
                You dont have the permission to access this chat.
                <br />
                <span className='font-bold'>
                    Please ask the chat admin to add you to the chat.
                </span>
            </p>
            <Link href={'/chat'} replace>
                <Button variant={'destructive'}>Dismiss</Button>
            </Link>
        </AlertDescription>
    </Alert>
  )
}

export default ChatPermissionError