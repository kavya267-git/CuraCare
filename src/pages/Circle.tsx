import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Phone, MessageSquare, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const contacts = [
  { name: "Mom", initials: "M", tint: "bg-peach" },
  { name: "Sister", initials: "S", tint: "bg-mint" },
  { name: "Raj", initials: "R", tint: "bg-sky" },
  { name: "Best friend", initials: "B", tint: "bg-rose" },
  { name: "Neighbor", initials: "N", tint: "bg-lavender" },
  { name: "Cousin", initials: "C", tint: "bg-cream" },
];

const templates = [
  "Hey, I'm a bit exhausted today. Could you help me out for an hour?",
  "Could you check in on me later today? Just a small message would help.",
  "I need a small break. Could you take over for a little while?",
];

export default function Circle() {
  const [picked, setPicked] = useState<string | null>(null);
  const [msg, setMsg] = useState(templates[0]);
  const { t } = useI18n();

  const send = () => {
    toast.success(`Sent gently to ${picked}.`);
    setPicked(null);
  };

  return (
    <MobileShell>
      <header className="px-5 pt-10 pb-3 flex items-center gap-3">
        <Link to="/" className="w-9 h-9 rounded-full glass flex items-center justify-center shadow-soft" aria-label="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Logo size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground">{t("appName")}</p>
          <h1 className="font-display text-xl leading-tight truncate">{t("circle")}</h1>
        </div>
        <LanguageSwitcher compact />
      </header>

      {/* Circular layout */}
      <div className="relative mx-auto mt-6 w-[320px] h-[320px]">
        <div className="absolute inset-8 rounded-full border-2 border-dashed border-primary/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft animate-breathe-slow">
            <p className="font-display text-sm text-center leading-tight">Ask<br />for help</p>
          </div>
        </div>
        {contacts.map((c, i) => {
          const angle = (i / contacts.length) * Math.PI * 2 - Math.PI / 2;
          const r = 130;
          const x = Math.cos(angle) * r + 160 - 28;
          const y = Math.sin(angle) * r + 160 - 28;
          return (
            <button
              key={c.name}
              onClick={() => setPicked(c.name)}
              className={`absolute w-14 h-14 rounded-full ${c.tint} flex items-center justify-center shadow-soft border-2 border-white hover:scale-110 transition-calm`}
              style={{ left: x, top: y }}
              aria-label={c.name}
            >
              <span className="font-display text-lg text-foreground/80">{c.initials}</span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-2 px-8">Tap a person to send a soft message.</p>

      {/* Local resources */}
      <section className="px-6 mt-6">
        <p className="text-sm font-medium text-foreground/70 mb-3">Nearby help</p>
        <div className="space-y-2">
          <ResourceCard title="24/7 Caregiver helpline" sub="A kind voice, anytime" />
          <ResourceCard title="Local respite care" sub="A few hours of quiet" />
          <ResourceCard title="Caregiver community meet" sub="Weekend, nearby" />
        </div>
      </section>

      {/* Send modal */}
      {picked && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setPicked(null)}>
          <div className="w-full max-w-md rounded-t-[2rem] bg-background p-6 shadow-soft animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-xl">Send to {picked}</p>
              <button onClick={() => setPicked(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-2 mb-4">
              {templates.map((t) => (
                <button
                  key={t}
                  onClick={() => setMsg(t)}
                  className={`w-full text-left p-3 rounded-2xl text-sm transition-calm ${msg === t ? "bg-primary/15 border border-primary/30" : "bg-muted border border-transparent"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={send} className="flex-1 rounded-full bg-primary text-primary-foreground py-3 font-medium shadow-soft flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Send message
              </button>
              <button onClick={send} className="w-12 h-12 rounded-full bg-mint flex items-center justify-center" aria-label="Call">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function ResourceCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-2xl glass border border-white/50 p-4 flex items-center justify-between shadow-soft">
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <button className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary" aria-label="Call">
        <Phone className="w-4 h-4" />
      </button>
    </div>
  );
}
