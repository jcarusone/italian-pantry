import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGO_WIDTH = 1282;
const LOGO_HEIGHT = 422;

const LOGO_SRC = {
  header: "/italian-pantry-logo.webp",
  footer: "/italian-pantry-logo-white-with-flag.webp",
} as const;

export function Logo({
  className,
  variant = "header",
  priority = false,
  opacity = 100,
}: {
  className?: string;
  variant?: keyof typeof LOGO_SRC;
  priority?: boolean;
  opacity?: number;
}) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt="Italian Pantry"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn("h-9 w-auto shrink-0 sm:h-10", className)}
      style={{ opacity: opacity / 100 }}
    />
  );
}
