interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-accent)" }}>
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--color-text)" }}>{title}</h3>
      {description && <p className="text-[13px] max-w-sm" style={{ color: "var(--color-muted)" }}>{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
