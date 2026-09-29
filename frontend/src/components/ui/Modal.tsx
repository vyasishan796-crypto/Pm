"use client";
import { useEffect, useRef, useId } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { classNames } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const modalEl = modalRef.current;
    const focusableEls = modalEl.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusableEls.length > 0) {
      focusableEls[0].focus();
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const allFocusable = modalEl.querySelectorAll<HTMLElement>(focusableSelector);
      const first = allFocusable[0];
      const last = allFocusable[allFocusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    modalEl.addEventListener("keydown", handleTab);
    return () => modalEl.removeEventListener("keydown", handleTab);
  }, [open]);

  const sizes: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div ref={overlayRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={classNames("relative w-full rounded-[16px] border shadow-[var(--shadow-lg)] p-5", sizes[size])}
            style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border-light)" }}
          >
            <div className="flex items-center justify-between mb-4">
              {title && <h3 id={titleId} className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>{title}</h3>}
              <button aria-label="Close" onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-sage)] transition-colors ml-auto" style={{ color: "var(--color-muted)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
