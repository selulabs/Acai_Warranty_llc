import { ButtonLink } from '@/components/ui/Button';

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalDocumentProps {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalDocument({ title, intro, sections }: LegalDocumentProps) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 lg:py-28">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-700">Legal</p>
      <h1 className="mt-4 text-black">{title}</h1>

      <div role="note" className="mt-8 rounded-lg border border-warning-500/40 bg-warning-50 p-5 text-[15px] text-warning-700">
        <strong className="font-semibold">Draft for review.</strong> This page is a placeholder draft and must be reviewed by
        ACAI Warranty LLC and qualified legal counsel before it is published or relied upon.
      </div>

      <p className="mt-8 text-[17px] text-neutral-600">{intro}</p>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[26px] sm:text-[30px]">{section.heading}</h2>
            <div className="mt-4 space-y-4 text-[16px] text-neutral-600">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 border-t border-neutral-200 pt-10">
        <p className="text-neutral-600">Questions about this page? Visit our contact page to reach ACAI Warranty LLC.</p>
        <ButtonLink to="/contact" variant="outline" className="mt-6">
          Contact Us
        </ButtonLink>
      </div>
    </article>
  );
}
