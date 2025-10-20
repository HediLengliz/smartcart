import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartBadgeProps {
  itemCount: number;
  onClick?: () => void;
}

export default function CartBadge({ itemCount, onClick }: CartBadgeProps) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      data-testid="button-cart"
      className="relative hover-elevate active-elevate-2"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs font-bold"
          data-testid="badge-cart-count"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Button>
  );
}
