import { Check, X } from "lucide-react";

import { MaskLines, Reveal } from "@/components/motion/reveal";
import type { SectionContent } from "@/lib/cms/sections";
import { Paragraphs, toLines } from "@/lib/cms/text";

export function LabelGuide({ content }: { content: SectionContent<"home.labelGuide"> }) {
  return (
    <section className="pb-24 md:pb-36">
      <div className="site-container grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <MaskLines
            lines={toLines(content.heading)}
            className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.04]"
          />
          <Reveal className="mt-8 flex flex-col gap-5 text-muted-foreground">
            <Paragraphs text={content.body} />
          </Reveal>
        </div>

        {content.rows.length ? (
          <Reveal className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
            <table className="on-dark w-full overflow-hidden rounded-2xl bg-frantoio text-left text-limestone">
              <caption className="sr-only">
                How {content.columnOurs} compares with {content.columnTheirs.toLowerCase()} products
              </caption>
              <thead className="max-sm:sr-only">
                <tr className="text-[0.875rem] text-limestone/60">
                  <th scope="col" className="p-5 font-medium md:px-7">{content.columnCriteria}</th>
                  <th scope="col" className="p-5 font-semibold text-olio md:px-7">{content.columnOurs}</th>
                  <th scope="col" className="p-5 font-medium md:px-7">{content.columnTheirs}</th>
                </tr>
              </thead>
              <tbody className="text-[0.9375rem]">
                {content.rows.map((row, index) => (
                  <tr
                    key={`${row.label}-${index}`}
                    className="border-t border-limestone/10 first:border-t-0 max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-4 max-sm:px-5 max-sm:py-4 sm:first:border-t"
                  >
                    <th scope="row" className="font-normal text-limestone/85 max-sm:col-span-2 max-sm:pb-2 sm:p-5 md:px-7">
                      {row.label}
                    </th>
                    <td className="sm:p-5 md:px-7">
                      <span className="block text-[0.75rem] text-limestone/50 sm:hidden">{content.columnOurs}</span>
                      <span className="flex items-center gap-2 font-semibold">
                        <Check className="size-4 shrink-0 text-olio" aria-hidden="true" />
                        {row.ours}
                      </span>
                    </td>
                    <td className="text-limestone/55 sm:p-5 md:px-7">
                      <span className="block text-[0.75rem] text-limestone/50 sm:hidden">{content.columnTheirs}</span>
                      <span className="flex items-center gap-2">
                        <X className="size-4 shrink-0 text-[#e2826f]" aria-hidden="true" />
                        {row.theirs}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
