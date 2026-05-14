import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50",
        "outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100",
        "placeholder:text-slate-300 transition-all duration-150",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
