import { classNames } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={classNames("rounded-[16px] border p-5 transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5", className)}
      style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-card)" }}>
      <div className="w-11 h-11 rounded-[12px] flex items-center justify-center mb-3" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }}>
        {icon}
      </div>
      <h4 className="text-[14px] font-semibold mb-1" style={{ color: "var(--color-text)" }}>{title}</h4>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{description}</p>
    </div>
  );
}
