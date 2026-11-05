import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion className="rounded-[1.75rem] bg-card px-5 shadow-sm ring-1 ring-border sm:px-7">
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q} className="border-border">
          <AccordionTrigger className="min-h-14 items-center py-4 text-lg font-semibold hover:no-underline focus-visible:ring-0">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-base text-muted-foreground">
            <p>{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** FAQPage structured data for search engines. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
