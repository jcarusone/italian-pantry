"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/layout/section-heading";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/shopify/types";
import type { SectionContent } from "@/lib/cms/sections";
import { toLines } from "@/lib/cms/text";
import { cn } from "@/lib/utils";

const ALL = "Everything";

export function Collection({
  products,
  content,
}: {
  products: Product[];
  content: SectionContent<"home.collection">;
}) {
  const categories = useMemo(() => {
    const types = Array.from(new Set(products.map((p) => p.productType).filter(Boolean)));
    return [ALL, ...types];
  }, [products]);

  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? products : products.filter((p) => p.productType === active);

  return (
    <section id="collection" className="scroll-mt-24 py-24 md:py-36">
      <div className="site-container">
        <SectionHeading
          lines={toLines(content.heading)}
          description={content.description}
          action={content.action.label ? content.action : undefined}
        />

        {categories.length > 2 ? (
          <LayoutGroup>
            <div role="group" aria-label="Filter products" className="mt-12 flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = category === active;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActive(category)}
                    aria-pressed={isActive}
                    className={cn(
                      "relative h-11 rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-300",
                      isActive ? "text-limestone" : "text-frantoio/75 hover:text-frantoio",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="collection-chip"
                        className="absolute inset-0 -z-0 rounded-full bg-frantoio"
                        transition={{ type: "spring", bounce: 0.18, duration: 0.6 }}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full border border-frantoio/15" />
                    )}
                    <span className="relative">{category}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        ) : null}

        <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product, index) => (
              <motion.li
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} priority={index < 2} />
              </motion.li>
            ))}
            {active === ALL && content.showComingSoon ? (
              <motion.li
                key="pasta-soon"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-64 flex-col justify-end rounded-lg bg-frantoio p-6 text-limestone"
              >
                <p className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05]">
                  {content.comingSoonTitle}
                </p>
                <p className="mt-3 text-[0.9375rem] text-limestone/60">
                  {content.comingSoonBody}
                </p>
              </motion.li>
            ) : null}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
