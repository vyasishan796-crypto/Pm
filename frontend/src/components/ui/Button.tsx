"use client";
import { forwardRef } from "react";
import { classNames } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]";

    const variants: Record<string, string> = {
      primary: "text-white shadow-sm hover:shadow-md",
      secondary: "text-white shadow-sm hover:shadow-md",
      outline: "border bg-transparent hover:shadow-sm",
      ghost: "hover:shadow-sm",
      danger: "text-white shadow-sm hover:shadow-md",
      success: "text-white shadow-sm hover:shadow-md",
    };

    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-[12px] rounded-lg gap-1.5",
      md: "h-10 px-4 text-[13px] rounded-[10px] gap-2",
      lg: "h-12 px-6 text-[14px] rounded-[10px] gap-2",
    };

    const bgColors: Record<string, string> = {
      primary: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-primary)]",
      secondary: "bg-[var(--color-secondary)] hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-secondary)]",
      outline: "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-sage)] focus-visible:ring-[var(--color-primary)]",
      ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-sage)] hover:text-[var(--color-text)] focus-visible:ring-[var(--color-primary)]",
      danger: "bg-[var(--color-error)] hover:bg-red-700 focus-visible:ring-[var(--color-error)]",
      success: "bg-[var(--color-success)] hover:bg-green-700 focus-visible:ring-[var(--color-success)]",
    };

    return (
      <button ref={ref} className={classNames(base, variants[variant], sizes[size], bgColors[variant], className)} disabled={disabled || loading} {...props}>
        {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
