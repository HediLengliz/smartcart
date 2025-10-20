import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FAQAccordion from "@/components/FAQAccordion";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: remove mock functionality - these will come from API
  const allFAQs = [
    {
      id: 1,
      question: "How do I create a shopping list?",
      answer: "Click on the 'Shopping Lists' section and then click 'Create New List'. You can add items manually or from your product browsing experience. Each item can have a specific quantity and unit."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment gateway. Your payment information is encrypted and we never store your full card details."
    },
    {
      id: 3,
      question: "How does AI recommendation work?",
      answer: "Our AI analyzes your previous orders and shopping patterns to suggest products you might be interested in. The more you shop, the better the recommendations become, helping you discover new items and save time."
    },
    {
      id: 4,
      question: "Can I share my shopping lists?",
      answer: "Yes! You can link your Facebook account in your dashboard and share your shopping lists with friends and family. This is perfect for collaborative shopping or planning events together."
    },
    {
      id: 5,
      question: "How do I track my orders?",
      answer: "Visit the Orders section to see all your order history. Each order shows its current status (pending, completed, or failed) along with order details and payment information. You'll also receive email confirmations with receipts."
    },
    {
      id: 6,
      question: "What are trending products?",
      answer: "Trending products are items that are popular among our customers based on recent order frequency and popularity metrics. This section is updated regularly to show you what's hot right now."
    },
  ];

  const filteredFAQs = allFAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold" data-testid="text-faq-title">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground">Find answers to common questions about SmartShop</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for answers..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-faq"
        />
      </div>

      <FAQAccordion items={filteredFAQs} />

      {filteredFAQs.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No FAQs found matching "{searchQuery}"
        </div>
      )}

      <div className="rounded-lg border bg-muted/50 p-6 text-center">
        <MessageCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Still have questions?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Our AI chatbot will be available soon to help you instantly
        </p>
        <Button disabled data-testid="button-chatbot-placeholder">
          AI Assistant (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
