import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingListCard from "@/components/ShoppingListCard";

export default function ShoppingLists() {
  // TODO: remove mock functionality - these will come from API
  const mockLists = [
    {
      id: 1,
      title: "Weekly Groceries",
      createdAt: "2 days ago",
      items: [
        { id: 1, name: "Organic Apples", quantity: 2, unit: "kg", status: "completed", productId: 1 },
        { id: 2, name: "Whole Grain Bread", quantity: 1, unit: "loaf", status: "pending", productId: 2 },
        { id: 3, name: "Fresh Milk", quantity: 2, unit: "liters", status: "pending", productId: 3 },
      ],
    },
    {
      id: 2,
      title: "Party Supplies",
      createdAt: "1 week ago",
      items: [
        { id: 4, name: "Coffee Beans", quantity: 500, unit: "g", status: "completed", productId: 5 },
        { id: 5, name: "Orange Juice", quantity: 2, unit: "bottles", status: "completed", productId: 6 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold" data-testid="text-lists-title">
            Shopping Lists
          </h1>
          <p className="text-muted-foreground">Organize your shopping with custom lists</p>
        </div>
        <Button data-testid="button-create-list" onClick={() => console.log('Create new list')}>
          <Plus className="mr-2 h-4 w-4" />
          Create List
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {mockLists.map((list) => (
          <ShoppingListCard
            key={list.id}
            {...list}
            onEdit={() => console.log(`Edit list ${list.id}`)}
            onDelete={() => console.log(`Delete list ${list.id}`)}
            onToggleItem={(itemId) => console.log(`Toggle item ${itemId}`)}
          />
        ))}
      </div>
    </div>
  );
}
