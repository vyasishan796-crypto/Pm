import { useCallback } from "react";
import { classNames } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({ children, className, hover = false, padding = "md", onClick, style }: CardProps) {
  const paddings: Record<string, string> = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className={classNames(
        "rounded-[16px] border transition-all duration-200",
        hover && "cursor-pointer hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        "shadow-[var(--shadow-card)]",
        paddings[padding],
        className
      )}
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border-light)", ...style }}
    >
      {children}
    </div>
  );
}
