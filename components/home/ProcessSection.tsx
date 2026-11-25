import { Container } from "@/components/layout/Container";
import { Mascot } from "@/components/mascot/Mascot";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-heading" className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="process-heading" className="heading-bar font-display text-3xl font-bold text-teal sm:text-4xl">
            Our Process <span className="font-medium text-ink">— From Idea to Reality</span>
          </h2>
          <p aria-hidden="true" className="-rotate-6 font-script text-2xl leading-none text-teal sm:text-3xl">
            On time. On budget!
          </p>
        </div>

        <div className="relative mt-12">
          {/* Dashed connector behind the steps (desktop) */}
          <svg aria-hidden="true" className="process-line pointer-events-none absolute top-[42%] left-[12%] hidden h-4 w-[76%] lg:block" preserveAspectRatio="none" viewBox="0 0 100 4">
            <path d="M0 2 H100" stroke="var(--color-orange)" strokeWidth="3" strokeDasharray="8 8" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>

          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 120} className="relative text-center">
              <div className="relative mx-auto flex h-48 w-full max-w-60 items-end justify-center">
                <span className="absolute top-2 left-2 z-10 inline-flex size-10 items-center justify-center rounded-full bg-yellow font-display text-lg font-bold text-ink shadow-md ring-4 ring-cream">
                  {i + 1}
                </span>
                <div className="absolute inset-x-6 bottom-2 h-28 rounded-[50%] bg-beige" aria-hidden="true" />
                <Mascot pose={step.pose} className="relative h-48 w-auto" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">{step.title}</h3>
              <p className="mx-auto mt-1 max-w-56 text-[0.95rem] leading-snug text-ink-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
        </div>
      </Container>
    </section>
  );
}
