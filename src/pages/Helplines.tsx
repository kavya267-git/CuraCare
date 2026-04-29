import { MobileShell } from "@/components/MobileShell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import { Phone, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const HELPLINES = [
  { name: "iCall (TISS)", desc: "Free emotional support, multilingual", number: "9152987821", tint: "bg-lavender/60" },
  { name: "Vandrevala Foundation", desc: "24x7 mental health helpline", number: "1860-2662-345", tint: "bg-mint/60" },
  { name: "AASRA", desc: "Suicide prevention, 24x7", number: "9820466726", tint: "bg-rose/50" },
  { name: "NIMHANS Helpline", desc: "Govt of India · 24x7", number: "080-46110007", tint: "bg-sky/50" },
  { name: "KIRAN (Govt of India)", desc: "Toll-free, 13 languages", number: "1800-599-0019", tint: "bg-peach/60" },
  { name: "Snehi", desc: "Caregiver & emotional support", number: "9582208181", tint: "bg-cream" },
  { name: "Emergency", desc: "All India emergency", number: "112", tint: "bg-rose/40" },
];

export default function Helplines() {
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
          <h1 className="font-display text-xl leading-tight truncate">{t("helpTitle")}</h1>
        </div>
        <LanguageSwitcher compact />
      </header>

      <div className="px-6 mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span>{t("helpNote")}</span>
      </div>

      <div className="px-5 mt-4 space-y-3 pb-4">
        {HELPLINES.map((h) => (
          <a
            key={h.number}
            href={`tel:${h.number.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-3 rounded-3xl glass border border-white/50 p-4 shadow-soft hover:scale-[1.01] transition-calm"
          >
            <div className={`w-12 h-12 rounded-2xl ${h.tint} flex items-center justify-center`}>
              <Phone className="w-5 h-5 text-foreground/70" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{h.name}</p>
              <p className="text-xs text-muted-foreground truncate">{h.desc}</p>
              <p className="font-display text-base text-primary mt-0.5">{h.number}</p>
            </div>
            <span className="rounded-full bg-primary text-primary-foreground text-xs px-3 py-1.5 font-medium shadow-soft">
              {t("callNow")}
            </span>
          </a>
        ))}
      </div>
    </MobileShell>
  );
}
