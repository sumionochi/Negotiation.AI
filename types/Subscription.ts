//Type Defination for stripe subscriptions storing in firebaseDb

import { DocumentData, DocumentReference, Timestamp } from "firebase-admin/firestore";
import Stripe from 'stripe';

export interface Subscription{
  id?: string;
  metadata: {
    [name: string]: string;
  };
  stripeLink: string;
  role: string | null;
  quantity: number;

  items: Stripe.SubscriptionItem[];
 
  product: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
  
  price: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
  
  prices: Array<
    FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  >;
  
  payment_method?: string;
  latest_invoice?: string;
  
  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid';
  
  cancel_at_period_end: boolean;
  
  created: FirebaseFirestore.Timestamp;
  
  current_period_start: FirebaseFirestore.Timestamp;
  
  current_period_end: FirebaseFirestore.Timestamp;
  
  ended_at: FirebaseFirestore.Timestamp | null;
  
  cancel_at: FirebaseFirestore.Timestamp | null;
  
  canceled_at: FirebaseFirestore.Timestamp | null;
  
  trial_start: FirebaseFirestore.Timestamp | null;
  
  trial_end: FirebaseFirestore.Timestamp | null;
}