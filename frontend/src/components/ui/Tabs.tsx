"use client";
import { useState } from "react";
import { classNames } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab: controlledTab, onChange, className }: TabsProps) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id || "");
  const activeTab = controlledTab ?? internalTab;

  const handleChange = (id: string) => {
    setInternalTab(id);
    onChange(id);
  };

  return (
    <div role="tablist" className={classNames("flex gap-1 p-1 rounded-[12px]", className)} style={{ backgroundColor: "var(--color-sage)" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => handleChange(tab.id)}
          className={classNames(
            "flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12px] font-medium transition-all duration-200",
            activeTab === tab.id ? "bg-white dark:bg-[var(--color-card)] shadow-sm text-[var(--color-primary-dark)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={classNames("text-[10px] px-1.5 py-0.5 rounded-full", activeTab === tab.id ? "bg-[var(--color-sage)]" : "bg-white/50 dark:bg-[var(--color-card)]/50")}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
