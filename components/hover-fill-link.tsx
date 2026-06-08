import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type HoverFillVariant =
  | "light"
  | "dark"
  | "nav-on-light"
  | "nav-on-dark";

const variantStyles: Record<
  HoverFillVariant,
  {
    link: string;
    fill: string;
    text: string;
    textActive?: string;
  }
> = {
  light: {
    link: "border-foreground/30 hover:border-background/40",
    fill: "bg-foreground",
    text: "text-foreground group-hover:text-background",
  },
  dark: {
    link: "border-background/30 hover:border-foreground/40",
    fill: "bg-background",
    text: "text-background group-hover:text-foreground",
  },
  "nav-on-light": {
    link: "",
    fill: "bg-foreground",
    text: "text-muted-foreground group-hover:text-background",
    textActive: "text-foreground group-hover:text-background",
  },
  "nav-on-dark": {
    link: "",
    fill: "bg-background",
    text: "text-background/70 group-hover:text-foreground",
    textActive: "text-background group-hover:text-foreground",
  },
};

type HoverFillLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  variant?: HoverFillVariant;
  active?: boolean;
  fullWidth?: boolean;
  showArrow?: boolean;
  contentClassName?: string;
  children: ReactNode;
};

export function HoverFillLink({
  variant = "light",
  active = false,
  fullWidth = false,
  showArrow = false,
  contentClassName,
  className,
  children,
  href,
  ...props
}: HoverFillLinkProps) {
  const styles = variantStyles[variant];
  const hasBorder = variant === "light" || variant === "dark";
  const textClass = cn(
    "transition-colors duration-300",
    active && styles.textActive ? styles.textActive : styles.text,
  );

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100",
          styles.fill,
        )}
      />
      <span
        className={cn(
          "relative z-10 inline-flex items-baseline gap-3",
          textClass,
          contentClassName,
        )}
      >
        {children}
        {showArrow ? (
          <ArrowUpRight
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ) : null}
      </span>
    </>
  );

  const linkClassName = cn(
    "group relative inline-flex items-baseline overflow-hidden transition-colors duration-300",
    hasBorder && "border-b",
    fullWidth ? "w-full justify-between gap-4 py-3" : "w-fit px-1 py-1",
    hasBorder && "text-sm font-medium tracking-wide",
    styles.link,
    className,
  );

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={linkClassName} {...(props as ComponentProps<"a">)}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName} {...props}>
      {content}
    </Link>
  );
}
