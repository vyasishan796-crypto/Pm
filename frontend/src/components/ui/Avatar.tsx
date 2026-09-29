import { classNames } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-[13px]",
    lg: "w-12 h-12 text-[15px]",
  };
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#0F6B55", "#166534", "#084C3A", "#2D6A4F", "#1A8A6D"];
  const colorIndex = name.charCodeAt(0) % colors.length;

  if (src) {
    return <img src={src} alt={name} className={classNames("rounded-full object-cover", sizes[size], className)} />;
  }

  return (
    <div className={classNames("rounded-full flex items-center justify-center font-semibold text-white", sizes[size], className)} style={{ backgroundColor: colors[colorIndex] }}>
      {initials}
    </div>
  );
}
