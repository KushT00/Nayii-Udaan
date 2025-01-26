/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function MicrophoneComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition only once
  const initializeSpeechRecognition = useCallback(() => {
    if (!recognitionRef.current) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Default to English

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(" ");
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Preload speech recognition on mount
  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      recognitionRef.current?.stop();
    };
  }, [initializeSpeechRecognition]);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current?.start();
  };

  const stopRecording = async () => {
    recognitionRef.current?.stop();
    setIsRecording(false);

    if (transcript) {
      await sendTranscript(transcript);
    }
  };

  // Function to send transcript via a POST request
  const sendTranscript = async (text: string) => {
    try {
      const response = await fetch(
        "https://c0fb-2405-201-3f-6870-754b-c425-485d-b863.ngrok-free.app/audio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        }
      );

      if (!response.ok) {
        console.error("Failed to send transcript:", response.statusText);
      } else {
        console.log("Transcript sent successfully");
      }
    } catch (error) {
      console.error("Error sending transcript:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full p-4">
      <div className="w-full max-w-md">
        {isRecording && (
          <div className="rounded-md border p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium">Recording</p>
              <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
            </div>
            {transcript && (
              <div className="border rounded-md p-2">
                <p>{transcript}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`mt-6 w-20 h-20 rounded-full focus:outline-none ${
            isRecording
              ? "bg-red-400 hover:bg-red-500"
              : "bg-blue-400 hover:bg-blue-500"
          }`}
        >
          {isRecording ? (
            <svg className="h-12 w-12 m-auto" viewBox="0 0 24 24">
              <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg
              className="w-12 h-12 m-auto text-white"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48Zm-32-112a32 32 0 1 1 64 0v64a32 32 0 1 1-64 0zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}