import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-500">
      <div className="rounded-full bg-gray-800/50 p-6 mb-6">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          data-testid="button-empty-state-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingEmptyState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full border-4 border-gray-800 border-t-orange-500 animate-spin"></div>
      </div>
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

export function ErrorEmptyState({ 
  message = "Something went wrong", 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-red-500/10 p-6 mb-6">
        <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {message}
      </h3>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-4"
          data-testid="button-error-retry"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
