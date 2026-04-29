import { useEffect, useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import { useMood } from "@/lib/mood";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import { Activity, Flame, BatteryLow, Sparkles, ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const EMOTION_WEIGHTS: Record<string, { stress: number; burnout: number; exhaustion: number }> = {
  overwhelmed: { stress: 80, burnout: 70, exhaustion: 65 },
  anxious:     { stress: 75, burnout: 55, exhaustion: 50 },
  frustrated:  { stress: 70, burnout: 60, exhaustion: 50 },
  sad:         { stress: 55, burnout: 55, exhaustion: 55 },
  tired:       { stress: 50, burnout: 65, exhaustion: 80 },
  lonely:      { stress: 50, burnout: 50, exhaustion: 45 },
  neutral:     { stress: 35, burnout: 35, exhaustion: 35 },
  calm:        { stress: 20, burnout: 25, exhaustion: 25 },
  hopeful:     { stress: 25, burnout: 20, exhaustion: 25 },
  content:     { stress: 18, burnout: 18, exhaustion: 22 },
};

export default function Dashboard() {
  const { t } = useI18n();
  const mood = useMood();
  const [emotionLog, setEmotionLog] = useState<{ emotion: string; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const sid = getSessionId();
      const { data } = await supabase
        .from("chats").select("emotion, created_at")
        .eq("session_id", sid).eq("role", "assistant")
        .not("emotion", "is", null)
        .order("created_at", { ascending: false }).limit(30);
      if (data) setEmotionLog(data as any);
    })();
  }, [mood.wellbeing.length]);

  // Combine live wellbeing + persisted emotion log
  const aggregate = useMemo(() => {
    const live = mood.wellbeing;
    const fromLog = emotionLog.map((e) => {
      const w = EMOTION_WEIGHTS[e.emotion as string] || EMOTION_WEIGHTS.neutral;
      return { ...w, emotion: e.emotion as any, at: new Date(e.created_at).getTime() };
    });
    const merged = [...fromLog, ...live].sort((a, b) => a.at - b.at).slice(-20);
    if (!merged.length) return null;
    const avg = (k: "stress" | "burnout" | "exhaustion") =>
      Math.round(merged.reduce((s, p) => s + p[k], 0) / merged.length);
    const stress = avg("stress");
    const burnout = avg("burnout");
    const exhaustion = avg("exhaustion");
    const balance = Math.max(0, 100 - Math.round((stress + burnout + exhaustion) / 3));
    // Trend: compare last 3 vs prior 3
    const tail = merged.slice(-3); const prev = merged.slice(-6, -3);
    const tailAvg = tail.length ? tail.reduce((s, p) => s + p.stress + p.burnout + p.exhaustion, 0) / tail.length : 0;
    const prevAvg = prev.length ? prev.reduce((s, p) => s + p.stress + p.burnout + p.exhaustion, 0) / prev.length : tailAvg;
    const trend = tailAvg < prevAvg ? "improving" : tailAvg > prevAvg ? "rising" : "steady";
    return { stress, burnout, exhaustion, balance, merged, trend };
  }, [mood.wellbeing, emotionLog]);

  return (
    <MobileShell>
      <header className="px-5 pt-10 pb-3 flex items-center gap-3">
        <Link to="/" className="w-9 h-9 rounded-full glass flex items-center justify-center shadow-soft" aria-label="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Logo size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground">{t("appName")}</p>
          <h1 className="font-display text-xl leading-tight truncate">{t("burnoutTitle")}</h1>
        </div>
        <LanguageSwitcher compact />
      </header>

      <p className="px-6 text-sm text-muted-foreground">{t("burnoutSub")}</p>

      {!aggregate ? (
        <div className="mx-6 mt-6 rounded-3xl glass border border-white/50 p-6 text-center shadow-soft">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-breathe" />
          <p className="text-sm text-foreground/80">{t("noDataYet")}</p>
          <Link to="/chat" className="inline-block mt-4 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium shadow-soft">
            {t("chat")}
          </Link>
        </div>
      ) : (
        <>
          {/* Balance ring */}
          <section className="px-6 mt-5">
            <div className="rounded-[2rem] glass border border-white/50 p-6 shadow-soft flex items-center gap-5">
              <BalanceRing value={aggregate.balance} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("overallBalance")}</p>
                <p className="font-display text-3xl mt-1">{aggregate.balance}<span className="text-base text-muted-foreground">/100</span></p>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  {aggregate.trend === "improving" && <><TrendingDown className="w-3.5 h-3.5" style={{ color: "hsl(150 60% 45%)" }} /><span style={{ color: "hsl(150 50% 40%)" }}>improving</span></>}
                  {aggregate.trend === "rising" && <><TrendingUp className="w-3.5 h-3.5" style={{ color: "hsl(345 75% 55%)" }} /><span style={{ color: "hsl(345 60% 45%)" }}>rising load</span></>}
                  {aggregate.trend === "steady" && <span className="text-muted-foreground">steady</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Three meters */}
          <section className="px-6 mt-4 grid grid-cols-3 gap-3">
            <Meter icon={Activity} tint="bg-rose/40" label={t("stressLevel")} value={aggregate.stress} color="hsl(345 75% 65%)" />
            <Meter icon={Flame} tint="bg-peach/50" label={t("burnoutLevel")} value={aggregate.burnout} color="hsl(22 90% 60%)" />
            <Meter icon={BatteryLow} tint="bg-sky/50" label={t("exhaustionLevel")} value={aggregate.exhaustion} color="hsl(205 80% 60%)" />
          </section>

          {/* Sparkline */}
          <section className="px-6 mt-5">
            <div className="rounded-[2rem] glass border border-white/50 p-5 shadow-soft">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("recentMoods")}</p>
              <Sparkline points={aggregate.merged} />
            </div>
          </section>

          {/* Insights */}
          <section className="px-6 mt-4 mb-2">
            <div className="rounded-[2rem] bg-primary/10 border border-primary/20 p-5">
              <p className="text-xs uppercase tracking-wider text-primary/80">{t("insights")}</p>
              <p className="font-display text-base mt-2 text-foreground/85">
                {insightCopy(aggregate.stress, aggregate.burnout, aggregate.exhaustion)}
              </p>
              {mood.lastSuggestion && (
                <p className="text-sm mt-3 text-foreground/70">
                  <span className="opacity-60">{t("suggestions")}: </span>{mood.lastSuggestion}
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </MobileShell>
  );
}

function insightCopy(s: number, b: number, e: number) {
  const max = Math.max(s, b, e);
  if (max < 35) return "A gentle, balanced rhythm. Keep being kind to yourself.";
  if (max < 60) return "Some weight is showing. A small pause could help.";
  if (max < 80) return "A heavier stretch. Try to share a little of the load.";
  return "You've been carrying a lot. Please rest, and reach out when you can.";
}

function BalanceRing({ value }: { value: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const hue = 200 + (value / 100) * 80; // soft blue → calm green
  return (
    <svg width="92" height="92" viewBox="0 0 92 92">
      <circle cx="46" cy="46" r={r} stroke="hsl(var(--muted))" strokeWidth="9" fill="none" />
      <circle
        cx="46" cy="46" r={r}
        stroke={`hsl(${hue} 60% 65%)`}
        strokeWidth="9" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        transform="rotate(-90 46 46)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="46" y="52" textAnchor="middle" className="fill-foreground font-display" fontSize="20">{value}</text>
    </svg>
  );
}

function Meter({ icon: Icon, label, value, tint, color }: any) {
  return (
    <div className="rounded-3xl glass border border-white/50 p-3 shadow-soft flex flex-col items-center">
      <div className={`w-10 h-10 rounded-2xl ${tint} flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5 text-foreground/70" strokeWidth={1.8} />
      </div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-lg leading-none mt-1">{value}</p>
      <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: { stress: number; burnout: number; exhaustion: number }[] }) {
  const w = 300, h = 90, pad = 6;
  const n = points.length;
  if (!n) return null;
  const x = (i: number) => pad + (i / Math.max(1, n - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - (v / 100) * (h - pad * 2);
  const path = (key: "stress" | "burnout" | "exhaustion") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24 mt-3">
      <path d={path("stress")} stroke="hsl(345 75% 65%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={path("burnout")} stroke="hsl(22 90% 60%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={path("exhaustion")} stroke="hsl(205 80% 60%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <g className="text-[8px]" fill="currentColor" opacity="0.6">
        <text x="6" y="10">100</text>
        <text x="6" y={h - 2}>0</text>
      </g>
    </svg>
  );
}
