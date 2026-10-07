import { Fragment, type ReactNode } from "react";

/** Split a "lines" field into its designed heading lines. */
export function toLines(value: string): string[] {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length ? lines : [""];
}

/** Split long text into paragraphs on blank lines. */
export function toParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Render **bold** and *italic* inside a line of text. Everything else is plain text. */
export function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {toParagraphs(text).map((paragraph, index) => (
        <p key={index} className={className}>
          {inline(paragraph)}
        </p>
      ))}
    </>
  );
}

/** Strip the formatting marks, for places that need plain text (metadata, aria labels). */
export function plain(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}
