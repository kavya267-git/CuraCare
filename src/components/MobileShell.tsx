import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { useMood, weatherGradient } from "@/lib/mood";
import { cn } from "@/lib/utils";

export function MobileShell({ children, gradient = true }: { children: ReactNode; gradient?: boolean }) {
  const mood = useMood();
  return (
    <div className="min-h-screen w-full flex justify-center bg-muted">
      <div
        className={cn(
          "relative w-full max-w-md min-h-screen overflow-hidden transition-calm",
          gradient && weatherGradient[mood.weather]
        )}
      >
        <div className="pb-28 min-h-screen">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
