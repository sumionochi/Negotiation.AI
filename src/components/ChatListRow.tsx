"use client";

import { Message, limitedSortedMessagesRef } from "@/lib/converters/Message";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { useLanguageStore } from "../../store/store";

function ChatListRow({chatId}:{chatId:string}){
    const {data:session} = useSession();
    const language = useLanguageStore((state)=>state.language);
    const router = useRouter();
    const [messages, loading, error] = useCollectionData<Message>(
      limitedSortedMessagesRef(chatId)
    );

    function prettyUUID(n=4){
      return chatId.substring(0,n);
    }

    const Welcome = ()=> {
      if(language === 'en') return 'Welcome';
      else if(language === 'hi') return 'Welcome';
      else if(language === 'de') return 'Welcome';
      else if(language === 'fr') return 'Welcome';
      else if(language === 'ja') return 'Welcome';
      else if(language === 'ur') return 'Welcome';
      else if(language === 'ta') return 'Welcome';
      else if(language === 'mr') return 'Welcome';
      else if(language === 'ko') return 'Welcome';
      else if(language === 'gu') return 'Welcome';
      else if(language === 'bn') return 'Welcome';
      else return 'Welcome';
    }

    const row = (message?: Message) => {
      return(
        <div key={chatId} onClick={()=>router.push(`/chat/${chatId}`)} className="flex p-5 items-center space-x- cursor-pointer hover:bg-gray-100 border-2 shadow-md shadow-black dark:hover:bg-slate-700 rounded-lg">
          <UserAvatar name={message?.user.name || session?.user.name} image={message?.user.image || session?.user.image} className="m-2"/>
          <div className="flex-1">
            <p className="font-bold text-primary">
              {!message && 'New Chat'}
              {message && [message?.user.name || session?.user.name].toString().split(' ')[0]}
            </p>
            <p className="text-primary line-clamp-1">
              {message?.translated?.[language] || Welcome()}
            </p>
          </div>
          <div className="text-xs text-primary text-right">
            <p className="mb-auto">
              {message ? new Date(message.timestamp).toLocaleTimeString() : "No messages yet"}
            </p>
            <p className="">chat #{prettyUUID()}</p>
          </div>
        </div>
      )
    }

    return(
      <div className="p-4">
        {loading && (
          <div className="flex p-5 items-center space-x-2">
            <Skeleton className="h-12 w-12 rounded-full"/>
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-1/4"/>
            </div>
          </div>
        )}
        {messages?.length === 0 && !loading && row()}
        {messages?.map((message) => row(message))}
      </div>
    )
}

export default ChatListRow;