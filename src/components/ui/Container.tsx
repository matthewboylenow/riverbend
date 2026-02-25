import { cn } from "@/lib/utils";

interface ContainerProps {
  size?: "narrow" | "default" | "wide";
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const widths = {
  narrow: "max-w-[900px]",
  default: "max-w-[1280px]",
  wide: "max-w-[1440px]",
};

export function Container({
  size = "default",
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        widths[size],
        className
      )}
    >
      {children}
    </Component>
  );
}
