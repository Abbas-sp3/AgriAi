import { useState, useRef, useEffect, memo } from "react";
import { useAskAdvisor } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingLeaf } from "@/components/loading-leaf";
import { Mic, Send, Volume2, Sprout, VolumeX, Leaf, Sparkles, ChevronDown, Loader2, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import type { AdvisorQueryConversationHistoryItem } from "@workspace/api-client-react";
import { useLocation } from "@/hooks/use-location";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const HISTORY_KEY = "smartkisan_advisor_history";

const QUICK_QUESTIONS = [
  {
    category: "Soil & Nutrients",
    icon: "🌱",
    questions: [
      "Which crop is best for high nitrogen soil?",
      "Which crop is best for acidic soil?",
      "Which crop grows in alkaline soil?",
      "Which crop is best for sandy soil?",
      "Which crop is best for clay soil?",
      "Which crop needs high potassium?",
    ],
  },
  {
    category: "Season & Climate",
    icon: "☀️",
    questions: [
      "Which crop is best for summer?",
      "Which crop is best for winter?",
      "Which crop is suitable for low rainfall areas?",
      "Which crop grows in high humidity?",
      "Which crop is best for high rainfall?",
    ],
  },
  {
    category: "Profit & Market",
    icon: "💰",
    questions: [
      "Which crop gives high profit?",
      "Which is the best cash crop?",
      "Which crops are best for export?",
      "Which crop is best for profit in small land?",
      "What is MSP?",
    ],
  },
  {
    category: "Exotic Crops",
    icon: "🌿",
    questions: [
      "How to grow Dragon Fruit?",
      "How to grow Avocado?",
      "How to grow Vanilla?",
      "How to grow Blueberry?",
      "Exotic crops in Maharashtra",
      "Exotic crops in Karnataka",
    ],
  },
  {
    category: "Farming Practices",
    icon: "🚜",
    questions: [
      "What is crop rotation?",
      "What is drip irrigation?",
      "What is mulching?",
      "What is organic farming?",
      "How to improve soil fertility naturally?",
      "How to increase crop yield?",
    ],
  },
];

const INDIAN_STATES = [
  "Punjab", "Haryana", "Uttar Pradesh", "Rajasthan", "Madhya Pradesh",
  "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Kerala",
  "West Bengal", "Bihar", "Odisha", "Assam", "Telangana", "Andhra Pradesh"
];

const MessageContent = memo(({ text }: { text: string }) => {
  const lines = text.split("\n").filter(l => l.trim() !== "");
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const trimmed = line.trimStart();
        const isBullet = /^[•\-–*]/.test(trimmed);
        const isTip = /^✅/.test(trimmed);
        const isNumbered = /^\d+[.)]\s/.test(trimmed);
        return (
          <p
            key={i}
            className={cn(
              "leading-relaxed",
              isBullet && "pl-3",
              isTip && "mt-1 font-medium text-primary/90",
              isNumbered && "pl-3",
            )}
          >
            {line}
          </p>
        );
      })}
    </div>
  );
});

function loadHistory(): AdvisorQueryConversationHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history: AdvisorQueryConversationHistoryItem[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-100)));
  } catch { /* silent */ }
}

export default function Advisor() {
  const { lang, voiceCode, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [history, setHistory] = useState<AdvisorQueryConversationHistoryItem[]>(loadHistory);
  const [isRecording, setIsRecording] = useState(false);
  const [micStatus, setMicStatus] = useState<"idle" | "blocked" | "unavailable">("idle");
  const [lastInputWasVoice, setLastInputWasVoice] = useState(false);
  const [showExoticPrompt, setShowExoticPrompt] = useState(false);
  const [lastRegionMentioned, setLastRegionMentioned] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [ttsLoadingIndex, setTtsLoadingIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pendingAutoPlayRef = useRef<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { location } = useLocation();
  const askMutation = useAskAdvisor();

  // Persist chat history to localStorage on every change
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const stopCurrentAudio = () => {
    window.speechSynthesis?.cancel();
    speechRef.current = null;
    setPlayingIndex(null);
    setTtsLoadingIndex(null);
  };

  const playMessageAudio = async (text: string, index: number) => {
    stopCurrentAudio();
    setTtsLoadingIndex(index);
    try {
      if (!("speechSynthesis" in window)) throw new Error("Speech synthesis not supported");
      const u = new SpeechSynthesisUtterance(text);
      speechRef.current = u;
      u.onend = () => {
        setPlayingIndex(null);
        speechRef.current = null;
      };
      u.onerror = () => {
        setPlayingIndex(null);
        speechRef.current = null;
      };
      setTtsLoadingIndex(null);
      setPlayingIndex(index);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      setTtsLoadingIndex(null);
      setPlayingIndex(null);
    }
  };

  useEffect(() => {
    if (pendingAutoPlayRef.current && history.length > 0) {
      const lastIdx = history.length - 1;
      if (history[lastIdx]?.role === "assistant") {
        const text = pendingAutoPlayRef.current;
        pendingAutoPlayRef.current = null;
        playMessageAudio(text, lastIdx);
      }
    }
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, askMutation.isPending, showExoticPrompt]);

  const sendQuery = (queryText: string, isVoice: boolean) => {
    if (!queryText.trim()) return;
    setShowExoticPrompt(false);
    const newHistory = [...history, { role: "user", content: queryText } as AdvisorQueryConversationHistoryItem];
    setHistory(newHistory);

    const mentionedState = INDIAN_STATES.find(s =>
      queryText.toLowerCase().includes(s.toLowerCase())
    );
    if (mentionedState) setLastRegionMentioned(mentionedState);

    askMutation.mutate({
      data: {
        query: queryText,
        context: {
          language: lang,
          location: location.lat
            ? `${location.cityName || ""} ${location.lat},${location.lon}`.trim()
            : undefined,
        },
        conversationHistory: history,
      },
    }, {
      onSuccess: (data) => {
        setHistory(prev => [...prev, { role: "assistant", content: data.answer } as AdvisorQueryConversationHistoryItem]);
        if (isVoice && data.voiceText) {
          pendingAutoPlayRef.current = data.voiceText;
        }
        if ((data as any).isExoticPrompt) {
          setShowExoticPrompt(true);
        }
      },
    });
  };

  const handleSend = () => {
    if (!query.trim()) return;
    const q = query;
    setQuery("");
    setLastInputWasVoice(false);
    sendQuery(q, false);
  };

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicStatus("unavailable");
      return;
    }

    const recognition = new SR();
    recognition.lang = voiceCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setMicStatus("idle");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastInputWasVoice(true);
      setIsRecording(false);
      setMicStatus("idle");
      sendQuery(transcript, true);
    };

    recognition.onerror = (e: any) => {
      setIsRecording(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setMicStatus("blocked");
      } else if (e.error === "not-supported") {
        setMicStatus("unavailable");
      }
    };

    recognition.onend = () => setIsRecording(false);

    try {
      recognition.start();
    } catch {
      setMicStatus("blocked");
    }
  };

  const handleClearHistory = () => {
    stopCurrentAudio();
    setHistory([]);
    setShowClearConfirm(false);
    setShowExoticPrompt(false);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleExoticYes = () => {
    setShowExoticPrompt(false);
    const region = lastRegionMentioned || "my region";
    sendQuery(`Yes, show me exotic crops for ${region}`, lastInputWasVoice);
  };

  const handleExoticNo = () => {
    setShowExoticPrompt(false);
    setHistory(prev => [...prev, {
      role: "assistant",
      content: t("no_prob"),
    } as AdvisorQueryConversationHistoryItem]);
  };

  const micBlocked = micStatus === "blocked" || micStatus === "unavailable";

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            {t("ai_advisor")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("ai_advisor_sub")}</p>
        </div>
        {history.length > 0 && (
          <div className="shrink-0 flex gap-2 mt-1">
            {showClearConfirm ? (
              <>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleClearHistory}
                  className="text-xs h-8"
                >
                  Confirm Clear
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowClearConfirm(true)}
                className="text-xs h-8 text-muted-foreground"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear History
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Mic blocked banner */}
      {micBlocked && (
        <div className="mb-3 flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="flex-1">
            {micStatus === "unavailable"
              ? "Speech recognition is not supported in this browser."
              : "Microphone access was blocked. This happens in embedded previews."
            }
            {" "}
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
              onClick={() => setMicStatus("idle")}
            >
              Open app in a new tab <ExternalLink className="h-3 w-3" />
            </a>
            {" "}for full voice access. Text input works perfectly here!
          </span>
        </div>
      )}

      <Card className="flex-1 flex flex-col overflow-hidden border-primary/20 shadow-md">
        <CardHeader className="bg-primary/5 py-3 px-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              {t("kisan_online")}
            </CardTitle>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {history.length} messages saved
                </span>
              )}
              {playingIndex !== null && (
                <Button variant="ghost" size="sm" onClick={stopCurrentAudio} className="text-xs h-8 text-primary">
                  <VolumeX className="h-4 w-4 mr-2" /> {t("stop_audio")}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {history.length === 0 ? (
            <div className="h-full flex flex-col overflow-y-auto py-4 px-2">
              <div className="text-center mb-4">
                <div className="inline-flex bg-primary/10 p-3 rounded-full mb-3">
                  <Sprout className="h-10 w-10 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground">How can I help with your farm today?</p>
                <p className="text-xs text-muted-foreground mt-1">Tap any question below or type your own.</p>
              </div>

              <div className="space-y-2">
                {QUICK_QUESTIONS.map((group) => (
                  <div key={group.category} className="border rounded-xl overflow-hidden bg-card">
                    <button
                      onClick={() => setOpenCategory(openCategory === group.category ? null : group.category)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <span className="font-medium text-sm flex items-center gap-2">
                        <span>{group.icon}</span> {group.category}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        openCategory === group.category && "rotate-180"
                      )} />
                    </button>
                    {openCategory === group.category && (
                      <div className="px-4 pb-3 flex flex-wrap gap-2 border-t bg-muted/20 pt-3">
                        {group.questions.map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setOpenCategory(null);
                              sendQuery(q, false);
                            }}
                            className="text-xs bg-background hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5 rounded-full border border-primary/20 text-foreground"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {history.map((msg, i) => (
                <div key={i} className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm border"
                  )}>
                    {msg.role === "user"
                      ? msg.content
                      : <MessageContent text={msg.content} />
                    }
                    {msg.role === "assistant" && (
                      <button
                        onClick={() =>
                          playingIndex === i
                            ? stopCurrentAudio()
                            : playMessageAudio(msg.content, i)
                        }
                        disabled={ttsLoadingIndex !== null && ttsLoadingIndex !== i}
                        className={cn(
                          "mt-2 flex items-center gap-1 text-xs transition-colors",
                          playingIndex === i
                            ? "text-primary opacity-100"
                            : "text-muted-foreground opacity-60 hover:opacity-100",
                          ttsLoadingIndex !== null && ttsLoadingIndex !== i && "cursor-not-allowed opacity-30"
                        )}
                        title={playingIndex === i ? t("stop_audio") : t("play")}
                      >
                        {ttsLoadingIndex === i ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>{t("loading_audio")}</span>
                          </>
                        ) : playingIndex === i ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5" />
                            <span>{t("stop")}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5" />
                            <span>{t("play")}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {askMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-2 border shadow-sm flex items-center">
                    <LoadingLeaf className="p-0 h-6 w-6" />
                    <span className="text-sm ml-2 text-muted-foreground font-medium animate-pulse">{t("thinking")}</span>
                  </div>
                </div>
              )}

              {showExoticPrompt && !askMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-800">{t("explore_exotic")}</span>
                    </div>
                    <p className="text-sm text-emerald-700 mb-3">
                      {t("explore_exotic_sub")}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleExoticYes} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
                        <Leaf className="h-3 w-3 mr-1" /> {t("yes_exotic")}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleExoticNo} className="text-xs h-8 border-emerald-300 text-emerald-700">
                        {t("no_thanks")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="p-4 bg-muted/30 border-t shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex w-full items-center gap-2"
          >
            <Button
              type="button"
              variant={isRecording ? "destructive" : micBlocked ? "secondary" : "outline"}
              size="icon"
              onClick={micBlocked ? () => window.open(window.location.href, "_blank") : startRecording}
              disabled={askMutation.isPending && !micBlocked}
              title={micBlocked ? "Open in new tab for voice" : isRecording ? "Recording… click to stop" : "Click to speak"}
              className={cn(
                "shrink-0 rounded-full h-12 w-12",
                micBlocked && "opacity-60"
              )}
            >
              {micBlocked
                ? <ExternalLink className="h-5 w-5" />
                : <Mic className={cn("h-5 w-5", isRecording && "animate-pulse")} />
              }
            </Button>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("type_question")}
              className="flex-1 h-12 rounded-full border-primary/30 focus-visible:ring-primary/50 text-base px-5"
              disabled={askMutation.isPending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!query.trim() || askMutation.isPending}
              className="shrink-0 rounded-full h-12 w-12"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="w-full text-center text-[10px] text-muted-foreground mt-2">
            🎙️ {t("audio_hint")}
            {history.length > 0 && " · Chat history saved automatically"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
