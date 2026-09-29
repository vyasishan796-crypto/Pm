"use client";
import { useState, useId } from "react";
import { classNames } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ children, content, side = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const tooltipId = useId();
  const positions: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div aria-describedby={show ? tooltipId : undefined}>{children}</div>
      {show && (
        <div id={tooltipId} role="tooltip" className={classNames("absolute z-50 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-md pointer-events-none animate-fade-in", positions[side])}
          style={{ backgroundColor: "var(--color-text)", color: "var(--color-background)" }}>
          {content}
        </div>
      )}
    </div>
  );
}
