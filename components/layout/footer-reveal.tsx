/**
 * On md+ viewports, the page lifts away to uncover the footer underneath (one full viewport of scroll).
 * On smaller screens the footer is in normal document flow so nothing is clipped.
 */
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
        className="relative z-10 flex min-h-dvh flex-col bg-background md:mb-[100dvh] md:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
      >
        {children}
      </div>
      <div className="relative z-0 md:fixed md:inset-x-0 md:bottom-0">{footer}</div>
    </>
  );
}
