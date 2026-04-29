import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Wind, Droplet, Pause, Eye, Footprints, Music } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  { icon: Wind, title: "Three deep breaths", caption: "30 seconds", tint: "bg-sky/50", action: "breathe" },
  { icon: Droplet, title: "Sip some water", caption: "A small kindness", tint: "bg-mint/50", action: "info" },
  { icon: Pause, title: "Sit quietly for a minute", caption: "Just be", tint: "bg-peach/50", action: "rest" },
  { icon: Eye, title: "Soft gaze, far window", caption: "Let the eyes rest", tint: "bg-rose/40", action: "info" },
  { icon: Footprints, title: "A short slow walk", caption: "Two minutes is enough", tint: "bg-cream/80", action: "info" },
  { icon: Music, title: "One calming sound", caption: "Close your eyes", tint: "bg-lavender/50", action: "info" },
];

export default function Support() {
  const [active, setActive] = useState<string | null>(null);
  const { t } = useI18n();

  return (
    <MobileShell>
      <header className="px-5 pt-10 pb-3 flex items-center gap-3">
        <Link to="/" className="w-9 h-9 rounded-full glass flex items-center justify-center shadow-soft" aria-label="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Logo size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground">{t("appName")}</p>
          <h1 className="font-display text-xl leading-tight truncate">{t("smallPause")}</h1>
        </div>
        <LanguageSwitcher compact />
      </header>

      <div className="px-6 mt-4 grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={() => setActive(c.action === "breathe" ? "breathe" : c.action === "rest" ? "rest" : null)}
            className="text-left rounded-[1.75rem] p-5 bg-white/70 backdrop-blur-md border border-white/50 shadow-soft hover:scale-[1.02] transition-calm"
          >
            <div className={`w-12 h-12 rounded-2xl ${c.tint} flex items-center justify-center mb-3`}>
              <c.icon className="w-6 h-6 text-foreground/70" strokeWidth={1.8} />
            </div>
            <p className="font-display text-lg leading-tight">{c.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.caption}</p>
          </button>
        ))}
      </div>

      {/* Breathing modal */}
      {active === "breathe" && (
        <Modal onClose={() => setActive(null)} title="Breathe with me">
          <div className="flex flex-col items-center py-8">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-breathe-slow" />
              <div className="absolute inset-4 rounded-full bg-primary/30 animate-breathe" />
              <div className="absolute inset-10 rounded-full bg-primary/50 animate-breathe-slow" />
              <p className="relative font-display text-xl text-primary-foreground bg-primary/80 rounded-full px-5 py-2">in… out…</p>
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center max-w-xs">
              Follow the soft rhythm. There's nothing to do, nowhere to be.
            </p>
          </div>
        </Modal>
      )}

      {active === "rest" && (
        <Modal onClose={() => setActive(null)} title="Just rest">
          <div className="py-10 text-center">
            <p className="font-display text-2xl">Close your eyes.</p>
            <p className="text-muted-foreground mt-3">I'll be right here when you open them.</p>
          </div>
        </Modal>
      )}
    </MobileShell>
  );
}

function Modal({ children, onClose, title }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto rounded-t-[2rem] sm:rounded-[2rem] bg-background p-6 shadow-soft animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4 sm:hidden" />
        <p className="font-display text-xl text-center">{title}</p>
        {children}
        <button onClick={onClose} className="w-full rounded-full bg-muted py-3 text-sm font-medium mt-2">
          I'm okay now
        </button>
      </div>
    </div>
  );
}
