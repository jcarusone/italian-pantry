import { cn } from "@/lib/utils"

export function Logo({
  className,
  tone = "default",
}: {
  className?: string
  tone?: "default" | "inverted"
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "wordmark text-[1.0625rem] leading-none",
          tone === "inverted" ? "text-primary-foreground" : "text-foreground",
        )}
      >
        Italian Pantry
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5",
          tone === "inverted" ? "bg-accent" : "bg-primary",
        )}
      />
    </span>
  )
}
