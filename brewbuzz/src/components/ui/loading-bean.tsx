import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingBeanProps {
    className?: string;
    size?: number;
}

export function LoadingBean({ className, size = 32 }: LoadingBeanProps) {
    return (
        <div
            className={cn(
                // Flex container to center everything
                "relative flex items-center justify-center",
                className
            )}
        >
            {/* Background Circle - adds visual weight/polish */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl transform scale-150 animate-pulse" />

            {/* The Icon - uses the system font/stroke style */}
            <div className="relative z-10 p-3 bg-white rounded-full shadow-sm border border-slate-100 animate-pulse">
                <Coffee
                    className="text-primary"
                    size={size}
                    strokeWidth={1.5} // Thinner stroke feels more "premium"
                />
            </div>
        </div>
    );
}