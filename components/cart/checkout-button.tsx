"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { pillClasses } from "@/components/ui/pill";
import { buildCheckoutUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CheckoutButton({
  checkoutUrl,
  className,
  label = "Check out securely",
}: {
  checkoutUrl: string;
  className?: string;
  label?: string;
}) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  function handleCheckout() {
    setIsRedirecting(true);
    const url = buildCheckoutUrl(checkoutUrl);

    // Shopify checkout refuses to render inside an iframe, so break out of it.
    if (window.self !== window.top) {
      window.open(url, "_blank", "noopener,noreferrer");
      setIsRedirecting(false);
      return;
    }

    window.location.href = url;
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isRedirecting}
      className={pillClasses("dark", cn("w-full", className))}
    >
      {isRedirecting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : label}
    </button>
  );
}
