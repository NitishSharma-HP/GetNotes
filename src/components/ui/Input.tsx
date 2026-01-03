import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

/**
 * Input Component
 * 
 * Styled text input with optional label and error message.
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg",
                        "text-slate-100 placeholder-slate-500",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500",
                        "transition-all duration-200",
                        error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
