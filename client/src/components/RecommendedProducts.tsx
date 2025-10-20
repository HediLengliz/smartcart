import { Lightbulb, Flame } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface RecommendedProductsProps {
  products: Product[];
  type: "recommended" | "trending";
  onAddToCart?: (productId: number, quantity: number) => void;
  onQuickView?: (productId: number) => void;
}

export default function RecommendedProducts({
  products,
  type,
  onAddToCart,
  onQuickView,
}: RecommendedProductsProps) {
  const icon = type === "recommended" ? Lightbulb : Flame;
  const title = type === "recommended" ? "Recommended for You" : "Trending Now";
  const subtitle = type === "recommended" 
    ? "Based on your previous orders" 
    : "Popular products this week";

  return (
    <div className="space-y-4" data-testid={`section-${type}`}>
      <div className="flex items-center gap-2">
        {icon === Lightbulb ? (
          <Lightbulb className="h-5 w-5 text-primary" />
        ) : (
          <Flame className="h-5 w-5 text-orange-600 dark:text-orange-500" />
        )}
        <div>
          <h2 className="text-2xl font-bold" data-testid={`text-${type}-title`}>
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={(qty) => onAddToCart?.(product.id, qty)}
            onQuickView={() => onQuickView?.(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
