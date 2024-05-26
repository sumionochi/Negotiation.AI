// ChatInput.tsx
"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, Form, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { Message, User, limitedMessagesRef, messageRef, sortedMessagesRef } from "@/lib/converters/Message";
import { Button } from "./ui/button";
import { useSubscriptionStore } from "../../store/store";
import { useToast } from "./ui/use-toast";

import { useRouter } from "next/navigation";
import { ToastAction } from "./ui/toast";
import { ArrowRight, LoaderIcon, Mic, MicOff } from "lucide-react";
import { AudioRecorderWithVisualizer } from "@/components/AudioMic";

import {
  LanguageSuppport,
  LanguageSuppportMap,
  useLanguageStore,
} from "@/../store/store";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getAuthSession } from "@/lib/auth";
import { ChatMembers, chatMemberCollectionGroupRef } from "@/lib/converters/ChatMembers";

const formSchema = z.object({
  input: z.string().max(1000),
});

export interface InputBhashini {
  bn: string,
  en: string,
  gu: string,
  hi: string,
  kn: string,
  ml: string,
  mr: string,
  or: string,
  pa: string,
  ta: string,
  te: string,
}

export interface liknessAndIntentBhashiniInput {
  lm1: string;
  sm1: {
    ds1: string[];
    fa1: string[];
    io1: string[];
    np1: string[];
  };
}

interface ChatInputProps {
  chatId: string,
  initialMessages: Message[],
}

const ChatInput = ({ chatId, initialMessages }: ChatInputProps) => {
  const subscription = useSubscriptionStore((state) => state.subscription);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [language, setLanguage, getLanguage, getNotSupportedLanguage] = useLanguageStore((state)=>[state.language, state.setLanguage, state.getLanguage, state.getNotSupportedLanguages]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const [messages, loading, error] = useCollectionData<Message>(
    sortedMessagesRef(chatId), {initialValue: initialMessages}
  );

  const [currentRecord, setCurrentRecord] = useState<{
    file: string | null;
  }>({ file: null });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (values.input.length === 0) {
      return;
    }
  
    if (!session?.user) {
      return;
    }
  
    console.log(language);
    console.log(values.input);
  
    try {
      const inputBhashiniStrings: string[] = [];
      messages?.forEach((message) => {
        const { en } = message.inputBhashini;
        const inputBhashiniString = `en: ${en}`;
        inputBhashiniStrings.push(inputBhashiniString);
      });
      const concatenatedInputBhashini = inputBhashiniStrings.join('\n')
      console.log(concatenatedInputBhashini)

      const likeAndIntent = await fetch('/api/getLikenessAndIntent', {
        method: 'POST',
        body: JSON.stringify({ text: concatenatedInputBhashini }),
      });

      let liknessAndIntentBhashiniInput : liknessAndIntentBhashiniInput;
      let LiknessAndIntentGenerated;
      if (likeAndIntent.ok) {
        const data = await likeAndIntent.json();
        console.log(data);
        liknessAndIntentBhashiniInput = {
          lm1: data.response.likeness_meter,
          sm1: {
            ds1: data.response.summary["Deal Status"],
            fa1: data.response.summary["Final Agreement"],
            io1: data.response.summary["Initial Offer"],
            np1: data.response.summary["Negotiation Process"]
          }
        };
        LiknessAndIntentGenerated = JSON.stringify(liknessAndIntentBhashiniInput);
      } else {
        console.error('Failed to fetch translations:', likeAndIntent.status);
      }

      const inpBhashini = await fetch('/api/getAllTextTranslations', {
        method: 'POST',
        body: JSON.stringify({ text: values.input, sourceLanguage: language }),
      });
  
      if (inpBhashini.ok) {
        const data = await inpBhashini.json();
        console.log(data);
  
        // Map response to InputBhashini interface
        const { bn, en, gu, hi, kn, ml, mr, or, pa, ta, te } = data.response;
        const inputBhashini: InputBhashini = { bn, en, gu, hi, kn, ml, mr, or, pa, ta, te };
  
        const messages = (await getDocs(limitedMessagesRef(chatId))).docs.map((doc) => doc.data()).length;
        const Pro = subscription?.role === null && subscription.status === "active";
  
        if (!Pro && messages >= 20) {
          toast({
            title: "Free plan limit exceeded",
            description: "The 20 messages per chat limit has exceeded. Upgrade to Health Pro for unlimited chat consultation",
            variant: "destructive",
            action: (
              <ToastAction altText="Upgrade" onClick={() => router.push("/register")}>
                Upgrade to Health Pro plan.
              </ToastAction>
            ),
          });
        }
  
        const userToStore: User = {
          id: session.user.id!,
          name: session.user.name!,
          email: session.user.email!,
          image: session.user.image || "",
        };
  
        addDoc(messageRef(chatId), {
          input: LiknessAndIntentGenerated || "Your Negotiation is being Analysed",
          inputBhashini,
          timestamp: serverTimestamp(),
          user: userToStore,
        });
        setIsLoading(false);
      } else {
        console.error('Failed to fetch translations:', inpBhashini.status);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col bg-secondary rounded-lg">
      <AudioRecorderWithVisualizer
        className="p-4 bg-secondary border-b-8"
        timerClassName="bottom-4"
        chatId = {chatId}
        initialMessages={initialMessages}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-4 p-2 rounded-t-xl w-full mx-auto bg-white border dark:bg-slate-800"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-none bg-transparent dark:placeholder:text-white/70"
                    placeholder="Enter message"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-gradient-to-tr text-white from-violet-500 to-orange-300 shadow-md shadow-black flex flex-row gap-2"
            text-white
            disabled={isLoading}
          >
            {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin"/> : <><p>Send</p><ArrowRight className="w-5 h-5" /></>}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;