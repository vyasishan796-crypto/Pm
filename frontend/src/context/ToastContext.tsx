"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast from "@/components/ui/Toast";

interface ToastItem { id: string; type: "success" | "error" | "warning" | "info"; message: string; }
interface ToastContextType { toast: (type: ToastItem["type"], message: string) => void; }

const ToastContext = createContext<ToastContextType>({ toast: () => {} });
export function useToast() { return useContext(ToastContext); }

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastItem["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => <Toast key={t.id} type={t.type} message={t.message} onClose={() => remove(t.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}
