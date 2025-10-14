import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "../lib/utils";

interface EnhancedToastProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info" | "default";
  onClose?: () => void;
}

const variantConfig = {
  success: {
    icon: CheckCircle2,
    bgClass: "bg-green-500/10 border-green-500/50",
    iconClass: "text-green-500",
    titleClass: "text-green-100",
  },
  error: {
    icon: XCircle,
    bgClass: "bg-red-500/10 border-red-500/50",
    iconClass: "text-red-500",
    titleClass: "text-red-100",
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-yellow-500/10 border-yellow-500/50",
    iconClass: "text-yellow-500",
    titleClass: "text-yellow-100",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-500/10 border-blue-500/50",
    iconClass: "text-blue-500",
    titleClass: "text-blue-100",
  },
  default: {
    icon: Info,
    bgClass: "bg-gray-800 border-gray-700",
    iconClass: "text-gray-400",
    titleClass: "text-white",
  },
};

export function EnhancedToast({ 
  title, 
  description, 
  variant = "default",
  onClose 
}: EnhancedToastProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <ToastPrimitives.Root
      className={cn(
        "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[swipe=end]:animate-out",
        "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
        "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        config.bgClass
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.iconClass)} />
      
      <div className="flex-1 grid gap-1">
        <ToastPrimitives.Title 
          className={cn("text-sm font-semibold", config.titleClass)}
        >
          {title}
        </ToastPrimitives.Title>
        {description && (
          <ToastPrimitives.Description className="text-sm text-gray-400">
            {description}
          </ToastPrimitives.Description>
        )}
      </div>

      <ToastPrimitives.Close
        onClick={onClose}
        className={cn(
          "rounded-md p-1 text-gray-400 opacity-70 transition-all hover:opacity-100 hover:bg-white/10",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/20"
        )}
      >
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
}
