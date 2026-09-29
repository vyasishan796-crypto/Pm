"use client";
import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { classNames } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="w-full">
        {label && <label htmlFor={id || undefined} className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--color-text)" }}>{label}</label>}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: "var(--color-muted-light)" }} />
          <input
            ref={ref}
            type={show ? "text" : "password"}
            id={id}
            className={classNames(
              "w-full h-10 rounded-[10px] border bg-white dark:bg-[var(--color-card)] text-[13px] pl-10 pr-10 placeholder:text-[var(--color-muted-light)] focus:outline-none focus:ring-2 transition-all",
              error ? "border-[var(--color-error)] focus:ring-[var(--color-error)]" : "border-[var(--color-border)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]",
              className
            )}
            style={{ color: "var(--color-text)" }}
            {...props}
          />
          <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10" style={{ color: "var(--color-muted-light)" }}>
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-[11px] mt-1" style={{ color: "var(--color-error)" }}>{error}</p>}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
