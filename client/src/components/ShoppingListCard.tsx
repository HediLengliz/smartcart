import { useState } from "react";
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ListItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  status: string;
  productId?: number;
}

interface ShoppingListCardProps {
  id: number;
  title: string;
  createdAt: string;
  items: ListItem[];
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleItem?: (itemId: number) => void;
}

export default function ShoppingListCard({
  id,
  title,
  createdAt,
  items,
  onEdit,
  onDelete,
  onToggleItem,
}: ShoppingListCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const completedCount = items.filter(item => item.status === "completed").length;

  return (
    <Card className="hover-elevate" data-testid={`card-list-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold" data-testid={`text-list-title-${id}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-list-date-${id}`}>
            {createdAt}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" data-testid={`badge-list-count-${id}`}>
            {completedCount}/{items.length}
          </Badge>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            data-testid={`button-edit-list-${id}`}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            data-testid={`button-delete-list-${id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            data-testid={`button-toggle-list-${id}`}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-2 pt-0">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-md border p-3 hover-elevate"
              data-testid={`item-list-item-${item.id}`}
            >
              <Checkbox
                checked={item.status === "completed"}
                onCheckedChange={() => onToggleItem?.(item.id)}
                data-testid={`checkbox-item-${item.id}`}
              />
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} {item.unit}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
