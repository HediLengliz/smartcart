import { Package, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderCardProps {
  id: number;
  orderNumber: string;
  date: string;
  status: "pending" | "completed" | "failed";
  total: number;
  itemCount: number;
  onViewDetails?: () => void;
}

export default function OrderCard({
  id,
  orderNumber,
  date,
  status,
  total,
  itemCount,
  onViewDetails,
}: OrderCardProps) {
  const statusVariant = {
    pending: "default" as const,
    completed: "secondary" as const,
    failed: "destructive" as const,
  };

  const statusColor = {
    pending: "text-orange-600 dark:text-orange-500",
    completed: "text-green-600 dark:text-green-500",
    failed: "text-red-600 dark:text-red-500",
  };

  return (
    <Card className="hover-elevate" data-testid={`card-order-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm font-medium" data-testid={`text-order-number-${id}`}>
              #{orderNumber}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span data-testid={`text-order-date-${id}`}>{date}</span>
          </div>
        </div>
        
        <Badge variant={statusVariant[status]} data-testid={`badge-order-status-${id}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span className="font-medium" data-testid={`text-order-items-${id}`}>{itemCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-bold" data-testid={`text-order-total-${id}`}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={onViewDetails}
          data-testid={`button-view-order-${id}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
