'use server';

import { getAuthSession } from "@/lib/auth";
import Stripe from "stripe";
import {headers} from 'next/headers';
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})

export async function generatePortal() {
    const session = await getAuthSession();
    const host = headers().get('host');

    if(!session?.user.id) return console.log('No user Id');

    const {
        user: {id},
    } = session;

    const returnUrl = process.env.NODE_ENV === 'development' ? `http://${host}/register` : `https://${host}/register`;

    const doc = await adminDb.collection('customers').doc(id).get();

    if(!doc.data) return console.error('No customer record found together with userId', id);

    const stripeId = doc.data()!.stripeId;

    const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeId,
        return_url: returnUrl,
    });

    redirect(stripeSession.url);

}