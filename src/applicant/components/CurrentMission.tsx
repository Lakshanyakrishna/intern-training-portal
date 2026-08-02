import type { ReactNode } from 'react';

// The heart of the interface -- everything else on the page (journey
// tracker, activity feed, help panel) is stable chrome; this section is the
// only thing that changes as the applicant moves through stages. Kept as a
// thin semantic wrapper (not its own bordered card) since each stage
// component already renders its own card chrome internally.
export default function CurrentMission({ children }: { children: ReactNode }) {
  return (
    <section aria-label="Current mission" aria-live="polite" className="animate-[fadeIn_0.25s_ease-out]">
      {children}
    </section>
  );
}
