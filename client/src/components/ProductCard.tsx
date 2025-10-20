import { useState } from "react";
import { Plus, Minus, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  onAddToCart?: (quantity: number) => void;
  onQuickView?: () => void;
}

export default function ProductCard({
  id,
  name,
  price,
  stock,
  image,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart?.(quantity);
    console.log(`Added ${quantity}x ${name} to cart`);
  };

  const stockStatus = stock > 10 ? "in-stock" : stock > 0 ? "low-stock" : "out-of-stock";
  const stockColor = stock > 10 ? "text-green-600 dark:text-green-500" : stock > 0 ? "text-orange-600 dark:text-orange-500" : "text-red-600 dark:text-red-500";

  return (
    <Card className="group relative overflow-visible hover-elevate" data-testid={`card-product-${id}`}>
      <Button
        size="icon"
        variant="secondary"
        className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={onQuickView}
        data-testid={`button-quick-view-${id}`}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <CardContent className="p-4">
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-md bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            data-testid={`img-product-${id}`}
          />
        </div>
        
        <h3 className="mb-1 line-clamp-2 text-base font-semibold" data-testid={`text-product-name-${id}`}>
          {name}
        </h3>
        
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-bold" data-testid={`text-product-price-${id}`}>
            ${price.toFixed(2)}
          </p>
          <p className={`text-sm font-medium ${stockColor}`} data-testid={`text-product-stock-${id}`}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 p-4 pt-0">
        <div className="flex items-center rounded-md border">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={stock === 0}
            data-testid={`button-decrease-${id}`}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex h-9 w-10 items-center justify-center text-sm font-medium" data-testid={`text-quantity-${id}`}>
            {quantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={stock === 0}
            data-testid={`button-increase-${id}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={stock === 0}
          data-testid={`button-add-to-cart-${id}`}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
