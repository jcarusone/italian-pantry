"use client";

import { forwardRef, useEffect, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/* Small, consistent building blocks for the admin. */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function buttonClasses(variant: ButtonProps["variant"] = "secondary", size: ButtonProps["size"] = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50",
    size === "sm" ? "h-8 px-3.5 text-[0.8125rem]" : "h-10 px-5 text-[0.875rem]",
    variant === "primary" && "bg-frantoio text-limestone hover:bg-leaf",
    variant === "secondary" && "border border-frantoio/20 bg-white text-frantoio hover:border-frantoio/50",
    variant === "ghost" && "text-frantoio/75 hover:bg-frantoio/6 hover:text-frantoio",
    variant === "danger" && "border border-pomodoro/30 bg-white text-pomodoro hover:bg-pomodoro hover:text-white",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />;
});

const fieldBase =
  "w-full rounded-lg border border-frantoio/15 bg-white px-3.5 text-[0.9375rem] text-frantoio shadow-[0_1px_0_rgba(0,0,0,0.02)] outline-none transition-colors placeholder:text-frantoio/35 focus:border-leaf focus:ring-3 focus:ring-leaf/15";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(fieldBase, "h-10", className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(fieldBase, "py-2.5 leading-relaxed", className)} {...props} />;
  },
);

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, "h-10 pr-8", className)} {...props} />;
}

export function Field({
  label,
  help,
  htmlFor,
  children,
  className,
}: {
  label: string;
  help?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[0.875rem] font-semibold text-frantoio">
        {label}
      </label>
      {children}
      {help ? <p className="text-[0.8125rem] leading-snug text-frantoio/55">{help}</p> : null}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-3 text-[0.9375rem] select-none">
      <span className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-10 rounded-full bg-frantoio/20 transition-colors peer-checked:bg-leaf peer-focus-visible:ring-3 peer-focus-visible:ring-leaf/30" />
        <span className="absolute top-1 left-1 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
      {label}
    </label>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-frantoio/10 bg-white p-6", className)}>{children}</div>;
}

export function PageTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h1 className="font-display text-[2.25rem] leading-tight">{title}</h1>
        {description ? <p className="mt-2 text-[0.9375rem] leading-relaxed text-frantoio/60">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "green" | "amber"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[0.75rem] font-semibold",
        tone === "neutral" && "bg-frantoio/8 text-frantoio/70",
        tone === "green" && "bg-leaf/12 text-leaf",
        tone === "amber" && "bg-olio/25 text-[#6d5413]",
      )}
    >
      {children}
    </span>
  );
}

/** Accessible modal built on the native <dialog> element. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[88vh] w-[calc(100%-2rem)] overflow-hidden rounded-2xl bg-limestone p-0 text-frantoio shadow-2xl backdrop:bg-frantoio/50 backdrop:backdrop-blur-sm",
        wide ? "max-w-5xl" : "max-w-lg",
      )}
    >
      {open ? (
        <div className="flex max-h-[88vh] flex-col">
          <div className="flex items-center justify-between border-b border-frantoio/10 px-6 py-4">
            <h2 className="font-display text-[1.5rem]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-full hover:bg-frantoio/8"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="overflow-y-auto p-6">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}

/** Ask before leaving a page with unsaved changes. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
