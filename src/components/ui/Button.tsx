import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl disabled:opacity-50",
          variant === "primary" && "bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-200",
          variant === "ghost" && "bg-transparent hover:bg-slate-100 text-slate-500",
          variant === "danger" && "bg-transparent hover:bg-red-50 text-slate-400 hover:text-red-400",
          size === "md" && "px-4 py-2 text-sm gap-1.5",
          size === "sm" && "px-3 py-1.5 text-xs gap-1",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
