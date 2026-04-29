import { Cloud, Sun, CloudDrizzle, CloudFog, CloudLightning, Moon, Sparkles } from "lucide-react";
import type { Weather } from "@/lib/mood";

export function WeatherIcon({ weather, className = "w-12 h-12" }: { weather: Weather; className?: string }) {
  const Icon = {
    sunny: Sun,
    calm: Sparkles,
    cloudy: Cloud,
    foggy: CloudFog,
    drizzle: CloudDrizzle,
    stormy: CloudLightning,
    "gentle-night": Moon,
  }[weather];
  return <Icon className={className} strokeWidth={1.5} />;
}
