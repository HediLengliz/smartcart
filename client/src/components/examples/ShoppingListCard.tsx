import ShoppingListCard from '../ShoppingListCard';

export default function ShoppingListCardExample() {
  const mockItems = [
    { id: 1, name: "Organic Apples", quantity: 2, unit: "kg", status: "completed", productId: 1 },
    { id: 2, name: "Whole Grain Bread", quantity: 1, unit: "loaf", status: "pending", productId: 2 },
    { id: 3, name: "Fresh Milk", quantity: 2, unit: "liters", status: "pending", productId: 3 },
  ];

  return (
    <div className="w-full max-w-2xl">
      <ShoppingListCard
        id={1}
        title="Weekly Groceries"
        createdAt="2 days ago"
        items={mockItems}
        onEdit={() => console.log('Edit list')}
        onDelete={() => console.log('Delete list')}
        onToggleItem={(id) => console.log(`Toggle item ${id}`)}
      />
    </div>
  );
}
