"use client";
import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { classNames } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={id || undefined} className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--color-text)" }}>{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: "var(--color-muted-light)" }}>{icon}</div>}
          <input
            ref={ref}
            type={type}
            id={id}
            className={classNames(
              "w-full h-10 rounded-[10px] border bg-white dark:bg-[var(--color-card)] text-[13px] placeholder:text-[var(--color-muted-light)] focus:outline-none focus:ring-2 transition-all",
              icon ? "pl-10 pr-4" : "px-4",
              error ? "border-[var(--color-error)] focus:ring-[var(--color-error)]" : "border-[var(--color-border)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]",
              className
            )}
            style={{ color: "var(--color-text)" }}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] mt-1" style={{ color: "var(--color-error)" }}>{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
