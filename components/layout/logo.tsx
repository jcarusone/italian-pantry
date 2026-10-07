import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGOS = {
  /** Black and gold, for light grounds. */
  dark: { src: "/italian-pantry-logo.webp", width: 1290, height: 410 },
  /** White with the tricolore rule, for dark grounds. */
  light: { src: "/italian-pantry-logo-white-with-flag.webp", width: 1282, height: 422 },
} as const;

export function Logo({
  className,
  variant = "dark",
  priority = false,
}: {
  className?: string;
  variant?: keyof typeof LOGOS;
  priority?: boolean;
}) {
  const logo = LOGOS[variant];
  return (
    <Image
      src={logo.src}
      alt="Italian Pantry"
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={cn("h-10 w-auto shrink-0", className)}
    />
  );
}
