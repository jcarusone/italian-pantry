"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

type ContactTurnstileProps = {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
  onError?: () => void;
};

export function ContactTurnstile({ siteKey, onTokenChange, onError }: ContactTurnstileProps) {
  const ref = useRef<TurnstileInstance>(null);

  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      options={{ theme: "light", size: "flexible" }}
      onSuccess={(token) => onTokenChange(token)}
      onExpire={() => {
        onTokenChange(null);
        ref.current?.reset();
      }}
      onError={() => {
        onTokenChange(null);
        onError?.();
      }}
    />
  );
}
