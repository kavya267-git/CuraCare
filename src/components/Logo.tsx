import logo from "@/assets/curacare-logo.jpeg";

export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-soft bg-white/80 backdrop-blur ${className}`}
      style={{ width: size, height: size }}
      aria-label="Curacare logo"
    >
      <img src={logo} alt="Curacare" className="w-full h-full object-cover" />
    </div>
  );
}
