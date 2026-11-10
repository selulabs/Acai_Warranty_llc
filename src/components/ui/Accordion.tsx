import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  groupName: string;
}

export default function Accordion({ items, groupName }: AccordionProps) {
  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item, index) => (
        <details key={item.question} name={groupName} className="group" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-[17px] font-semibold text-black transition-colors hover:text-primary-600 [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              size={20}
              aria-hidden="true"
              className="shrink-0 text-primary-600 transition-transform duration-300 group-open:rotate-180"
            />
          </summary>
          <p className="pb-6 pr-10 leading-[1.5] text-neutral-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
