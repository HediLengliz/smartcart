import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.id} value={`item-${item.id}`} data-testid={`faq-item-${item.id}`}>
          <AccordionTrigger className="text-left text-lg font-semibold" data-testid={`faq-question-${item.id}`}>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${item.id}`}>
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
