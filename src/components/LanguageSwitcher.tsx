import { useState } from "react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { Globe, Check } from "lucide-react";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full glass border border-white/50 shadow-soft px-3 py-1.5 text-xs font-medium text-foreground/80 hover:scale-[1.03] transition-calm"
        aria-label="Language"
      >
        <Globe className="w-3.5 h-3.5 text-primary" />
        <span>{compact ? current.code.toUpperCase() : current.native}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-soft overflow-hidden animate-fade-up">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code as Lang); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-primary/10 transition-calm ${l.code === lang ? "text-primary font-medium" : "text-foreground/80"}`}
              >
                <span>{l.native}</span>
                {l.code === lang && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
