//api endpoint here.
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
    const {chatId} = await req.json();
    const ref = adminDb.collection("chats").doc(chatId);

    const bulkWriter = adminDb.bulkWriter();
    const allowed_attempts = 5;

    bulkWriter.onWriteError((error)=>{
        if(error.failedAttempts < allowed_attempts){
            return true;
        }
        else {
            console.log("Failed write at document: ", error.documentRef.path)
            return false;
        }
    })
    try{
        await adminDb.recursiveDelete(ref, bulkWriter);
        return NextResponse.json(
            {success: true,}, {status: 200}
        );
    }
    catch (error) {
        console.error("Promise rejected: ", error);
        return NextResponse.json(
            {success: false}, {status: 500}
        )
    }
}