import { getAuthSession } from '@/lib/auth'
import { chatMemberCollectionGroupRef } from '@/lib/converters/ChatMembers'
import { doc, getDocs } from 'firebase/firestore'
import React from 'react'
import ChatListRows from './ChatListRows'
import ChatInput from './ChatInput'

type Props = {}

const Chatlist = async (props: Props) => {
    const session = await getAuthSession();
    const chatSnapshot = await getDocs(chatMemberCollectionGroupRef(session?.user.id!))
    const initialChats = chatSnapshot.docs.map((doc)=>({
        ...doc.data(),
        timestamp: null,
    }))

    return (
        <>
            <ChatListRows initialChats={initialChats}/>
        </>
    )
}

export default Chatlist