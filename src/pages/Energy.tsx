import { MobileShell } from "@/components/MobileShell";
import { EnergyWave } from "@/components/EnergyWave";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { useMood } from "@/lib/mood";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const trendCaption = (history: { emotion: string }[]) => {
  if (history.length < 3) return "A quiet beginning. I'll be here as your days unfold.";
  const heavy = ["overwhelmed", "anxious", "frustrated", "sad", "tired"];
  const recent = history.slice(-7);
  const heavyCount = recent.filter((h) => heavy.includes(h.emotion)).length;
  if (heavyCount >= 4) return "It's been a heavy few days. Be gentle with yourself.";
  if (heavyCount >= 2) return "Some softer days mixed with steadier ones.";
  return "Things have felt steady lately.";
};

export default function Energy() {
  const mood = useMood();
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
          <h1 className="font-display text-xl leading-tight truncate">{t("yourEnergy")}</h1>
        </div>
        <LanguageSwitcher compact />
      </header>

      <div className="px-6 mt-4">
        <div className="rounded-[2rem] overflow-hidden glass border border-white/50 shadow-soft">
          <EnergyWave emotion={mood.emotion} height={260} />
          <div className="px-6 py-5">
            <p className="font-display text-xl">{trendCaption(mood.history)}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              No numbers, no scores. Just a gentle picture of how things have been moving.
            </p>
          </div>
        </div>
      </div>

      {/* Past flow strip */}
      {mood.history.length > 0 && (
        <div className="px-6 mt-5">
          <p className="text-sm font-medium text-foreground/70 mb-3">Recent flow</p>
          <div className="rounded-3xl glass border border-white/50 p-4 shadow-soft">
            <div className="flex items-end gap-2 h-24">
              {mood.history.slice(-12).map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-primary/40"
                  style={{
                    height: `${30 + Math.abs(Math.sin(i * 0.7)) * 50 + (["overwhelmed","anxious","frustrated"].includes(h.emotion) ? 20 : 0)}%`,
                  }}
                />
              ))}
              {Array.from({ length: Math.max(0, 12 - mood.history.length) }).map((_, i) => (
                <div key={`e${i}`} className="flex-1 rounded-full bg-muted h-2" />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-6 mt-5">
        <Link
          to="/chat"
          className="block text-center rounded-full bg-primary text-primary-foreground py-4 font-medium shadow-soft"
        >
          Talk it out gently
        </Link>
      </div>
    </MobileShell>
  );
}
