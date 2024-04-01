"use client";

import React from 'react'
import { usePathname } from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import {
    LanguageSuppport,
    LanguageSuppportMap,
    useLanguageStore,
    useSubscriptionStore,
} from "@/../store/store";

import LoadingSpinner from './LoadingSpinner';
import Link from 'next/link';

type Props = {}

const LangSelect = (props: Props) => {
    const [language, setLanguage, getLanguage, getNotSupportedLanguage] = useLanguageStore((state)=>[state.language, state.setLanguage, state.getLanguage, state.getNotSupportedLanguages]);
    
    const subscription = useSubscriptionStore((state)=> state.subscription);
    const Pro = subscription?.role === null && subscription?.status === 'active'; 
    const isPage = usePathname().includes('/chat');

    return (
        isPage && 
        (<div className='max-sm:mb-2'>
            <Select onValueChange={(value: LanguageSuppport)=>setLanguage(value)}>
                <SelectTrigger className='w-[150px] text-primary'>
                    <SelectValue placeholder={LanguageSuppportMap[language]} className=''/>
                </SelectTrigger>
                <SelectContent>
                    {subscription===undefined ? (
                        <LoadingSpinner/>
                    ) : (
                        <>
                            {getLanguage(Pro).map((language)=>(
                                <SelectItem key={language} value={language}>
                                    {LanguageSuppportMap[language]}
                                </SelectItem>
                            ))}
                            {getNotSupportedLanguage(Pro).map((language)=>(
                                <Link href={'/register'} key={language} prefetch={false}>
                                    <SelectItem key={language} value={language} disabled className='bg-gray-300/50 text-gray-500 dark:text-white py-2 my-1'>
                                        {LanguageSuppportMap[language]} (Pro)
                                    </SelectItem>
                                </Link>
                            ))}
                        </>
                    )}
                </SelectContent>
            </Select>
        </div>)
    )
}

export default LangSelect