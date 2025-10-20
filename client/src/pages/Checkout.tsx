import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CheckoutForm from "@/components/CheckoutForm";
import applesImg from '@assets/generated_images/Product_image_red_apples_284e8d69.png';
import breadImg from '@assets/generated_images/Product_image_artisan_bread_95f14847.png';

export default function Checkout() {
  // TODO: remove mock functionality - these will come from cart state
  const cartItems = [
    { id: 1, name: "Organic Red Apples", price: 4.99, quantity: 2, image: applesImg },
    { id: 2, name: "Artisan Bread", price: 5.49, quantity: 1, image: breadImg },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold" data-testid="text-checkout-title">
          Checkout
        </h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm
            total={total}
            onSubmit={(data) => console.log('Payment submitted:', data)}
          />
        </div>

        <div>
          <Card data-testid="card-order-summary">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3" data-testid={`summary-item-${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span data-testid="text-shipping">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
