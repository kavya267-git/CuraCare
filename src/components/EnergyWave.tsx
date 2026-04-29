import { useMemo } from "react";
import type { Emotion } from "@/lib/mood";

// Emotion -> wave amplitude/frequency (more chaotic for harder emotions)
const profile: Record<Emotion, { amp: number; freq: number; speed: number }> = {
  calm:        { amp: 10, freq: 1.0, speed: 22 },
  content:     { amp: 12, freq: 1.1, speed: 22 },
  hopeful:     { amp: 14, freq: 1.2, speed: 20 },
  neutral:     { amp: 12, freq: 1.2, speed: 22 },
  tired:       { amp: 8,  freq: 0.8, speed: 30 },
  lonely:      { amp: 10, freq: 1.0, speed: 28 },
  sad:         { amp: 9,  freq: 0.9, speed: 28 },
  anxious:     { amp: 22, freq: 2.4, speed: 12 },
  overwhelmed: { amp: 28, freq: 2.8, speed: 10 },
  frustrated:  { amp: 24, freq: 2.5, speed: 11 },
};

export function EnergyWave({ emotion = "calm" as Emotion, height = 160, color = "hsl(var(--primary))" }: { emotion?: Emotion; height?: number; color?: string }) {
  const { amp, freq, speed } = profile[emotion] ?? profile.calm;

  // Build path twice for seamless wave-flow loop
  const path = useMemo(() => {
    const w = 600;
    const mid = height / 2;
    let d = `M 0 ${mid}`;
    const step = 6;
    for (let x = 0; x <= w * 2; x += step) {
      const y = mid + Math.sin((x / w) * Math.PI * 2 * freq) * amp +
                Math.sin((x / w) * Math.PI * 4 * freq + 1.2) * (amp * 0.35);
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    d += ` L ${w * 2} ${height} L 0 ${height} Z`;
    return d;
  }, [amp, freq, height]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg
        viewBox={`0 0 600 ${height}`}
        preserveAspectRatio="none"
        className="absolute left-0 top-0 h-full w-[200%] animate-wave"
        style={{ animationDuration: `${speed}s` }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#waveGrad)" />
      </svg>
      <svg
        viewBox={`0 0 600 ${height}`}
        preserveAspectRatio="none"
        className="absolute left-0 top-0 h-full w-[200%] animate-wave opacity-60"
        style={{ animationDuration: `${speed * 1.4}s`, animationDirection: "reverse" }}
      >
        <path d={path} fill={color} fillOpacity="0.15" />
      </svg>
    </div>
  );
}
