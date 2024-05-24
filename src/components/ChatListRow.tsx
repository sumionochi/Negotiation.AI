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

    const Welcome = () => {
      if (language === 'en') return 'Welcome';
      else if (language === 'hi') return 'स्वागत है';
      else if (language === 'bn') return 'স্বাগতম';
      else if (language === 'gu') return 'આવકાર';
      else if (language === 'or') return 'ସ୍ୱାଗତ';
      else if (language === 'ml') return 'സ്വാഗതം';
      else if (language === 'mr') return 'स्वागत';
      else if (language === 'pa') return 'ਸੁਆਗਤ';
      else if (language === 'ta') return 'வரவேற்கிறோம்';
      else if (language === 'te') return 'స్వాగతం';
      else return 'Welcome';
    }

    const NewChat = () => {
      if (language === 'en') return 'New Chat';
      else if (language === 'hi') return 'नई बातचीत';
      else if (language === 'bn') return 'নতুন চ্যাট';
      else if (language === 'gu') return 'નવો ચેટ';
      else if (language === 'or') return 'ନୂଆ ଚାଟ୍';
      else if (language === 'ml') return 'പുതിയ ചാറ്റ്';
      else if (language === 'mr') return 'नवीन गप्पा';
      else if (language === 'pa') return 'ਨਵੀਂ ਗੱਲਬਾਤ';
      else if (language === 'ta') return 'புதிய அரட்டை';
      else if (language === 'te') return 'కొత్త చాట్';
      else return 'New Chat';
    }


    const row = (message?: Message) => {
      return(
        <div key={chatId} onClick={()=>router.push(`/chat/${chatId}`)} className="flex p-5 items-center space-x- cursor-pointer hover:bg-gray-100 border-2 shadow-md shadow-black dark:hover:bg-slate-700 rounded-lg">
          <UserAvatar name={message?.user.name || session?.user.name} image={message?.user.image || session?.user.image} className="m-2"/>
          <div className="flex-1">
            <p className="font-bold text-primary">
              {!message && NewChat()}
              {message && [message?.user.name || session?.user.name].toString().split(' ')[0]}
            </p>
            <p className="text-primary line-clamp-1">
              {message?.inputBhashini[language] || Welcome()}
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