import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { useLocation } from "wouter";
import { Mic, MicOff, X, Bot, Loader2, ChevronDown, Send, AlertCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import type { LangCode } from "@/lib/i18n";

const AGENT_HISTORY_KEY = "smartkisan_agent_history";

// TS doesn't ship Web Speech API types by default.
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;
type SpeechRecognitionErrorEvent = any;

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

interface AgentResponse {
  detectedLang: LangCode;
  action: "navigate" | "switch_language" | "answer" | "none";
  target?: string | null;
  targetLang?: string | null;
  message: string;
}

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

const WELCOME: Record<string, string> = {
  en: "Hi! I'm your SmartKisan AI agent. Type or say: 'My plant has a disease', 'Show weather', 'Hindi' to switch language!",
  hi: "नमस्ते! मैं SmartKisan AI एजेंट हूं। लिखें या बोलें: 'मेरे पौधे में बीमारी है', 'मौसम दिखाओ', या 'Gujarati' बोलें!",
  mr: "नमस्कार! मी SmartKisan AI एजेंट आहे. म्हणा: 'माझ्या पिकाला रोग आहे', 'हवामान दाखवा'!",
  te: "నమస్కారం! నేను SmartKisan AI ఏజెంట్‌ని. టైప్ చేయండి లేదా చెప్పండి: 'నా పంటకు వ్యాధి ఉంది'!",
  ta: "வணக்கம்! நான் SmartKisan AI ஏஜென்ட். சொல்லுங்கள்: 'என் பயிருக்கு நோய் உள்ளது', 'வானிலை காட்டு'!",
  kn: "ನಮಸ್ಕಾರ! ನಾನು SmartKisan AI ಏಜೆಂಟ್. ಹೇಳಿ: 'ನನ್ನ ಬೆಳೆಗೆ ರೋಗ ಇದೆ', 'ಹವಾಮಾನ ತೋರಿಸು'!",
  gu: "નમસ્તે! હું SmartKisan AI એજન્ટ છું. કહો: 'મારા પાકને રોગ છે', 'હવામાન દેખાડો'!",
  pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ SmartKisan AI ਏਜੰਟ ਹਾਂ। ਕਹੋ: 'ਮੇਰੀ ਫਸਲ ਨੂੰ ਬਿਮਾਰੀ ਹੈ', 'ਮੌਸਮ ਦਿਖਾਓ'!",
};

const PAGE_NAMES: Record<string, string> = {
  "/": "Dashboard",
  "/predict": "Crop Predictor",
  "/advisor": "AI Advisor",
  "/weather": "Weather",
  "/news": "News & Schemes",
  "/calendar": "Crop Calendar",
  "/disease": "Disease Detector",
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function loadAgentHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(AGENT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAgentHistory(msgs: ChatMessage[]) {
  try {
    localStorage.setItem(AGENT_HISTORY_KEY, JSON.stringify(msgs.slice(-80)));
  } catch { /* silent */ }
}

export function VoiceAgent() {
  const { lang, setLang, voiceCode } = useLanguage();
  const [currentPath, navigate] = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [micStatus, setMicStatus] = useState<"idle" | "blocked" | "unavailable">("idle");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(loadAgentHistory);
  const [textInput, setTextInput] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(chatHistory.length > 0);

  // On first open with empty history, add welcome
  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true;
      const welcome: ChatMessage = {
        id: "welcome",
        role: "ai",
        text: WELCOME[lang] ?? WELCOME.en,
      };
      setChatHistory([welcome]);
    }
  }, [isOpen, lang]);

  // Persist chat history
  useEffect(() => {
    saveAgentHistory(chatHistory);
  }, [chatHistory]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isProcessing]);

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      audioRef.current?.pause();
    };
  }, []);

  const addMessage = useCallback((role: "user" | "ai", text: string) => {
    setChatHistory(prev => [...prev, { id: `${Date.now()}${role}`, role, text }]);
  }, []);

  const speakText = useCallback(async (text: string) => {
    try {
      audioRef.current?.pause();
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(u);
    } catch { /* silent */ }
  }, []);

  const processTranscript = useCallback(async (transcript: string) => {
    const trimmed = transcript.trim();
    if (!trimmed) return;

    addMessage("user", trimmed);
    setIsProcessing(true);

    try {
      const res = await fetch(`${BASE_URL}/api/agent/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: trimmed, currentPage: currentPath, lang }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AgentResponse = await res.json();

      if (data.action === "switch_language" && data.targetLang) {
        setLang(data.targetLang as LangCode);
      } else if (data.action === "navigate" && data.target) {
        navigate(data.target);
        const msg = data.message || `Navigating to ${PAGE_NAMES[data.target] ?? data.target}…`;
        addMessage("ai", msg);
        speakText(msg);
        return;
      }

      addMessage("ai", data.message);
      speakText(data.message);
    } catch {
      addMessage("ai", "Sorry, I couldn't process that. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [currentPath, lang, addMessage, speakText, setLang, navigate]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicStatus("unavailable");
      return;
    }

    const recognition = new SR();
    recognition.lang = voiceCode;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setMicStatus("idle");
    };

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript.trim();
      recognition.stop();
      setIsListening(false);
      if (text) processTranscript(text);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setMicStatus("blocked");
      } else if (e.error === "not-supported") {
        setMicStatus("unavailable");
      }
    };

    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setMicStatus("blocked");
    }
  }, [voiceCode, processTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleMic = () => {
    if (isListening) stopListening();
    else if (!isProcessing && micStatus === "idle") startListening();
  };

  const handleSendText = () => {
    const val = textInput.trim();
    if (!val || isProcessing) return;
    setTextInput("");
    processTranscript(val);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendText();
  };

  const handleClose = () => {
    stopListening();
    audioRef.current?.pause();
    setIsOpen(false);
  };

  const micBlocked = micStatus !== "idle";

  return (
    <>
      {/* Floating trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-6 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full px-4 py-2.5 shadow-xl transition-all hover:scale-105"
        >
          <Bot className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold whitespace-nowrap">AI Agent</span>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className={cn(
          "fixed z-50 bg-background border border-border shadow-2xl flex flex-col overflow-hidden",
          "bottom-0 left-0 right-0 rounded-t-2xl max-h-[82vh]",
          "md:bottom-8 md:left-auto md:right-6 md:w-96 md:rounded-2xl md:max-h-[600px] md:h-[600px]"
        )}>
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white shrink-0">
            <div className="p-1 bg-emerald-500 rounded-full">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-none">SmartKisan AI Agent</p>
              <p className="text-[11px] text-emerald-100 mt-0.5">
                {isListening ? "🔴 Listening…" : isProcessing ? "⏳ Thinking…" : `Voice + Text · ${lang.toUpperCase()}`}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-emerald-500 rounded-full p-1 transition-colors shrink-0"
            >
              <ChevronDown className="h-5 w-5 md:hidden" />
              <X className="h-4 w-4 hidden md:block" />
            </button>
          </div>

          {/* Mic blocked banner */}
          {micBlocked && (
            <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs shrink-0">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                {micStatus === "unavailable" ? "Voice recognition not available in this browser. " : "Mic blocked in preview. "}
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline inline-flex items-center gap-0.5"
                >
                  Open in new tab <ExternalLink className="h-3 w-3" />
                </a>
                {" "}for full voice. Text input works perfectly!
              </span>
            </div>
          )}

          {/* Chat history */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {chatHistory.map(msg => (
              <div
                key={msg.id}
                className={cn("flex gap-2 items-end", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mb-0.5">
                    <Bot className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-snug",
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-2 items-end justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mb-0.5">
                  <Bot className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t bg-background px-3 py-3 space-y-2">
            {/* Text input */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder="Type a command or question…"
                className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none border border-transparent focus:border-emerald-400 transition-colors placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                onClick={handleSendText}
                disabled={!textInput.trim() || isProcessing}
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Mic row */}
            <div className="flex items-center justify-center gap-3">
              {micBlocked ? (
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center shadow transition-colors"
                  title="Open in new tab to use voice"
                >
                  <ExternalLink className="h-5 w-5 text-white" />
                </a>
              ) : (
                <button
                  onClick={handleMic}
                  disabled={isProcessing}
                  title={isListening ? "Stop listening" : "Tap to speak"}
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center transition-all shadow",
                    isListening
                      ? "bg-red-500 hover:bg-red-600 scale-110 ring-4 ring-red-200"
                      : isProcessing
                      ? "bg-muted opacity-40 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 hover:scale-105"
                  )}
                >
                  {isListening
                    ? <MicOff className="h-5 w-5 text-white" />
                    : <Mic className="h-5 w-5 text-white" />
                  }
                </button>
              )}
              <p className="text-[11px] text-muted-foreground">
                {micBlocked
                  ? "Tap the orange button → open in new tab for voice"
                  : isListening
                  ? "Listening… tap to stop"
                  : "Tap mic · or type above"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
