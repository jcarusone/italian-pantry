"use client"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buildCheckoutUrl } from "@/lib/format"
import { cn } from "@/lib/utils"

export function CheckoutButton({
  checkoutUrl,
  className,
  label = "Proceed to checkout",
}: {
  checkoutUrl: string
  className?: string
  label?: string
}) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  function handleCheckout() {
    setIsRedirecting(true)
    const url = buildCheckoutUrl(checkoutUrl)

    // Shopify checkout refuses to render inside an iframe, so break out of it.
    if (window.self !== window.top) {
      window.open(url, "_blank", "noopener,noreferrer")
      setIsRedirecting(false)
      return
    }

    window.location.href = url
  }

  return (
    <Button
      size="lg"
      onClick={handleCheckout}
      disabled={isRedirecting}
      className={cn("group h-12 w-full rounded-sm text-sm", className)}
    >
      {isRedirecting ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          {label}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
    </Button>
  )
}
