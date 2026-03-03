/**
 * useVoice.ts
 * Handles voice input (SpeechRecognition) and voice feedback (SpeechSynthesis)
 * for all 5 supported languages: en, yo, ig, ha, pcm
 *
 * BROWSER SUPPORT:
 *   - SpeechRecognition: Chrome/Edge (full), Safari 14.1+ (partial), Firefox (none)
 *   - SpeechSynthesis: All modern browsers (voice availability varies by OS)
 *
 * LANGUAGE NOTES:
 *   - yo-NG, ig-NG, ha-NG are supported in Chrome via Google's cloud ASR (added Oct 2024)
 *   - pcm (Nigerian Pidgin) has no BCP-47 code — en-NG is the closest working fallback
 *   - SpeechSynthesis falls back to en-NG or en-US if no native voice is installed
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
}

// ─── BCP-47 language codes for SpeechRecognition ─────────────────────────────
const RECOGNITION_LANG_MAP: Record<string, string> = {
  en:  "en-NG",   // Nigerian English
  yo:  "yo-NG",   // Yoruba (Nigeria)
  ig:  "ig-NG",   // Igbo (Nigeria)
  ha:  "ha-NG",   // Hausa (Nigeria)
  pcm: "en-NG",   // Pidgin — no BCP-47 code; en-NG is the closest
};

// ─── Preferred TTS voice name substrings per language ────────────────────────
// SpeechSynthesis.getVoices() names vary by OS/browser — we match by substring
const TTS_VOICE_HINTS: Record<string, string[]> = {
  en:  ["nigeria", "en-NG", "english"],
  yo:  ["yoruba", "yo-NG", "yo"],
  ig:  ["igbo",   "ig-NG", "ig"],
  ha:  ["hausa",  "ha-NG", "ha"],
  pcm: ["nigeria", "en-NG", "english"],
};

// ─── UI labels for browser-not-supported messages ────────────────────────────
export const VOICE_NOT_SUPPORTED: Record<string, string> = {
  en:  "Voice input is not supported in this browser. Please use Chrome or Edge.",
  yo:  "Ẹrọ aṣawakiri rẹ ko ṣe atilẹyin igbewọle ohun. Jọwọ lo Chrome tabi Edge.",
  ig:  "Ihe nchọpụta gị anaghị akwado ntinye olu. Biko jiri Chrome ma ọ bụ Edge.",
  ha:  "Burauzarka baya goyan bayan shigar murya. Da fatan za a yi amfani da Chrome ko Edge.",
  pcm: "Your browser no support voice input. Abeg use Chrome or Edge.",
};

export const VOICE_LISTENING: Record<string, string> = {
  en:  "Listening… speak now",
  yo:  "N gbọ… sọ bayi",
  ig:  "Na-ege ntị… kwuo ugbu a",
  ha:  "Ana sauraro… magana yanzu",
  pcm: "E dey listen… talk now",
};

export const VOICE_ERROR: Record<string, string> = {
  en:  "Could not understand. Please try again.",
  yo:  "Ko le ye. Jọwọ gbiyanju lẹẹkansi.",
  ig:  "Enweghị ike ịghọta. Biko nwaa ọzọ.",
  ha:  "Ba za a iya fahimta ba. Da fatan sake gwadawa.",
  pcm: "E no hear well. Abeg try again.",
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface VoiceState {
  isListening:    boolean;
  isSpeaking:     boolean;
  recognitionSupported: boolean;
  synthesisSupported:   boolean;
  error:          string | null;
}

export interface VoiceControls {
  startListening:  () => void;
  stopListening:   () => void;
  speakText:       (text: string) => void;
  stopSpeaking:    () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useVoice(
  language: string,
  onTranscript: (text: string) => void,
): VoiceState & VoiceControls {

  const [isListening,  setIsListening]  = useState(false);
  const [isSpeaking,   setIsSpeaking]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef       = useRef<SpeechSynthesisUtterance | null>(null);

  // ── Browser support detection ──────────────────────────────────────────────
  const recognitionSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const synthesisSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── Stop listening when language changes mid-session ──────────────────────
  useEffect(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // ── Pick the best available TTS voice for the current language ─────────────
  const getBestVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    if (!synthesisSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    const hints  = TTS_VOICE_HINTS[lang] ?? TTS_VOICE_HINTS.en;

    for (const hint of hints) {
      const match = voices.find(
        (v) =>
          v.lang.toLowerCase().includes(hint.toLowerCase()) ||
          v.name.toLowerCase().includes(hint.toLowerCase()),
      );
      if (match) return match;
    }

    // Final fallback: any English voice
    return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
  }, [synthesisSupported]);

  // ── startListening ─────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!recognitionSupported) {
      setError(VOICE_NOT_SUPPORTED[language] ?? VOICE_NOT_SUPPORTED.en);
      return;
    }

    // Cancel any previous session
    recognitionRef.current?.abort();

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;

    const recognition: SpeechRecognition = new SpeechRecognitionClass();
    recognition.lang           = RECOGNITION_LANG_MAP[language] ?? "en-NG";
    recognition.continuous     = true;   // keep recording until stopListening
    recognition.interimResults = true;   // show interim transcript in real time
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      // Pass combined final + interim to parent so textarea updates live
      onTranscript((finalTranscript + interim).trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech") return; // ignore silence
      if (event.error === "aborted") return;   // intentional stop
      setError(VOICE_ERROR[language] ?? VOICE_ERROR.en);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // If there's a final transcript, commit it
      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onTranscript, recognitionSupported]);

  // ── stopListening ──────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── speakText ──────────────────────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!synthesisSupported || !text.trim()) return;

    // Cancel anything already speaking
    window.speechSynthesis.cancel();

    const utterance     = new SpeechSynthesisUtterance(text);
    utterance.lang      = RECOGNITION_LANG_MAP[language] ?? "en-NG";
    utterance.rate      = 0.92;   // slightly slower for clinical clarity
    utterance.pitch     = 1.0;
    utterance.volume    = 1.0;

    // Voices load async in some browsers — wait then assign
    const assignVoiceAndSpeak = () => {
      const voice = getBestVoice(language);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend   = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Voices not loaded yet — wait for the event
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        assignVoiceAndSpeak();
      };
    } else {
      assignVoiceAndSpeak();
    }
  }, [language, synthesisSupported, getBestVoice]);

  // ── stopSpeaking ───────────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    recognitionSupported,
    synthesisSupported,
    error,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  };
}