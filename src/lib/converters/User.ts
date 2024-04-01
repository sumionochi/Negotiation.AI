// pushing and pulling data to and from firestore 

import { LanguageSuppport } from "../../../store/store";
import { db } from "../firebase";
import { User } from "next-auth";

import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    collection,
    limit,
    query,
    orderBy,
    where,
} from "firebase/firestore";

const userConverter : FirestoreDataConverter<User> = {
    toFirestore: function (customer : User): DocumentData{
        return {
            email: customer.email,
            image: customer.image,
            name: customer.name,
        }
    },
    fromFirestore: function (
        snapshot: QueryDocumentSnapshot, 
        options: SnapshotOptions
        ) : User {
        const data = snapshot.data(options);
        
        return {
            id: snapshot.id,
            email: data.email,
            image: data.image,
            name: data.name,
        }
    }
}

export const getUserByEmailRef = (email: string)=> query(collection(db, "users"), where("email","==",email)).withConverter(userConverter);