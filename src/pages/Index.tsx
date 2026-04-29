import { Link } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { EnergyWave } from "@/components/EnergyWave";
import { WeatherIcon } from "@/components/WeatherIcon";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { useMood, weatherLabel } from "@/lib/mood";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Wind, Droplet, Pause, BarChart3, Phone } from "lucide-react";

export default function Home() {
  const mood = useMood();
  const { t } = useI18n();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 5) return t("greetingNight");
    if (h < 12) return t("greetingMorning");
    if (h < 17) return t("greetingAfternoon");
    if (h < 21) return t("greetingEvening");
    return t("greetingNight");
  };

  return (
    <MobileShell>
      <header className="px-5 pt-10 pb-3 flex items-center gap-3 animate-fade-up">
        <Logo size={44} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{t("appName")}</p>
          <p className="text-sm text-foreground/70">{greeting()}</p>
        </div>
        <LanguageSwitcher compact />
      </header>

      <div className="px-6 mt-1 animate-fade-up">
        <h1 className="font-display text-3xl text-foreground leading-tight">{t("howIsHeart")}</h1>
        <p className="text-xs text-muted-foreground mt-1 italic">{t("tagline")}</p>
      </div>

      {/* Mood card */}
      <section className="px-6 mt-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="glass rounded-[2rem] p-6 shadow-soft border border-white/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("todayFeels")}</p>
              <p className="font-display text-2xl mt-1">{weatherLabel[mood.weather]}</p>
            </div>
            <div className="text-primary animate-breathe-slow">
              <WeatherIcon weather={mood.weather} className="w-14 h-14" />
            </div>
          </div>
        </div>
      </section>

      {/* Energy wave */}
      <section className="px-6 mt-4 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <Link to="/energy" className="block">
          <div className="rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur-md border border-white/40 shadow-soft">
            <div className="flex items-center justify-between px-6 pt-5">
              <p className="text-sm font-medium text-foreground/70">{t("yourEnergy")}</p>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <EnergyWave emotion={mood.emotion} height={110} />
          </div>
        </Link>
      </section>

      {/* Two-minute reset */}
      <section className="px-6 mt-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
        <p className="text-sm font-medium text-foreground/70 mb-3 px-1">{t("smallPause")}</p>
        <div className="grid grid-cols-3 gap-3">
          <ResetCard to="/support" icon={Wind} label={t("breathe")} tint="bg-sky/40" />
          <ResetCard to="/support" icon={Droplet} label={t("sip")} tint="bg-mint/40" />
          <ResetCard to="/support" icon={Pause} label={t("rest")} tint="bg-peach/40" />
        </div>
      </section>

      {/* Dashboard + Helplines quick row */}
      <section className="px-6 mt-4 grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <Link to="/dashboard" className="rounded-3xl p-4 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-soft hover:scale-[1.02] transition-calm">
          <BarChart3 className="w-5 h-5 text-primary mb-2" />
          <p className="font-display text-sm leading-tight">{t("dashboard")}</p>
        </Link>
        <Link to="/helplines" className="rounded-3xl p-4 bg-gradient-to-br from-rose/40 to-peach/30 border border-white/40 shadow-soft hover:scale-[1.02] transition-calm">
          <Phone className="w-5 h-5 mb-2" style={{ color: "hsl(345 75% 55%)" }} />
          <p className="font-display text-sm leading-tight">{t("helplines")}</p>
        </Link>
      </section>

      {/* Companion call to action */}
      <section className="px-6 mt-4 animate-fade-up" style={{ animationDelay: "360ms" }}>
        <Link
          to="/chat"
          className="block rounded-[2rem] p-5 bg-primary text-primary-foreground shadow-soft hover:opacity-95 transition-calm"
        >
          <p className="text-xs uppercase tracking-wider opacity-80">{t("appName")}</p>
          <p className="font-display text-xl mt-1">{t("anythingMind")}</p>
          <p className="text-sm opacity-80 mt-2">{t("talkToMe")}</p>
        </Link>
      </section>
    </MobileShell>
  );
}

function ResetCard({ to, icon: Icon, label, tint }: { to: string; icon: any; label: string; tint: string }) {
  return (
    <Link
      to={to}
      className="rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 p-4 flex flex-col items-center gap-2 shadow-soft hover:scale-[1.02] transition-calm"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tint}`}>
        <Icon className="w-6 h-6 text-foreground/70" strokeWidth={1.8} />
      </div>
      <span className="text-xs font-medium text-foreground/80">{label}</span>
    </Link>
  );
}
