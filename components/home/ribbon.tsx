
/** The rhombus from the Arrizza label, used as the ribbon separator. */
function Mark() {
  return (
    <svg viewBox="0 0 12 20" aria-hidden="true" className="h-3.5 w-auto shrink-0 text-olio">
      <path d="M6 0 12 10 6 20 0 10Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Ribbon({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-center gap-10 pr-10 whitespace-nowrap">
          <span className="font-display text-[1.375rem] italic">{item}</span>
          <Mark />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Our standards in brief" className="overflow-hidden border-y border-limestone/10 bg-frantoio py-5 text-limestone/85">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
