import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Sparkles } from "lucide-react";

export type LegalSection = {
  heading: string;
  body: string[];
};

export function LegalPage({
  eyebrow = "Legal",
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[-10%] h-[50%] w-[45%] rounded-full bg-purple-600/10 blur-[130px] mix-blend-screen" />
        <div className="absolute bottom-[15%] right-[-10%] h-[50%] w-[45%] rounded-full bg-accent-magenta/10 blur-[130px] mix-blend-screen" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.2em] text-accent-yellow">
            <Sparkles className="h-4 w-4 animate-pulse" />
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-wide text-white">
            {title}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-widest text-white/40">
            Last updated: {updated}
          </p>
          <p className="mt-6 text-base leading-relaxed text-white/70">{intro}</p>

          <div className="mt-12 space-y-10">
            {sections.map((section, index) => (
              <section key={section.heading}>
                <h2 className="font-display text-lg tracking-wide text-white">
                  <span className="mr-2 text-accent-yellow">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-white/65"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
