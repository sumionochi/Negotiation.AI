'use client';

import { Mic, Mic2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm";

function Recorder ({uploadAudio}:{uploadAudio:(blob:Blob)=>void}){
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);  
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const {pending} = useFormStatus();

  useEffect(()=>{
    getMicrophonePermission();
  }, []);  

  const getMicrophonePermission = async ()=>{
    if("MediaRecorder" in window){
        try{
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            setPermission(true);
            setStream(streamData);
        } catch (err: any){
            alert(err.messagee);
        }
    } else {
        alert("Browser not supporting MediaRecorder API");
    }
  }

  const startRecording = async () => {
    
  }

  const stopRecording = async () => {
    
  }

  return (
    <div>
        <Mic className="bg-gradient-to-tr text-white from-violet-500 to-orange-300 shadow-md shadow-black flex flex-row gap-2"/>
        {!permission && (
            <Button onClick={getMicrophonePermission}>Get Microphone</Button>
        )}
        {pending && (
            <p>
                {recordingStatus === 'recording' ? 'recording...' : 'stopped recording'}
            </p>
        )}
        {
            permission && recordingStatus === "inactive" && !pending && (
                <Button onClick={startRecording} className="">
                    Speak
                </Button>
            )
        }
        {
            recordingStatus === 'recording' && (
                <Button onClick={stopRecording} className="">
                    Stop
                </Button>
            )
        }
    </div>
  )
}

export default Recorder