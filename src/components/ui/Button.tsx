import Link from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "btn-camp inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-camp-red disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-camp-red text-white shadow-[0_1px_3px_rgba(196,30,58,0.3),0_4px_12px_rgba(196,30,58,0.15)] hover:bg-camp-red-dark hover:shadow-[0_2px_6px_rgba(196,30,58,0.4),0_8px_24px_rgba(196,30,58,0.2)] hover:scale-[1.02] active:scale-[0.98]",
      secondary:
        "border-2 border-camp-red text-camp-red bg-transparent hover:bg-camp-red hover:text-white hover:scale-[1.02] active:scale-[0.98]",
      ghost:
        "text-charcoal underline underline-offset-4 decoration-1 hover:text-camp-red hover:decoration-camp-red bg-transparent",
      white:
        "bg-white text-charcoal shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:bg-cream hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-5 py-2 text-[0.8125rem]",
      md: "px-8 py-3 text-[0.9375rem]",
      lg: "px-10 py-4 text-[1.0625rem]",
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
