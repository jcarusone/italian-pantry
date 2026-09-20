"use client";

import { useState } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: ShopifyImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return (
      <div
        className="aspect-square w-full rounded-lg bg-secondary"
        aria-hidden="true"
      />
    );
  }

  const current = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative object-contain h-[75vh] w-full overflow-hidden rounded-lg bg-secondary">
        <Image
          src={current.url || "/placeholder.svg"}
          alt={current.altText || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain py-4"
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {gallery.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${gallery.length}`}
              aria-current={index === active}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-secondary transition-colors",
                index === active
                  ? "border-primary"
                  : "border-transparent hover:border-primary/40",
              )}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
