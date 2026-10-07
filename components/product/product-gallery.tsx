"use client";

import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { ShopifyImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/**
 * Product image slider: the whole image always fits the frame (no cropping or zoom),
 * with arrows, swipe, keyboard and a thumbnail strip underneath.
 */
export function ProductGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = useCallback(
    (next: number, dir?: number) => {
      if (count < 2) return;
      const wrapped = (next + count) % count;
      setState(([current]) => [wrapped, dir ?? (wrapped > current ? 1 : -1)]);
    },
    [count],
  );

  // Keep the active thumbnail in view when the strip scrolls.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (strip && thumb) {
      strip.scrollTo({
        left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [index]);

  if (count === 0) {
    return <div className="aspect-square w-full rounded-lg bg-secondary" aria-hidden="true" />;
  }

  const current = images[Math.min(index, count - 1)];

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1, 1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1, -1);
  }

  return (
    <div
      className="flex flex-col gap-3 lg:sticky lg:top-28"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} images`}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1, 1);
        if (event.key === "ArrowLeft") go(index - 1, -1);
      }}
    >
      <div className="group relative aspect-square w-full overflow-hidden rounded-lg bg-secondary">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current.url}
            custom={direction}
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
            variants={{
              enter: (dir: number) => ({ x: dir >= 0 ? "12%" : "-12%", opacity: 0 }),
              center: { x: "0%", opacity: 1 },
              exit: (dir: number) => ({ x: dir >= 0 ? "-12%" : "12%", opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
          >
            <Image
              src={current.url || "/placeholder.svg"}
              alt={current.altText || `${title}, image ${index + 1} of ${count}`}
              fill
              priority={index === 0}
              draggable={false}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="pointer-events-none object-contain p-6 select-none sm:p-8"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-limestone/90 text-frantoio shadow-sm backdrop-blur transition-opacity hover:bg-limestone md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span className="sr-only">Previous image</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-limestone/90 text-frantoio shadow-sm backdrop-blur transition-opacity hover:bg-limestone md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
              <span className="sr-only">Next image</span>
            </button>
            <p
              className="absolute right-3 bottom-3 rounded-full bg-frantoio/75 px-2.5 py-1 text-[0.75rem] font-medium text-limestone tabular-nums"
              aria-live="polite"
            >
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div ref={thumbsRef} className="-mx-1 flex gap-2.5 overflow-x-auto p-1 [scrollbar-width:none]" data-lenis-prevent>
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index}
              className={cn(
                "relative size-18 shrink-0 overflow-hidden rounded-md bg-secondary transition-[opacity,box-shadow] duration-300",
                i === index
                  ? "opacity-100 ring-1 ring-frantoio ring-offset-2 ring-offset-limestone"
                  : "opacity-55 hover:opacity-100",
              )}
            >
              <Image src={image.url || "/placeholder.svg"} alt="" fill sizes="72px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
