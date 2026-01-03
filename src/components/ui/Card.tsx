import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

/**
 * Card Component
 * 
 * Container component with consistent styling for displaying content.
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "interactive";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const baseStyles =
            "rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm";

        const variants = {
            default: "",
            interactive:
                "cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10",
        };

        return (
            <div
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Card sub-components
export const CardHeader = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-5 py-4 border-b border-slate-700/50", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 py-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "px-5 py-3 border-t border-slate-700/50 bg-slate-800/30",
            className
        )}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export default Card;
