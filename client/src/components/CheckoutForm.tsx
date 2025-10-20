import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckoutFormProps {
  total: number;
  onSubmit?: (paymentData: any) => void;
}

export default function CheckoutForm({ total, onSubmit }: CheckoutFormProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment submitted:', paymentData);
    onSubmit?.(paymentData);
  };

  return (
    <Card data-testid="card-checkout">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Enter your payment information securely
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={paymentData.cardName}
              onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
              data-testid="input-card-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              data-testid="input-card-number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                maxLength={5}
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                data-testid="input-expiry"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                maxLength={4}
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                data-testid="input-cvv"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveCard"
              checked={paymentData.saveCard}
              onCheckedChange={(checked) => 
                setPaymentData({ ...paymentData, saveCard: checked as boolean })
              }
              data-testid="checkbox-save-card"
            />
            <label
              htmlFor="saveCard"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Save card for future purchases
            </label>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Total Amount</span>
              <span className="text-2xl font-bold" data-testid="text-checkout-total">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" data-testid="button-pay">
            <Lock className="mr-2 h-4 w-4" />
            Pay ${total.toFixed(2)}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your payment information is encrypted and secure
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
