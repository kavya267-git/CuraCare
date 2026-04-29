import { useEffect, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import { setMood, pushWellbeing } from "@/lib/mood";
import { useI18n, langBcp47 } from "@/lib/i18n";
import { Mic, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Msg = { id: string; role: "user" | "assistant"; content: string; mask?: boolean };

export default function Chat() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "intro", role: "assistant", content: t("introMsg") },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  // Update intro on language change
  useEffect(() => {
    setMessages((prev) => prev.map((m) => (m.id === "intro" ? { ...m, content: t("introMsg") } : m)));
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    (async () => {
      const sid = getSessionId();
      const { data } = await supabase
        .from("chats").select("*").eq("session_id", sid).order("created_at", { ascending: true }).limit(50);
      if (data && data.length) {
        setMessages([
          { id: "intro", role: "assistant", content: t("welcomeBack") },
          ...data.map((d) => ({ id: d.id, role: d.role as any, content: d.content, mask: !!d.mask_detected })),
        ]);
      }
    })();
  }, []);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = langBcp47(lang);
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase())) ||
                    voices.find((v) => v.lang?.toLowerCase().startsWith(langBcp47(lang).toLowerCase().slice(0, 2)));
      if (match) u.voice = match;
      u.rate = 0.95; u.pitch = 1.0; u.volume = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) { console.warn("TTS failed", e); }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setInput("");

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);

    const sid = getSessionId();
    await supabase.from("chats").insert({ session_id: sid, role: "user", content: trimmed });

    try {
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.id !== "intro")
        .map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("chat", { body: { messages: apiMessages, lang } });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); setSending(false); return; }

      const aMsg: Msg = { id: crypto.randomUUID(), role: "assistant", content: data.reply, mask: data.mask_detected };
      setMessages((m) => [...m, aMsg]);
      setMood(data.weather, data.emotion);
      pushWellbeing({
        stress: data.stress ?? 30, burnout: data.burnout ?? 25, exhaustion: data.exhaustion ?? 30,
        emotion: data.emotion, suggestion: data.suggestion,
      });

      await supabase.from("chats").insert({
        session_id: sid, role: "assistant", content: data.reply,
        sentiment: data.sentiment, emotion: data.emotion, mask_detected: data.mask_detected,
      });

      speak(data.reply);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't reach Curacare. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  const toggleVoice = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.message("Voice input isn't available in this browser."); return; }
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = langBcp47(lang); rec.interimResults = false; rec.continuous = false;
    rec.onresult = (e: any) => {
      const tx = e.results[0][0].transcript;
      setInput(tx);
      send(tx);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  return (
    <MobileShell>
      <header className="sticky top-0 z-10 px-5 pt-10 pb-3 backdrop-blur-md bg-white/30 border-b border-white/30">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-9 h-9 rounded-full glass flex items-center justify-center shadow-soft" aria-label="Back">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Logo size={36} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground">{t("appName")}</p>
            <p className="font-display text-base leading-tight truncate">{t("quietCompanion")}</p>
          </div>
          <LanguageSwitcher compact />
        </div>
      </header>

      <div ref={scrollRef} className="px-5 py-4 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 230px)" }}>
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[78%] rounded-3xl rounded-br-md px-4 py-3 bg-primary text-primary-foreground shadow-soft"
                  : "max-w-[82%] rounded-3xl rounded-bl-md px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-foreground shadow-soft"
              }
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
              {m.mask && (
                <p className="text-[10px] mt-2 opacity-60 italic">— I noticed a quiet pause behind your words.</p>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-3xl rounded-bl-md px-4 py-3 bg-white/80 border border-white/60 shadow-soft">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-breathe" />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-breathe" style={{ animationDelay: "300ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-breathe" style={{ animationDelay: "600ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-5">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="glass rounded-full shadow-soft border border-white/50 flex items-center gap-2 pl-5 pr-2 py-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="flex-1 bg-transparent outline-none text-[15px] py-2 placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={t("voice")}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-calm ${listening ? "bg-rose/60 text-foreground animate-breathe" : "text-muted-foreground hover:bg-white/60"}`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label={t("send")}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
