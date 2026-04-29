import { useSyncExternalStore } from "react";

export type Weather = "sunny" | "calm" | "cloudy" | "foggy" | "drizzle" | "stormy" | "gentle-night";
export type Emotion = "calm" | "tired" | "overwhelmed" | "sad" | "anxious" | "hopeful" | "content" | "lonely" | "frustrated" | "neutral";

export type WellbeingPoint = { stress: number; burnout: number; exhaustion: number; emotion: Emotion; at: number };

const listeners = new Set<() => void>();
let state = {
  weather: "calm" as Weather,
  emotion: "neutral" as Emotion,
  history: [] as { weather: Weather; emotion: Emotion; at: number }[],
  wellbeing: [] as WellbeingPoint[],
  lastSuggestion: "" as string,
};

function emit() { listeners.forEach((l) => l()); }
function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }

export function setMood(weather: Weather, emotion: Emotion) {
  state = {
    ...state,
    weather, emotion,
    history: [...state.history.slice(-19), { weather, emotion, at: Date.now() }],
  };
  emit();
}

export function pushWellbeing(p: { stress: number; burnout: number; exhaustion: number; emotion: Emotion; suggestion?: string }) {
  state = {
    ...state,
    wellbeing: [...state.wellbeing.slice(-49), { stress: p.stress, burnout: p.burnout, exhaustion: p.exhaustion, emotion: p.emotion, at: Date.now() }],
    lastSuggestion: p.suggestion || state.lastSuggestion,
  };
  emit();
}

export function useMood() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export const weatherGradient: Record<Weather, string> = {
  sunny: "gradient-sunny",
  calm: "gradient-calm",
  cloudy: "gradient-cloudy",
  foggy: "gradient-foggy",
  drizzle: "gradient-drizzle",
  stormy: "gradient-stormy",
  "gentle-night": "gradient-night",
};

export const weatherLabel: Record<Weather, string> = {
  sunny: "A bright morning",
  calm: "A calm sky",
  cloudy: "A cloudy day",
  foggy: "A soft fog",
  drizzle: "A gentle drizzle",
  stormy: "A heavy sky",
  "gentle-night": "A quiet evening",
};
