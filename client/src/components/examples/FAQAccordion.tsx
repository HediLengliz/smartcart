import FAQAccordion from '../FAQAccordion';

export default function FAQAccordionExample() {
  const mockFAQs = [
    {
      id: 1,
      question: "How do I create a shopping list?",
      answer: "Click on the 'Shopping Lists' section and then click 'Create New List'. You can add items manually or from your product browsing."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment gateway."
    },
    {
      id: 3,
      question: "How does AI recommendation work?",
      answer: "Our AI analyzes your previous orders and shopping patterns to suggest products you might be interested in, helping you discover new items and save time."
    },
  ];

  return (
    <div className="w-full max-w-2xl">
      <FAQAccordion items={mockFAQs} />
    </div>
  );
}
