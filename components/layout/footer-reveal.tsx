"use client";

export function FooterReveal({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      <div
        className="relative z-10 flex min-h-dvh flex-col bg-background"
        style={{ marginBottom: "100dvh" }}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-full z-20 h-[200px] bg-gradient-to-b from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.5)] to-transparent"
        />
      </div>
      {footer}
    </>
  );
}
