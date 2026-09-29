import { classNames } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-[var(--color-sage)] text-[var(--color-primary-dark)]",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    outline: "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
  };
  const sizes: Record<string, string> = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-[11px] px-2.5 py-1",
  };
  return (
    <span className={classNames("inline-flex items-center font-medium rounded-full", variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
