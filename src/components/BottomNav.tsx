import { NavLink } from "react-router-dom";
import { Home, MessageCircle, BarChart3, Heart, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const { t } = useI18n();
  const items = [
    { to: "/", icon: Home, label: t("home") },
    { to: "/chat", icon: MessageCircle, label: t("chat") },
    { to: "/dashboard", icon: BarChart3, label: t("dashboard") },
    { to: "/support", icon: Heart, label: t("support") },
    { to: "/helplines", icon: Phone, label: t("helplines") },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pt-2 z-50">
      <div className="glass shadow-soft rounded-full flex items-center justify-around py-2 px-2 border border-white/40">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-full transition-calm min-w-[48px]",
                isActive ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              )
            }
            aria-label={label}
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
            <span className="text-[9px] font-medium truncate max-w-[56px]">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
