import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onRemoveItem?: (id: number) => void;
  onCheckout?: () => void;
}

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-cart"
      />
      
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l bg-card shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold" data-testid="text-cart-title">
              Shopping Cart ({items.length})
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              data-testid="button-close-cart"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  Your cart is empty
                </div>
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="p-3" data-testid={`cart-item-${item.id}`}>
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-md border">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 rounded-r-none"
                              onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                              data-testid={`button-decrease-cart-${item.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="flex h-7 w-8 items-center justify-center text-xs">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 rounded-l-none"
                              onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                              data-testid={`button-increase-cart-${item.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onRemoveItem?.(item.id)}
                            data-testid={`button-remove-cart-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="text-xl font-bold" data-testid="text-cart-subtotal">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={onCheckout}
              disabled={items.length === 0}
              data-testid="button-checkout"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
