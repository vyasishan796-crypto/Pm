"use client";
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { classNames } from "@/lib/utils";

interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors: Record<string, string> = {
  success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
};

export default function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = icons[type];

  return (
    <div role="alert" aria-live="polite" className={classNames("toast-enter flex items-center gap-3 px-4 py-3 rounded-[12px] border shadow-lg max-w-sm", colors[type])}>
      <Icon className="w-4 h-4 shrink-0" />
      <p className="text-[13px] font-medium flex-1">{message}</p>
      <button aria-label="Close" onClick={onClose} className="p-0.5 rounded hover:bg-black/5"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}
