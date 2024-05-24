"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowLeft, ArrowRight, Badge, Delete, Download, LoaderIcon, LucidePhoneOff, Mic, Phone, PhoneOff, Save, Trash } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { Message, User, limitedMessagesRef, messageRef, sortedMessagesRef } from "@/lib/converters/Message";
import {
  LanguageSuppport,
  LanguageSuppportMap,
  useLanguageStore,
} from "@/../store/store";
import { getDocs, query, orderBy, limit } from "firebase/firestore";
import MemberBadge from "./MemberBadge";
import { ChatMembers, chatMembersRef } from "@/lib/converters/ChatMembers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import useAdminId from "@/hooks/useAdminId";
import UserAvatar from "./UserAvatar";
import LoadingSpinner from "./LoadingSpinner";
import LangSelect from "./LangSelect";
import { liknessAndIntentBhashiniInput } from "./ChatInput";

type Props = {
  className?: string;
  timerClassName?: string;
  chatId: string;
  initialMessages: Message[];
};

type Record = {
  id: number;
  name: string;
  file: any;
};

let recorder: MediaRecorder;
let recordingChunks: BlobPart[] = [];
let timerTimeout: NodeJS.Timeout;

// Utility function to pad a number with leading zeros
const padWithLeadingZeros = (num: number, length: number): string => {
  return String(num).padStart(length, "0");
};

const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert Blob to Base64 string'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
// Utility function to send a blob
async function submitRecord(blob: Blob, chatId: string, session: any, language: string, messages:any, setIsLoading: any) {
  const audio = blob;
  console.log(audio);
  if (!session?.user) {
    return;
  }

  const inpBhashini = {
    bn: "কল রেকর্ডিং",
    en: "Call Recording",
    gu: "કૉલ રેકોર્ડિંગ",
    hi: "कॉल रिकॉर्डिंग",
    kn: "ಕರೆ ದಾಖಲೆ",
    ml: "കോൾ രേഖപ്പെടുത്തൽ",
    mr: "कॉल रेकॉर्डिंग",
    or: "କଲ୍ ରେକର୍ଡିଂ",
    pa: "ਕਾਲ ਰਿਕਾਰਡਿੰਗ",
    ta: "அழைப்பு பதிவு",
    te: "కాల్ రికార్డింగ్"
  };

  try {
    setIsLoading(true);
    const inputBhashiniStrings: string[] = [];
    messages?.forEach((message:any) => {
      const inputBhashiniString = message.audioBhashini!.transcriptions['en'];
      inputBhashiniStrings.push(inputBhashiniString);
    });
    const concatenatedInputBhashini = inputBhashiniStrings.join('\n')
    console.log(concatenatedInputBhashini, "here problem")

    const likeAndIntent = await fetch('/api/getLikenessAndIntent', {
      method: 'POST',
      body: JSON.stringify({ text: concatenatedInputBhashini }),
    });

    let liknessAndIntentBhashiniInput : liknessAndIntentBhashiniInput;
    let LiknessAndIntentGenerated;
    if (likeAndIntent.ok) {
      const data = await likeAndIntent.json();
      console.log(data, "H");
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

    const base64Audio = await blobToBase64(audio);
    console.log(base64Audio);
    const audiBhashini = await fetch('/api/getAllAudioTranslations', {
      method: 'POST',
      body: JSON.stringify({ audio_file: base64Audio, sourceLanguage: language, chatId: chatId, messageId: messages })
    });

    if (audiBhashini.ok) {
      const data = await audiBhashini.json();

      const userToStore: User = {
        id: session.user.id!,
        name: session.user.name!,
        email: session.user.email!,
        image: session.user.image || ""
      };
      addDoc(messageRef(chatId), {
        input: LiknessAndIntentGenerated || "Your Negotiation is being Analysed",
        inputBhashini: inpBhashini,
        audioBhashini: data.response,
        emotionBhashini: data.sentiment,
        timestamp: serverTimestamp(),
        user: userToStore
      });
      setIsLoading(false);
    } else {
      console.error('Failed to fetch translations:', audiBhashini.status);
    }
  } catch (error) {
    console.error('Error fetching translations:', error);
  }
}

export const AudioRecorderWithVisualizer = ({
  className,
  timerClassName,
  chatId,
  initialMessages
}: Props) => {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const sessionSave = session;
  const [language, setLanguage, getLanguage, getNotSupportedLanguage] = useLanguageStore((state)=>[state.language, state.setLanguage, state.getLanguage, state.getNotSupportedLanguages]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages] = useCollectionData<Message>(
    sortedMessagesRef(chatId), {initialValue: initialMessages}
  );

  // States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingFinished, setIsRecordingFinished] =
    useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [currentRecord, setCurrentRecord] = useState<Record>({
    id: -1,
    name: "",
    file: null,
  });
  // Calculate the hours, minutes, and seconds from the timer
  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = timer % 60;

  // Split the hours, minutes, and seconds into individual digits
  const [hourLeft, hourRight] = useMemo(
    () => padWithLeadingZeros(hours, 2).split(""),
    [hours]
  );
  const [minuteLeft, minuteRight] = useMemo(
    () => padWithLeadingZeros(minutes, 2).split(""),
    [minutes]
  );
  const [secondLeft, secondRight] = useMemo(
    () => padWithLeadingZeros(seconds, 2).split(""),
    [seconds]
  );
  // Refs
  const mediaRecorderRef = useRef<{
    stream: MediaStream | null;
    analyser: AnalyserNode | null;
    mediaRecorder: MediaRecorder | null;
    audioContext: AudioContext | null;
  }>({
    stream: null,
    analyser: null,
    mediaRecorder: null,
    audioContext: null,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<any>(null);

  function startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setShowOverlay(true);
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          setIsRecording(true);
          // ============ Analyzing ============
          const AudioContext = window.AudioContext;
          const audioCtx = new AudioContext();
          const analyser = audioCtx.createAnalyser();
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          mediaRecorderRef.current = {
            stream,
            analyser,
            mediaRecorder: null,
            audioContext: audioCtx,
          };

          const mimeType = MediaRecorder.isTypeSupported("audio/mpeg")
            ? "audio/mpeg"
            : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "audio/wav";

          const options = { mimeType };
          mediaRecorderRef.current.mediaRecorder = new MediaRecorder(
            stream,
            options
          );
          mediaRecorderRef.current.mediaRecorder.start();
          recordingChunks = [];
          // ============ Recording ============
          recorder = new MediaRecorder(stream);
          recorder.start();
          recorder.ondataavailable = (e) => {
            recordingChunks.push(e.data);
          };
        })
        .catch((error) => {
          alert(error);
          console.log(error);
          setShowOverlay(false);
        });
    }
  }
  function stopRecording() {
    recorder.onstop = () => {
      const recordBlob = new Blob(recordingChunks, {
        type: "audio/wav",
      });
      submitRecord(recordBlob, chatId, session, language, messages, setIsLoading);
      setCurrentRecord({
        ...currentRecord,
        file: window.URL.createObjectURL(recordBlob),
      });
      recordingChunks = [];
    };

    recorder.stop();

    setIsRecording(false);
    setIsRecordingFinished(true);
    setTimer(0);
    clearTimeout(timerTimeout);
  }
  function resetRecording() {
    setShowOverlay(false);
    const { mediaRecorder, stream, analyser, audioContext } =
      mediaRecorderRef.current;

    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        recordingChunks = [];
      };
      mediaRecorder.stop();
    } else {
      alert("recorder instance is null!");
    }

    // Stop the web audio context and the analyser node
    if (analyser) {
      analyser.disconnect();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    setIsRecording(false);
    setIsRecordingFinished(true);
    setTimer(0);
    clearTimeout(timerTimeout);

    // Clear the animation frame and canvas
    cancelAnimationFrame(animationRef.current || 0);
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext("2d");
      if (canvasCtx) {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      }
    }
  }
  const handleSubmit = () => {
    stopRecording();
  };

  // Effect to update the timer every second
  useEffect(() => {
    if (isRecording) {
      timerTimeout = setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
    }
    return () => clearTimeout(timerTimeout);
  }, [isRecording, timer]);

  // Visualizer
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const drawWaveform = (dataArray: Uint8Array) => {
      if (!canvasCtx) return;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.fillStyle = "#939393";

      const barWidth = 1;
      const spacing = 1;
      const maxBarHeight = HEIGHT / 2.5;
      const numBars = Math.floor(WIDTH / (barWidth + spacing));

      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.pow(dataArray[i] / 128.0, 8) * maxBarHeight;
        const x = (barWidth + spacing) * i;
        const y = HEIGHT / 2 - barHeight / 2;
        canvasCtx.fillRect(x, y, barWidth, barHeight);
      }
    };

    const visualizeVolume = () => {
      if (
        !mediaRecorderRef.current?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate
      )
        return;
      const bufferLength =
        (mediaRecorderRef.current?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate as number) / 100;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!isRecording) {
          cancelAnimationFrame(animationRef.current || 0);
          return;
        }
        animationRef.current = requestAnimationFrame(draw);
        mediaRecorderRef.current?.analyser?.getByteTimeDomainData(dataArray);
        drawWaveform(dataArray);
      };

      draw();
    };

    if (isRecording) {
      visualizeVolume();
    } else {
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      }
      cancelAnimationFrame(animationRef.current || 0);
    }

    return () => {
      cancelAnimationFrame(animationRef.current || 0);
    };
  }, [isRecording, theme]);

  const [members, loading, error] = useCollectionData<ChatMembers>(
    chatMembersRef(chatId)
  )
  const adminId = useAdminId({chatId});
  if(loading && !members) return <LoadingSpinner/>

  return (
    <>
      {showOverlay && (
        <div className="fixed flex flex-col justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary dark:bg-black opacity-100 z-2">
          {
            !loading && (
              <div className="mt-24 sm:mt-0">
                {members?.map((member)=>(
                    <div className='p-5 border-2 bg-secondary/20 rounded-xl m-5'>
                        <div className='flex items-center sm:space-x-2'>
                          <UserAvatar name={member.email} image={member.image} />
                      </div>
                      <div className='max-sm:hidden'>
                          <p className="text-white">{member.email}</p>
                          {member.userId === adminId && (
                              <p className='text-indigo-400 animate-pulse'>Admin</p>
                          )}
                      </div>
                    </div>
                ))}
              </div>
          )
          }

          {
            <LangSelect/>
          }
          
        </div>
      )}
      <div className={cn("flex h-16 rounded-md relative w-full items-center justify-end gap-2",{"border p-1": isRecording,"border-none p-0": !isRecording,},className)}>
      {isRecording ? (
          <Timer
            hourLeft={hourLeft}
            hourRight={hourRight}
            minuteLeft={minuteLeft}
            minuteRight={minuteRight}
            secondLeft={secondLeft}
            secondRight={secondRight}
            timerClassName={timerClassName}
          />
      ) : null}
      <canvas
        ref={canvasRef}
        className={`h-full w-full bg-background ${
          !isRecording ? "hidden" : "flex"
        }`}
      />
      <div className="flex gap-2">
        {isRecording ? (
          <TooltipProvider>
            <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={resetRecording}
                size={"icon"}
                className=" text-white bg-gradient-to-r from-rose-700 to-pink-600 shadow-md shadow-black flex flex-row gap-2"
              >
                <PhoneOff size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="m-2">
              <span>End the call</span>
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        ) : null}

        {/* ========== Start and send recording button ========== */}
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex justify-end items-center" asChild>
            {!isRecording ? (
              <>
                <Button disabled={isLoading} onClick={() => setShowOverlay(false)} className="bg-gradient-to-tr text-white from-rose-700 to-pink-600 shadow-md shadow-black flex flex-row gap-2">
                {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin"/> : <><ArrowLeft className="w-5 h-5" /></>}
                </Button>
                <Button onClick={() => startRecording()} className="bg-gradient-to-tr text-white from-violet-500 to-orange-300 shadow-md shadow-black flex flex-row gap-2">
                <Phone size={20} />
                </Button>
              </>
            ) : (
              <Button onClick={handleSubmit} className=" text-white bg-gradient-to-r from-teal-400 to-gray-800 shadow-md shadow-black flex flex-row gap-2">
                <ArrowRight size={20} />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent className="m-2">
            <span>
              {" "}
              {!isRecording ? "Start the call" : "Send recording"}{" "}
            </span>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    </>
  );
};

const Timer = React.memo(
  ({
    hourLeft,
    hourRight,
    minuteLeft,
    minuteRight,
    secondLeft,
    secondRight,
    timerClassName,
  }: {
    hourLeft: string;
    hourRight: string;
    minuteLeft: string;
    minuteRight: string;
    secondLeft: string;
    secondRight: string;
    timerClassName?: string;
  }) => {
    return (
      <div
        className={cn(
          "items-center h-16 p-5 bg-secondary top-0 left-0 absolute justify-center gap-0.5 border rounded-md font-mono font-medium text-foreground flex",
          timerClassName
        )}
      >
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {hourLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {hourRight}
        </span>
        <span>:</span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {minuteLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {minuteRight}
        </span>
        <span>:</span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {secondLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground ">
          {secondRight}
        </span>
      </div>
    );
  }
);
Timer.displayName = "Timer";