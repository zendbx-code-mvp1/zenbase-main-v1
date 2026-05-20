import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({ 
  variant = "primary", 
  size = "md", 
  className,
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = "font-semibold rounded-lg transition inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white glow-orange",
    secondary: "glass hover:bg-dark-800 text-white",
    ghost: "text-gray-400 hover:text-white hover:bg-dark-800"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
