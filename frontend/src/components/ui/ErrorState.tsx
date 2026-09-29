import { AlertCircle } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--color-text)" }}>{title}</h3>
      <p className="text-[13px] max-w-sm mb-4" style={{ color: "var(--color-muted)" }}>{message}</p>
      {onRetry && <Button onClick={onRetry} variant="outline" size="sm">Try Again</Button>}
    </div>
  );
}
